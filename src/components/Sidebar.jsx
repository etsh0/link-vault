import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Bookmark,
  Star,
  Folder,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';

const SMART_VIEWS = {
  'col-all': { icon: Bookmark, to: '/', end: true },
  'col-fav': { icon: Star, to: '/favorites', end: false },
};

function makeCollectionSchema(existingNames, currentName = '') {
  return Yup.object({
    name: Yup.string()
      .trim()
      .min(2, 'Min 2 chars')
      .max(30, 'Max 30 chars')
      .required('Name required')
      .test('unique', 'Collection already exists', (val) => {
        if (!val) return true;
        const normalized = val.trim().toLowerCase();
        if (currentName && normalized === currentName.trim().toLowerCase()) {
          return true;
        }
        return !existingNames.includes(normalized);
      }),
  });
}

const navItemCls = (isActive) =>
  `flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700'
      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
  }`;

export default function Sidebar({
  collections,
  bookmarks,
  onAddCollection,
  onRenameCollection,
  onDeleteCollection,
  isOpenMobile,
  onCloseMobile,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const systemCollections = collections.filter(
    (c) => c.isSystem && c.id !== 'col-unread'
  );
  const customCollections = collections.filter((c) => !c.isSystem);
  const existingNames = collections.map((c) => c.name.trim().toLowerCase());

  const getCount = (colId) => {
    if (colId === 'col-all') return bookmarks.length;
    if (colId === 'col-fav') return bookmarks.filter((b) => b.isFavorite).length;
    return bookmarks.filter((b) => b.collectionId === colId).length;
  };

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-slate-50 transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900">
              <Bookmark className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              LinkVault
            </span>
          </NavLink>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <div>
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Smart Views
            </p>
            <ul className="space-y-1">
              {systemCollections.map((col) => {
                const view = SMART_VIEWS[col.id] || {
                  icon: Bookmark,
                  to: '/',
                  end: true,
                };
                const Icon = view.icon;
                return (
                  <li key={col.id}>
                    <NavLink
                      to={view.to}
                      end={view.end}
                      onClick={onCloseMobile}
                      className={({ isActive }) => navItemCls(isActive)}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        {col.name}
                      </span>
                      <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {getCount(col.id)}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Collections
              </p>
              <button
                type="button"
                onClick={() => setIsAdding((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </button>
            </div>

            {isAdding && (
              <Formik
                initialValues={{ name: '' }}
                validationSchema={makeCollectionSchema(existingNames)}
                onSubmit={(values, { resetForm }) => {
                  onAddCollection(values.name.trim());
                  resetForm();
                  setIsAdding(false);
                }}
              >
                {({ errors, touched }) => (
                  <Form className="mb-2 rounded-lg border border-slate-200 bg-white p-2 shadow-xs dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Field
                        name="name"
                        placeholder="Collection name..."
                        autoFocus
                        className="w-full rounded-md border border-slate-200 bg-transparent px-2 py-1 text-xs text-slate-900 outline-none focus:border-slate-400 dark:border-slate-600 dark:text-slate-100 dark:focus:border-slate-500"
                      />
                      <button
                        type="submit"
                        className="rounded-md bg-slate-900 p-1 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                        aria-label="Save collection"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                        aria-label="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {touched.name && errors.name && (
                      <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
                        {errors.name}
                      </p>
                    )}
                  </Form>
                )}
              </Formik>
            )}

            <ul className="space-y-1">
              {customCollections.map((col) => {
                const isEditing = editingId === col.id;

                if (isEditing) {
                  return (
                    <li key={col.id}>
                      <Formik
                        initialValues={{ name: col.name }}
                        validationSchema={makeCollectionSchema(existingNames, col.name)}
                        onSubmit={(values) => {
                          onRenameCollection(col.id, values.name.trim());
                          setEditingId(null);
                        }}
                      >
                        {({ errors, touched }) => (
                          <Form className="rounded-lg border border-slate-200 bg-white p-2 shadow-xs dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-center gap-1">
                              <Field
                                name="name"
                                autoFocus
                                className="w-full rounded-md border border-slate-200 bg-transparent px-2 py-1 text-xs text-slate-900 outline-none focus:border-slate-400 dark:border-slate-600 dark:text-slate-100"
                              />
                              <button
                                type="submit"
                                className="rounded-md bg-slate-900 p-1 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                                aria-label="Confirm rename"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                                aria-label="Cancel rename"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            {touched.name && errors.name && (
                              <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
                                {errors.name}
                              </p>
                            )}
                          </Form>
                        )}
                      </Formik>
                    </li>
                  );
                }

                return (
                  <li key={col.id} className="group relative">
                    <NavLink
                      to={`/collections/${col.id}`}
                      onClick={onCloseMobile}
                      className={({ isActive }) => navItemCls(isActive)}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Folder className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">{col.name}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="hidden items-center gap-0.5 group-hover:flex">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditingId(col.id);
                            }}
                            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                            aria-label={`Rename ${col.name}`}
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDeleteCollection(col.id);
                            }}
                            className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-400"
                            aria-label={`Delete ${col.name}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {getCount(col.id)}
                        </span>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
