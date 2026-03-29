export default function PageWrapper({ children, title }) {
  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in">
      {title && (
        <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>
      )}
      {children}
    </div>
  );
}
