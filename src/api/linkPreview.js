export function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Fetches page metadata from linkpreview.net and falls back gracefully
 * if the API key is missing, rate-limited, or the request fails.
 */
export async function fetchLinkPreview(url) {
  const apiKey = import.meta.env.VITE_LINKPREVIEW_API_KEY?.trim();
  const hostname = getHostname(url);

  const fallback = {
    title: hostname,
    description: '',
    image: '',
    url,
    usedFallback: true,
  };

  if (!apiKey) {
    return fallback;
  }

  try {
    const res = await fetch(
      `https://api.linkpreview.net/?q=${encodeURIComponent(url)}`,
      {
        headers: {
          'X-Linkpreview-Api-Key': apiKey,
        },
      }
    );

    if (!res.ok) {
      return fallback;
    }

    const data = await res.json();
    return {
      title: data.title?.trim() || hostname,
      description: data.description?.trim() || '',
      image: data.image?.trim() || '',
      url: data.url?.trim() || url,
      usedFallback: !data.title && !data.description && !data.image,
    };
  } catch {
    return fallback;
  }
}
