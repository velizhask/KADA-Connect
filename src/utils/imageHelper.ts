/**
 * Image Helper Utilities
 * Handles image URL processing and error handling for consistent image display across the application
 */

const API_BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:3001/api";

/**
 * Convert image URL to proxy URL if needed for CORS issues
 * @param imageUrl - Original image URL
 * @returns Processed image URL (proxy or original)
 */
export function getImageUrl(imageUrl?: string): string | undefined {
  if (!imageUrl || imageUrl.trim() === '') {
    return undefined;
  }

  // If it's already a proxy URL, return as-is
  if (imageUrl.includes('/api/proxy/image')) {
    return imageUrl;
  }

  // If it's a relative URL, convert to absolute
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  // Handle Google Drive URLs - use proxy to bypass CORS
  if (imageUrl.includes('drive.google.com')) {
    const encodedUrl = encodeURIComponent(imageUrl);
    return `${API_BASE_URL.replace('/api', '')}/api/proxy/image?url=${encodedUrl}`;
  }

  // Handle other external domains that might have CORS issues
  const needsProxyDomains = [
    'lh3.googleusercontent.com',
    'cdn.pixabay.com',
    'images.unsplash.com',
    'images.pexels.com'
  ];

  try {
    const url = new URL(imageUrl);
    if (needsProxyDomains.some(domain => url.hostname.toLowerCase().includes(domain))) {
      const encodedUrl = encodeURIComponent(imageUrl);
      return `${API_BASE_URL.replace('/api', '')}/api/proxy/image?url=${encodedUrl}`;
    }
  } catch (error) {
    console.warn('[Image Helper] Invalid URL format:', imageUrl);
  }

  // Return original URL for other cases
  return imageUrl;
}

/**
 * Get default placeholder image URL
 * @param type - Type of placeholder (company, profile, etc.)
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(type: 'company' | 'profile' = 'company'): string {
  const placeholders = {
    company: 'https://via.placeholder.com/150x150/6366f1/ffffff?text=No+Logo',
    profile: 'https://via.placeholder.com/150x150/6366f1/ffffff?text=No+Photo'
  };

  return placeholders[type];
}

/**
 * Image component props with error handling
 */
export interface ImageProps {
  src?: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Handle image error with fallback
 * @param event - Error event from image element
 * @param fallbackSrc - Fallback image source
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackSrc?: string
): void {
  const target = event.target as HTMLImageElement;

  if (!target.dataset.fallbackTried) {
    target.dataset.fallbackTried = 'true';
    const finalFallback = fallbackSrc || getPlaceholderImage('company');
    target.src = finalFallback;
    console.warn(`[Image Helper] Image failed to load, using fallback: ${target.src}`);
  }
}

/**
 * Generate image source with error handling
 * @param imageUrl - Original image URL
 * @param placeholderType - Type of placeholder to use on error
 * @returns Object with src and onError handler
 */
export function getImageProps(imageUrl?: string, placeholderType: 'company' | 'profile' = 'company'): {
  src?: string;
  onError: (event: React.SyntheticEvent<HTMLImageElement>) => void;
} {
  const processedSrc = getImageUrl(imageUrl);
  const placeholder = getPlaceholderImage(placeholderType);

  return {
    src: processedSrc,
    onError: (event: React.SyntheticEvent<HTMLImageElement>) => {
      handleImageError(event, placeholder);
    }
  };
}

/**
 * Check if URL is a Google Drive URL
 * @param url - URL to check
 * @returns True if Google Drive URL
 */
export function isGoogleDriveUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com');
}

/**
 * Check if URL needs proxy for CORS
 * @param url - URL to check
 * @returns True if URL needs proxy
 */
export function needsProxy(url?: string): boolean {
  if (!url) return false;

  return isGoogleDriveUrl(url) ||
    ['lh3.googleusercontent.com', 'cdn.pixabay.com', 'images.unsplash.com', 'images.pexels.com']
      .some(domain => {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname.toLowerCase().includes(domain);
        } catch {
          return false;
        }
      });
}

export default {
  getImageUrl,
  getPlaceholderImage,
  handleImageError,
  getImageProps,
  isGoogleDriveUrl,
  needsProxy
};