/**
 * Compresses an image file while maintaining quality
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<Blob> - Compressed image as Blob
 */
export async function compressImage(
  file: File,
  options: {
    quality?: number; // 0.1 to 1.0
    maxWidth?: number; // Maximum width in pixels
    maxHeight?: number; // Maximum height in pixels
    mimeType?: string; // Output mime type (e.g., 'image/jpeg', 'image/png')
  } = {}
): Promise<Blob> {
  const {
    quality = 0.8,
    maxWidth = 1200,
    maxHeight = 1200,
    mimeType = "image/jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw image with new dimensions
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"));
              return;
            }
            resolve(blob);
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses multiple image files
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @returns Promise<File[]> - Array of compressed files
 */
export async function compressImages(
  files: File[],
  options?: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    mimeType?: string;
  }
): Promise<File[]> {
  const compressedFiles: File[] = [];

  for (const file of files) {
    try {
      const compressedBlob = await compressImage(file, options);
      const compressedFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
        lastModified: Date.now(),
      });
      compressedFiles.push(compressedFile);
    } catch (error) {
      console.error(`Error compressing file ${file.name}:`, error);
      // Fallback to original file if compression fails
      compressedFiles.push(file);
    }
  }

  return compressedFiles;
}
