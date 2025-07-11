const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const ICONS_DIR = path.join(ASSETS_DIR, 'icons');
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Icon configurations
const iconConfigs = [
  {
    input: path.join(ICONS_DIR, 'favicon.svg'),
    outputs: [
      { file: 'favicon-16x16.png', size: 16 },
      { file: 'favicon-32x32.png', size: 32 },
      { file: 'favicon-96x96.png', size: 96 },
      { file: 'favicon.png', size: 32 },
      { file: 'apple-touch-icon.png', size: 180 },
      { file: 'android-chrome-192x192.png', size: 192 },
      { file: 'android-chrome-512x512.png', size: 512 }
    ]
  },
  {
    input: path.join(ICONS_DIR, 'logo.svg'),
    outputs: [
      { file: 'logo-64x64.png', size: 64 },
      { file: 'logo-128x128.png', size: 128 },
      { file: 'logo-256x256.png', size: 256 },
      { file: 'logo.png', size: 128 }
    ]
  }
];

// Function to convert SVG to PNG
async function convertSvgToPng(inputPath, outputPath, size) {
  try {
    await sharp(inputPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        progressive: true
      })
      .toFile(outputPath);
    
    console.log(`✅ Generated: ${path.basename(outputPath)} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Error generating ${outputPath}:`, error.message);
  }
}

// Main function
async function generatePngs() {
  console.log('🚀 Starting PNG generation...\n');

  // Check if input files exist
  for (const config of iconConfigs) {
    if (!fs.existsSync(config.input)) {
      console.error(`❌ Input file not found: ${config.input}`);
      continue;
    }

    console.log(`📁 Processing: ${path.basename(config.input)}`);

    // Generate all output sizes for this input
    for (const output of config.outputs) {
      const outputPath = path.join(OUTPUT_DIR, output.file);
      await convertSvgToPng(config.input, outputPath, output.size);
    }

    console.log(''); // Empty line for readability
  }

  // Generate additional assets
  console.log('🎨 Generating additional assets...');

  // Create a simple placeholder image for testing
  try {
    await sharp({
      create: {
        width: 400,
        height: 300,
        channels: 4,
        background: { r: 59, g: 130, b: 246, alpha: 0.1 }
      }
    })
    .png()
    .composite([
      {
        input: Buffer.from(`
          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.1" />
                <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0.1" />
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#grad)" />
            <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="24" fill="#6B7280">
              TinyImage
            </text>
            <text x="200" y="180" text-anchor="middle" font-family="Arial" font-size="14" fill="#9CA3AF">
              Image Compression Tool
            </text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .toFile(path.join(OUTPUT_DIR, 'og-image.png'));

    console.log('✅ Generated: og-image.png (400x300)');
  } catch (error) {
    console.error('❌ Error generating og-image.png:', error.message);
  }

  console.log('\n🎉 PNG generation completed!');
  
  // List all generated files
  console.log('\n📋 Generated files:');
  const files = fs.readdirSync(OUTPUT_DIR).filter(file => file.endsWith('.png'));
  files.forEach(file => {
    const filePath = path.join(OUTPUT_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`   ${file} (${sizeKB} KB)`);
  });
}

// Run the script
if (require.main === module) {
  generatePngs().catch(console.error);
}

module.exports = { generatePngs };
