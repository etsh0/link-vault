const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// Collections
export function getCollections() {
  return request('/collections');
}

export function createCollection(collection) {
  return request('/collections', {
    method: 'POST',
    body: JSON.stringify(collection),
  });
}

export function updateCollection(id, updates) {
  return request(`/collections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export function deleteCollection(id) {
  return request(`/collections/${id}`, {
    method: 'DELETE',
  });
}

// Bookmarks
export function getAllBookmarks() {
  return request('/bookmarks');
}

export function getBookmarks({ collectionId, q, sort } = {}) {
  const params = new URLSearchParams();

  if (collectionId === 'col-fav') {
    params.set('isFavorite', 'true');
  } else if (collectionId && collectionId !== 'col-all') {
    params.set('collectionId', collectionId);
  }

  if (q?.trim()) {
    params.set('q', q.trim());
  }

  const sortMap = {
    newest: ['createdAt', 'desc'],
    oldest: ['createdAt', 'asc'],
    title: ['title', 'asc'],
    domain: ['domain', 'asc'],
  };
  const [sortField, sortOrder] = sortMap[sort] || sortMap.newest;
  params.set('_sort', sortField);
  params.set('_order', sortOrder);

  return request(`/bookmarks?${params.toString()}`);
}

export function createBookmark(bookmark) {
  return request('/bookmarks', {
    method: 'POST',
    body: JSON.stringify(bookmark),
  });
}

export function updateBookmark(id, updates) {
  return request(`/bookmarks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export function deleteBookmark(id) {
  return request(`/bookmarks/${id}`, {
    method: 'DELETE',
  });
}
