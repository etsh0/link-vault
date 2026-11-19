import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';

function CollectionLayout() {
  const { collectionId } = useParams();
  return <Layout activeCollectionId={collectionId} />;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            'text-xs font-medium dark:bg-slate-800 dark:text-slate-100 dark:border dark:border-slate-700',
        }}
      />
      <Routes>
        <Route path="/" element={<Layout activeCollectionId="col-all" />} />
        <Route path="/favorites" element={<Layout activeCollectionId="col-fav" />} />
        <Route path="/collections/:collectionId" element={<CollectionLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
