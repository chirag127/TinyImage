'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploadProps {
  onFilesSelected: (files: ImageFile[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onFilesSelected, 
  maxFiles = 10, 
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => {
        const errorMessages = errors.map((e: any) => {
          switch (e.code) {
            case 'file-too-large':
              return `${file.name}: File is too large (max ${maxSize / 1024 / 1024}MB)`;
            case 'file-invalid-type':
              return `${file.name}: Invalid file type`;
            case 'too-many-files':
              return `Too many files (max ${maxFiles})`;
            default:
              return `${file.name}: ${e.message}`;
          }
        });
        return errorMessages.join(', ');
      });
      setError(errors.join('\n'));
      return;
    }

    // Process accepted files
    const newFiles: ImageFile[] = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    const updatedFiles = [...uploadedFiles, ...newFiles];
    
    if (updatedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploadedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  }, [uploadedFiles, onFilesSelected, maxFiles, maxSize]);

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => {
      if (file.id === id) {
        URL.revokeObjectURL(file.preview);
        return false;
      }
      return true;
    });
    setUploadedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
    setError('');
  };

  const clearAll = () => {
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setUploadedFiles([]);
    onFilesSelected([]);
    setError('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize,
    maxFiles: maxFiles - uploadedFiles.length,
    multiple: true
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${uploadedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={uploadedFiles.length >= maxFiles} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {isDragActive ? 'Drop images here...' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          or click to select files
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Supports JPEG, PNG, WebP • Max {formatFileSize(maxSize)} per file • Max {maxFiles} files
        </p>
        {uploadedFiles.length > 0 && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            {uploadedFiles.length} of {maxFiles} files selected
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* File Preview Grid */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Selected Images ({uploadedFiles.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((imageFile) => (
              <div key={imageFile.id} className="relative group">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={imageFile.preview}
                    alt={imageFile.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(imageFile.id)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mt-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={imageFile.file.name}>
                    {imageFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatFileSize(imageFile.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
