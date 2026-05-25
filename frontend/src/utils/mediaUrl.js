const backendUrl = 'http://localhost:4000';

export function mediaUrl(url, fallback = '/images/placeholders/product-placeholder.png') {
  if (!url) {
    return fallback;
  }

  if (url.startsWith('/uploads')) {
    return `${backendUrl}${url}`;
  }

  return url;
}
