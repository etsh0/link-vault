import { Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500';
const labelCls = 'mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300';

const editSchema = Yup.object({
  title: Yup.string().trim().required('Title is required'),
  description: Yup.string(),
  image: Yup.string().trim().url('Enter a valid image URL').nullable(),
  collectionId: Yup.string(),
  notes: Yup.string(),
});

export default function EditBookmarkModal({
  bookmark,
  onClose,
  onSaveBookmark,
  customCollections,
}) {
  if (!bookmark) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[1px]">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Edit Bookmark
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Formik
          initialValues={{
            title: bookmark.title || '',
            description: bookmark.description || '',
            image: bookmark.image || '',
            collectionId: bookmark.collectionId || '',
            notes: bookmark.notes || '',
          }}
          enableReinitialize
          validationSchema={editSchema}
          onSubmit={(values) => {
            onSaveBookmark(bookmark.id, {
              title: values.title.trim(),
              description: values.description.trim(),
              image: values.image.trim(),
              collectionId: values.collectionId || null,
              notes: values.notes.trim(),
            });
            onClose();
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4 p-5">
              <div className="truncate rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {bookmark.url}
              </div>

              <div>
                <label htmlFor="title" className={labelCls}>
                  Title <span className="text-rose-500">*</span>
                </label>
                <Field
                  id="title"
                  name="title"
                  placeholder="Page title"
                  className={inputCls}
                />
                {touched.title && errors.title && (
                  <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className={labelCls}>
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={2}
                  placeholder="Short summary..."
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="image" className={labelCls}>
                  Cover Image URL
                </label>
                <Field
                  id="image"
                  name="image"
                  placeholder="https://example.com/og-image.png"
                  className={inputCls}
                />
                {touched.image && errors.image && (
                  <p className="mt-1 text-xs text-rose-600">{errors.image}</p>
                )}
              </div>

              <div>
                <label htmlFor="collectionId" className={labelCls}>
                  Collection
                </label>
                <Field
                  as="select"
                  id="collectionId"
                  name="collectionId"
                  className={inputCls}
                >
                  <option value="">No collection</option>
                  {customCollections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </Field>
              </div>

              <div>
                <label htmlFor="notes" className={labelCls}>
                  Notes
                </label>
                <Field
                  as="textarea"
                  id="notes"
                  name="notes"
                  rows={2}
                  placeholder="Personal notes or key takeaways..."
                  className={inputCls}
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Save Changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
