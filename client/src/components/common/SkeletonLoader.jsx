const variants = {
  card: 'h-72 w-full rounded-[var(--radius-md)]',
  text: 'h-4 w-full rounded',
  circle: 'h-12 w-12 rounded-full',
  rectangle: 'h-32 w-full rounded-[var(--radius-md)]',
};

const SkeletonLoader = ({ variant = 'text', className = '', count = 1 }) => {
  const baseClass = variants[variant] || variants.text;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${baseClass} ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
