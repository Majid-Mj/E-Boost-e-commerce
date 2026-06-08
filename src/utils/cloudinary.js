/**
 * Helper utility to return Cloudinary image URLs.
 * If the image path is already a Cloudinary or remote URL (starts with http/https), it returns it as-is.
 * Otherwise, it maps local assets to the configured Cloudinary cloud bucket.
 */
export const getCloudinaryUrl = (imagePath) => {
  if (!imagePath) return "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=500&auto=format&fit=crop";
  
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's already an absolute local path (e.g. starting with "/" like "/assets/...")
  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  // If it's a relative path or filename, serve from local assets/products
  return `/assets/products/${imagePath}`;
};
