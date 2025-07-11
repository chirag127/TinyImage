import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const quality = parseInt(formData.get('quality') as string) || 80;
    const format = formData.get('format') as string || 'jpeg';
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined;

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size too large. Maximum 10MB allowed.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 });
    }

    if (quality < 1 || quality > 100) {
      return NextResponse.json({ error: 'Quality must be between 1 and 100' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get original image metadata
    const metadata = await sharp(buffer).metadata();
    const originalSize = buffer.length;

    // Create sharp instance
    let sharpInstance = sharp(buffer);

    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Apply compression based on format
    let compressedBuffer: Buffer;
    let mimeType: string;

    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        compressedBuffer = await sharpInstance
          .jpeg({ quality, progressive: true, mozjpeg: true })
          .toBuffer();
        mimeType = 'image/jpeg';
        break;
      case 'png':
        compressedBuffer = await sharpInstance
          .png({ 
            quality, 
            compressionLevel: 9,
            progressive: true,
            palette: quality < 90 // Use palette for lower quality
          })
          .toBuffer();
        mimeType = 'image/png';
        break;
      case 'webp':
        compressedBuffer = await sharpInstance
          .webp({ quality, effort: 6 })
          .toBuffer();
        mimeType = 'image/webp';
        break;
      default:
        return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }

    const compressedSize = compressedBuffer.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    // Return compressed image with metadata
    return new NextResponse(compressedBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': compressedSize.toString(),
        'X-Original-Size': originalSize.toString(),
        'X-Compressed-Size': compressedSize.toString(),
        'X-Compression-Ratio': compressionRatio,
        'X-Original-Width': metadata.width?.toString() || '',
        'X-Original-Height': metadata.height?.toString() || '',
        'Content-Disposition': `attachment; filename="compressed_${file.name.split('.')[0]}.${format}"`,
      },
    });

  } catch (error) {
    console.error('Compression error:', error);
    return NextResponse.json(
      { error: 'Failed to compress image. Please try again.' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Image compression API is running',
    supportedFormats: ['jpeg', 'png', 'webp'],
    maxFileSize: '10MB'
  });
}
