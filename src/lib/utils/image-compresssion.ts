// import imageCompression from "browser-image-compression";

// async function compressImage(file: File): Promise<File> {
//   const options = {
//     maxSizeMB: 1,          // Max file size (MB)
//     maxWidthOrHeight: 1200, // Resize if larger
//     useWebWorker: true,     // Offloads work to a separate thread
//   };
//   return await imageCompression(file, options);
// }
/**
 * Compresses an image file while maintaining quality
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<Blob> - Compressed image as Blob
 */
// export async function compressImage(
//   file: File,
//   options: {
//     quality?: number; // 0.1 to 1.0
//     maxWidth?: number; // Maximum width in pixels
//     maxHeight?: number; // Maximum height in pixels
//     mimeType?: string; // Output mime type (e.g., 'image/jpeg', 'image/png')
//   } = {}
// ): Promise<File> {
//   const {
//     quality = 0.8,
//     maxWidth = 1200,
//     maxHeight = 1200,
//     mimeType = "image/jpeg",
//   } = options;

//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         let width = img.width;
//         let height = img.height;

//         // Calculate new dimensions maintaining aspect ratio
//         if (width > maxWidth || height > maxHeight) {
//           const ratio = Math.min(maxWidth / width, maxHeight / height);
//           width = Math.floor(width * ratio);
//           height = Math.floor(height * ratio);
//         }

//         canvas.width = width;
//         canvas.height = height;

//         const ctx = canvas.getContext("2d");
//         if (!ctx) {
//           reject(new Error("Could not get canvas context"));
//           return;
//         }

//         // Draw image with new dimensions
//         ctx.drawImage(img, 0, 0, width, height);

//         // Convert to Blob with specified quality
//         // canvas.toBlob(
//         //   (blob) => {
//         //     if (!blob) {
//         //       reject(new Error("Canvas to Blob conversion failed"));
//         //       return;
//         //     }
//         //     resolve(blob);
//         //   },
//         //   mimeType,
//         //   quality
//         // );
//         canvas.toBlob(
//           (blob) => {
//             if (!blob) {
//               reject(new Error("Canvas to Blob conversion failed"));
//               return;
//             }
//             // Convert to File before resolving
//             const compressedFile = new File([blob], file.name, {
//               type: blob.type,
//               lastModified: Date.now(),
//             });
//             resolve(compressedFile);
//           },
//           mimeType,
//           quality
//         );
//       };
//       img.onerror = () => reject(new Error("Failed to load image"));
//       img.src = event.target?.result as string;
//     };
//     reader.onerror = () => reject(new Error("Failed to read file"));
//     reader.readAsDataURL(file);
//   });
// }

// export async function compressImage(
//   file: File,
//   options: {
//     quality?: number;
//     maxWidth?: number;
//     maxHeight?: number;
//     mimeType?: string;
//   } = {}
// ): Promise<File> {
//   const {
//     quality = 0.7,
//     maxWidth = 1200,
//     maxHeight = 1200,
//     mimeType = "image/webp", // Default to WebP for better compression
//   } = options;

//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         let width = img.width;
//         let height = img.height;

//         // Step 1: Calculate new dimensions
//         if (width > maxWidth || height > maxHeight) {
//           const ratio = Math.min(maxWidth / width, maxHeight / height);
//           width = Math.floor(width * ratio);
//           height = Math.floor(height * ratio);
//         }

//         canvas.width = width;
//         canvas.height = height;

//         const ctx = canvas.getContext("2d", { willReadFrequently: true });
//         if (!ctx) {
//           reject(new Error("Could not get canvas context"));
//           return;
//         }

//         // Step 2: Draw resized image
//         ctx.drawImage(img, 0, 0, width, height);

//         // Step 3: Convert to Blob
//         canvas.toBlob(
//           (blob) => {
//             if (!blob) {
//               reject(new Error("Canvas to Blob conversion failed"));
//               return;
//             }
//             // Cleanup
//             canvas.width = 0;
//             canvas.height = 0;
//             // Return as File
//             resolve(
//               new File([blob], file.name, {
//                 type: blob.type,
//                 lastModified: Date.now(),
//               })
//             );
//           },
//           mimeType,
//           quality
//         );
//       };
//       img.onerror = () => reject(new Error("Failed to load image"));
//       img.src = URL.createObjectURL(
//         new Blob([event.target?.result as ArrayBuffer], { type: file.type })
//       );
//     };
//     reader.onerror = () => reject(new Error("Failed to read file"));
//     reader.readAsArrayBuffer(file); // More efficient than DataURL
//   });
// }

import Compressor from "compressorjs";

export async function compressImage(file: File, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      maxWidth: 1200,
      maxHeight: 1200,
      success(result) {
        resolve(new File([result], file.name, { type: result.type }));
      },
      error(err) {
        reject(err);
      },
    });
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
      const compressedFile = await compressImage(file);
      compressedFiles.push(compressedFile);
    } catch (error) {
      console.error(`Error compressing file ${file.name}:`, error);
      // Fallback to original file if compression fails
      compressedFiles.push(file);
    }
  }

  return compressedFiles;
}
