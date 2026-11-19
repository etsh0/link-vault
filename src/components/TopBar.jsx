import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Menu,
  X,
  ArrowUpDown,
  Sun,
  Moon,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function TopBar({
  darkMode,
  onToggleDarkMode,
  onOpenAddModal,
  onOpenMobileSidebar,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const viewMode = searchParams.get('view') || 'grid';

  function setFilterParam(key, value, defaultValue = '') {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === defaultValue) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      },
      { replace: true }
    );
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xs sm:px-6 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setFilterParam('q', e.target.value)}
              placeholder="Search titles, URLs, notes..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setFilterParam('q', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setFilterParam('sort', e.target.value, 'newest')}
              aria-label="Sort bookmarks"
              className="rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-7 text-xs font-medium text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A–Z)</option>
              <option value="domain">Domain (A–Z)</option>
            </select>
          </div>

          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setFilterParam('view', 'grid', 'grid')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setFilterParam('view', 'list', 'grid')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Add Link
          </button>
        </div>
      </div>
    </header>
  );
}
