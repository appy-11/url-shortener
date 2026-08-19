/**
 * PageLoader component for rendering a loading indicator while pages are being fetched.
 * This component displays a spinning loader and a "Loading..." message to inform users that content is being loaded. 
 */
const PageLoader = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />

        Loading...
      </div>
    </div>
  );
};

export default PageLoader;