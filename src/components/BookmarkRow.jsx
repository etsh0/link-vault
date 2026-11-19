import { ExternalLink, Globe } from 'lucide-react';
import { getHostname } from '../api/linkPreview';
import BookmarkActions from './BookmarkActions';

export default function BookmarkRow({
  bookmark,
  collectionName,
  onToggleFavorite,
  onEdit,
  onDelete,
}) {
  const domain = getHostname(bookmark.url);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs transition-colors hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
          <Globe className="h-4 w-4 text-slate-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-sm font-semibold text-slate-900 hover:underline dark:text-slate-100"
            >
              {bookmark.title}
            </a>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open link"
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{domain}</span>
            {collectionName && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {collectionName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-2 sm:border-t-0 sm:pt-0 dark:border-slate-800">
        <BookmarkActions
          bookmark={bookmark}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
