'use client';

import React, { useState } from 'react';
import { Download, Settings, Zap, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface CompressionResult {
  id: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
  downloadUrl: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface CompressionSettings {
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
}

interface CompressionInterfaceProps {
  files: ImageFile[];
  onCompressionComplete?: () => void;
}

const CompressionInterface: React.FC<CompressionInterfaceProps> = ({ 
  files, 
  onCompressionComplete 
}) => {
  const [settings, setSettings] = useState<CompressionSettings>({
    quality: 80,
    format: 'jpeg',
    maintainAspectRatio: true
  });
  
  const [results, setResults] = useState<CompressionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressImage = async (imageFile: ImageFile): Promise<CompressionResult> => {
    const formData = new FormData();
    formData.append('file', imageFile.file);
    formData.append('quality', settings.quality.toString());
    formData.append('format', settings.format);
    
    if (settings.width) formData.append('width', settings.width.toString());
    if (settings.height) formData.append('height', settings.height.toString());

    try {
      const response = await fetch('/api/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Compression failed');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const originalSize = parseInt(response.headers.get('X-Original-Size') || '0');
      const compressedSize = parseInt(response.headers.get('X-Compressed-Size') || '0');
      const compressionRatio = response.headers.get('X-Compression-Ratio') || '0';
      
      const filename = `compressed_${imageFile.file.name.split('.')[0]}.${settings.format}`;

      return {
        id: imageFile.id,
        originalSize,
        compressedSize,
        compressionRatio,
        downloadUrl,
        filename,
        status: 'completed'
      };
    } catch (error) {
      return {
        id: imageFile.id,
        originalSize: imageFile.file.size,
        compressedSize: 0,
        compressionRatio: '0',
        downloadUrl: '',
        filename: '',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setResults([]);

    // Initialize results with pending status
    const initialResults: CompressionResult[] = files.map(file => ({
      id: file.id,
      originalSize: file.file.size,
      compressedSize: 0,
      compressionRatio: '0',
      downloadUrl: '',
      filename: '',
      status: 'pending'
    }));
    setResults(initialResults);

    // Process files one by one
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update status to processing
      setResults(prev => prev.map(result => 
        result.id === file.id 
          ? { ...result, status: 'processing' }
          : result
      ));

      // Compress the image
      const result = await compressImage(file);
      
      // Update with final result
      setResults(prev => prev.map(prevResult => 
        prevResult.id === file.id ? result : prevResult
      ));
    }

    setIsProcessing(false);
    onCompressionComplete?.();
  };

  const downloadFile = (result: CompressionResult) => {
    if (result.downloadUrl) {
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAll = () => {
    results
      .filter(result => result.status === 'completed' && result.downloadUrl)
      .forEach(result => downloadFile(result));
  };

  const getStatusIcon = (status: CompressionResult['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const completedResults = results.filter(r => r.status === 'completed');
  const totalOriginalSize = completedResults.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressedSize = completedResults.reduce((sum, r) => sum + r.compressedSize, 0);
  const overallSavings = totalOriginalSize > 0 
    ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)
    : '0';

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Upload images to start compressing
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Settings Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Compression Settings
          </h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showSettings ? 'Hide' : 'Show'} Advanced
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quality: {settings.quality}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Smaller</span>
              <span>Better Quality</span>
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Output Format
            </label>
            <select
              value={settings.format}
              onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          {/* Compress Button */}
          <div className="flex items-end">
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Compress {files.length} Image{files.length > 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Settings */}
        {showSettings && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Width (px)
                </label>
                <input
                  type="number"
                  placeholder="Auto"
                  value={settings.width || ''}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    width: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Height (px)
                </label>
                <input
                  type="number"
                  placeholder="Auto"
                  value={settings.height || ''}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    height: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Compression Results
            </h3>
            {completedResults.length > 0 && (
              <button
                onClick={downloadAll}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All
              </button>
            )}
          </div>

          {/* Overall Stats */}
          {completedResults.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Original Size</p>
                  <p className="text-lg font-semibold text-green-800 dark:text-green-300">
                    {formatFileSize(totalOriginalSize)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Compressed Size</p>
                  <p className="text-lg font-semibold text-green-800 dark:text-green-300">
                    {formatFileSize(totalCompressedSize)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Space Saved</p>
                  <p className="text-lg font-semibold text-green-800 dark:text-green-300">
                    {overallSavings}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Individual Results */}
          <div className="space-y-3">
            {results.map((result) => {
              const originalFile = files.find(f => f.id === result.id);
              return (
                <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {originalFile?.file.name}
                      </p>
                      {result.status === 'completed' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)} 
                          ({result.compressionRatio}% saved)
                        </p>
                      )}
                      {result.status === 'error' && (
                        <p className="text-xs text-red-500">{result.error}</p>
                      )}
                    </div>
                  </div>
                  
                  {result.status === 'completed' && (
                    <button
                      onClick={() => downloadFile(result)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded transition-colors duration-200 flex items-center"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompressionInterface;
