const LoadingOverlay = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-slate-900 p-4 rounded-lg max-w-4xl max-h-[90vh]">
        <h1 className="text-2xl">Submitting... Please Wait.</h1>
      </div>
    </div>
  );
};
export default LoadingOverlay;
