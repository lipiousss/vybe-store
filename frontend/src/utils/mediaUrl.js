const localApiUrl = 'http://localhost:4000/api';
const productionApiUrl = '/api';
const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? productionApiUrl : localApiUrl);
const backendUrl = apiUrl.replace(/\/api\/?$/, '');

export function mediaUrl(url, fallback = '/images/placeholders/product-placeholder.png') {
  if (!url) {
    return fallback;
  }

  if (url.startsWith('/uploads')) {
    return `${backendUrl}${url}`;
  }

  return url;
}
