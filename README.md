# TinyImage 🚀

A modern, fast, and user-friendly image compression tool built with Next.js. Compress PNG, JPEG, and WebP images instantly without compromising quality.

![TinyImage Logo](public/logo-128x128.png)

## ✨ Features

-   **🔥 Lightning Fast**: Process multiple images simultaneously with optimized compression
-   **🎯 Quality Preserved**: Advanced algorithms maintain visual quality while reducing file size
-   **🔒 Privacy First**: All processing happens locally - your images never leave your device
-   **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
-   **🎨 Modern UI**: Clean, intuitive interface with dark mode support
-   **⚡ Batch Processing**: Upload and compress up to 10 images at once
-   **🔧 Advanced Settings**: Customize quality, format, and dimensions
-   **📊 Real-time Stats**: See compression ratios and file size savings instantly

## 🚀 Quick Start

### Prerequisites

-   Node.js 18.0 or later
-   npm, yarn, or pnpm

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/chirag127/TinyImage.git
    cd TinyImage
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Generate assets**

    ```bash
    npm run generate-assets
    ```

4. **Start the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Environment Setup

Create a `.env.local` file in the root directory (optional - no external APIs required):

```env
# Optional: Add any custom environment variables here
NEXT_PUBLIC_APP_NAME=TinyImage
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_MAX_FILES=10
```

### Environment Variables

| Variable                    | Description                | Default           |
| --------------------------- | -------------------------- | ----------------- |
| `NEXT_PUBLIC_APP_NAME`      | Application name           | `TinyImage`       |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | Maximum file size in bytes | `10485760` (10MB) |
| `NEXT_PUBLIC_MAX_FILES`     | Maximum number of files    | `10`              |

## 📁 Project Structure

```
TinyImage/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   └── compress/       # Image compression API
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   └── components/             # React components
│       ├── ImageUpload.tsx     # Drag & drop upload
│       └── CompressionInterface.tsx # Compression controls
├── assets/
│   └── icons/                  # Source SVG icons
├── scripts/
│   └── generate-pngs.js        # Asset generation script
├── public/                     # Static assets
└── package.json
```

## 🎯 Usage

### Basic Usage

1. **Upload Images**: Drag and drop images or click to select files
2. **Adjust Settings**: Choose quality, format, and optional dimensions
3. **Compress**: Click the compress button to process your images
4. **Download**: Download individual files or all at once

### Supported Formats

-   **Input**: JPEG, PNG, WebP
-   **Output**: JPEG, PNG, WebP

### Compression Options

-   **Quality**: 1-100% (higher = better quality, larger file)
-   **Format**: Convert between JPEG, PNG, and WebP
-   **Dimensions**: Optional width/height resizing
-   **Batch Processing**: Process multiple images simultaneously

## 🔧 API Reference

### POST `/api/compress`

Compress a single image file.

**Request Body (FormData):**

-   `file`: Image file (required)
-   `quality`: Compression quality 1-100 (default: 80)
-   `format`: Output format - 'jpeg', 'png', 'webp' (default: 'jpeg')
-   `width`: Optional width in pixels
-   `height`: Optional height in pixels

**Response Headers:**

-   `X-Original-Size`: Original file size in bytes
-   `X-Compressed-Size`: Compressed file size in bytes
-   `X-Compression-Ratio`: Compression percentage
-   `Content-Type`: Output image MIME type

**Example:**

```javascript
const formData = new FormData();
formData.append("file", imageFile);
formData.append("quality", "80");
formData.append("format", "jpeg");

const response = await fetch("/api/compress", {
    method: "POST",
    body: formData,
});

const compressedBlob = await response.blob();
```

### GET `/api/compress`

Health check endpoint.

**Response:**

```json
{
    "status": "ok",
    "message": "Image compression API is running",
    "supportedFormats": ["jpeg", "png", "webp"],
    "maxFileSize": "10MB"
}
```

## 🏗️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) with App Router
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/)
-   **File Upload**: [react-dropzone](https://react-dropzone.js.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 📦 Scripts

| Script                    | Description                        |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | Start development server           |
| `npm run build`           | Build for production               |
| `npm run start`           | Start production server            |
| `npm run lint`            | Run ESLint                         |
| `npm run generate-assets` | Generate PNG assets from SVG icons |

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

    ```bash
    git add .
    git commit -m "Initial commit"
    git push origin main
    ```

2. **Deploy to Vercel**
    - Visit [vercel.com](https://vercel.com)
    - Import your GitHub repository
    - Deploy with default settings

### Other Platforms

The app can be deployed to any platform that supports Node.js:

-   **Netlify**: Use `npm run build` and deploy the `.next` folder
-   **Railway**: Connect your GitHub repo and deploy
-   **DigitalOcean App Platform**: Use the Node.js buildpack
-   **AWS Amplify**: Deploy with the Next.js preset

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Guidelines

-   Follow the existing code style
-   Add tests for new features
-   Update documentation as needed
-   Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Chirag Singhal** ([@chirag127](https://github.com/chirag127))

-   GitHub: [https://github.com/chirag127](https://github.com/chirag127)
-   Project Link: [https://github.com/chirag127/TinyImage](https://github.com/chirag127/TinyImage)

## 🙏 Acknowledgments

-   [Sharp](https://sharp.pixelplumbing.com/) for excellent image processing
-   [Next.js](https://nextjs.org/) for the amazing React framework
-   [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
-   [Lucide](https://lucide.dev/) for beautiful icons

---

**Last Updated**: 2025-07-11T16:27:19.206Z

Made with ❤️ by [Chirag Singhal](https://github.com/chirag127)
