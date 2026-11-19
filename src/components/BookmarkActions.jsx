import { Star, Pencil, Trash2 } from 'lucide-react';

export default function BookmarkActions({
  bookmark,
  onToggleFavorite,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onToggleFavorite(bookmark.id)}
        title={bookmark.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        aria-label="Toggle favorite"
        className={`rounded-md p-1.5 transition-colors ${
          bookmark.isFavorite
            ? 'bg-amber-50 text-amber-500 hover:bg-amber-100 dark:bg-amber-500/15 dark:hover:bg-amber-500/25'
            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Star className={`h-4 w-4 ${bookmark.isFavorite ? 'fill-amber-400' : ''}`} />
      </button>

      <button
        type="button"
        onClick={() => onEdit(bookmark)}
        title="Edit bookmark"
        aria-label="Edit bookmark"
        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onDelete(bookmark.id)}
        title="Delete bookmark"
        aria-label="Delete bookmark"
        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
