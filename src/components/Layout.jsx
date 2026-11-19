import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bookmark, ExternalLink, Loader2, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getHostname } from '../api/linkPreview';
import {
  createBookmark,
  createCollection,
  deleteBookmark,
  deleteCollection,
  getAllBookmarks,
  getBookmarks,
  getCollections,
  updateBookmark,
  updateCollection,
} from '../api/vaultApi';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BookmarkCard from './BookmarkCard';
import BookmarkRow from './BookmarkRow';
import AddBookmarkModal from './AddBookmarkModal';
import EditBookmarkModal from './EditBookmarkModal';

export default function Layout({ activeCollectionId }) {
  const [collections, setCollections] = useState([]);
  const [allBookmarks, setAllBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useLocalStorage('lv_dark_mode', false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const viewMode = searchParams.get('view') || 'grid';

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  async function fetchMeta() {
    const [cols, bms] = await Promise.all([getCollections(), getAllBookmarks()]);
    setCollections(cols);
    setAllBookmarks(bms);
  }

  async function fetchFiltered() {
    const data = await getBookmarks({
      collectionId: activeCollectionId,
      q: searchQuery,
      sort: sortBy,
    });
    setFilteredBookmarks(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cols, bms, data] = await Promise.all([
          getCollections(),
          getAllBookmarks(),
          getBookmarks({
            collectionId: activeCollectionId,
            q: searchQuery,
            sort: sortBy,
          }),
        ]);
        if (!cancelled) {
          setCollections(cols);
          setAllBookmarks(bms);
          setFilteredBookmarks(data);
        }
      } catch {
        if (!cancelled) {
          toast.error('Cannot reach JSON API. Run "npm run api" on port 3001.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeCollectionId, searchQuery, sortBy]);

  const customCollections = collections.filter((c) => !c.isSystem);
  const collectionMap = Object.fromEntries(
    collections.map((c) => [c.id, c.name])
  );

  if (
    !isLoading &&
    collections.length > 0 &&
    !['col-all', 'col-fav'].includes(activeCollectionId) &&
    !collectionMap[activeCollectionId]
  ) {
    return <Navigate to="/" replace />;
  }

  const handleOpenAll = () => {
    if (filteredBookmarks.length === 0) return;
    if (
      filteredBookmarks.length > 5 &&
      !window.confirm(`Open ${filteredBookmarks.length} links in new tabs?`)
    ) {
      return;
    }
    filteredBookmarks.forEach((b) => {
      window.open(b.url, '_blank', 'noopener,noreferrer');
    });
    toast.success(`Opened ${filteredBookmarks.length} links`);
  };

  const handleAddBookmark = async (data) => {
    const newBookmark = {
      id: `bm-${Date.now()}`,
      ...data,
      domain: getHostname(data.url),
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };
    await createBookmark(newBookmark);
    await Promise.all([fetchMeta(), fetchFiltered()]);
    toast.success('Bookmark saved!');
  };

  const handleSaveBookmark = async (id, updates) => {
    await updateBookmark(id, updates);
    await Promise.all([fetchMeta(), fetchFiltered()]);
    toast.success('Bookmark updated!');
  };

  const handleToggleFavorite = async (id) => {
    const target = allBookmarks.find((b) => b.id === id);
    if (!target) return;
    await updateBookmark(id, { isFavorite: !target.isFavorite });
    await Promise.all([fetchMeta(), fetchFiltered()]);
  };

  const handleDeleteBookmark = async (id) => {
    const target = allBookmarks.find((b) => b.id === id);
    if (!target) return;

    await deleteBookmark(id);
    await Promise.all([fetchMeta(), fetchFiltered()]);
    toast(
      (t) => (
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="max-w-[180px] truncate">Deleted "{target.title}"</span>
          <button
            type="button"
            onClick={async () => {
              await createBookmark(target);
              await Promise.all([fetchMeta(), fetchFiltered()]);
              toast.dismiss(t.id);
            }}
            className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 font-semibold text-amber-300 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <RotateCcw className="h-3 w-3" />
            Undo
          </button>
        </div>
      ),
      { duration: 4000 }
    );
  };

  const handleAddCollection = async (name) => {
    const newCol = {
      id: `col-${Date.now()}`,
      name,
      isSystem: false,
    };
    await createCollection(newCol);
    await fetchMeta();
    toast.success(`Created "${name}"`);
  };

  const handleRenameCollection = async (id, name) => {
    await updateCollection(id, { name });
    await fetchMeta();
    toast.success('Collection renamed');
  };

  const handleDeleteCollection = async (id) => {
    const remainingCustom = collections.filter((c) => !c.isSystem && c.id !== id);
    const fallbackId = remainingCustom[0]?.id || null;
    const orphaned = allBookmarks.filter((b) => b.collectionId === id);

    await Promise.all([
      deleteCollection(id),
      ...orphaned.map((b) => updateBookmark(b.id, { collectionId: fallbackId })),
    ]);

    if (activeCollectionId === id) {
      navigate('/');
    }
    await Promise.all([fetchMeta(), fetchFiltered()]);
    toast.success('Collection deleted');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' || activeCollectionId !== 'col-all';

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    if (activeCollectionId !== 'col-all') {
      navigate('/');
    }
  };

  const activeTitle = collectionMap[activeCollectionId] || 'All Bookmarks';

  return (
    <div className="flex min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        collections={collections}
        bookmarks={allBookmarks}
        onAddCollection={handleAddCollection}
        onRenameCollection={handleRenameCollection}
        onDeleteCollection={handleDeleteCollection}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          onOpenAddModal={() => setIsAddOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {activeTitle}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {filteredBookmarks.length}{' '}
                {filteredBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
                >
                  Clear Filters
                </button>
              )}
              {filteredBookmarks.length > 0 && (
                <button
                  type="button"
                  onClick={handleOpenAll}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open All
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/40">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <Bookmark className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                No bookmarks found
              </h3>
              <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                {hasActiveFilters
                  ? 'Try adjusting your search query or selected collection.'
                  : 'Save your first link to start building your vault.'}
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  + Add Link
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  collectionName={collectionMap[bookmark.collectionId]}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={setEditingBookmark}
                  onDelete={handleDeleteBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkRow
                  key={bookmark.id}
                  bookmark={bookmark}
                  collectionName={collectionMap[bookmark.collectionId]}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={setEditingBookmark}
                  onDelete={handleDeleteBookmark}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <AddBookmarkModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddBookmark={handleAddBookmark}
        customCollections={customCollections}
        defaultCollectionId={activeCollectionId}
      />

      <EditBookmarkModal
        bookmark={editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSaveBookmark={handleSaveBookmark}
        customCollections={customCollections}
      />
    </div>
  );
}
