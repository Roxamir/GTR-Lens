const PageLayout = ({ children, center = false }) => {
  const baseClasses = "w-full px-4 py-8";

  const layoutClasses = center
    ? "flex flex-col items-center justify-center flex-grow"
    : "";

  return <div className={`${baseClasses} ${layoutClasses}`}>{children}</div>;
};

export default PageLayout;
