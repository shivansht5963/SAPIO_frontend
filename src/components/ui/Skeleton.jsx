import './Skeleton.css';

export function SkeletonLine({ width = '100%', height = '14px' }) {
  return <div className="skeleton" style={{ width, height }} />;
}

export function SkeletonCircle({ size = '36px' }) {
  return <div className="skeleton skeleton--circle" style={{ width: size, height: size }} />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <SkeletonLine width="40%" height="12px" />
      <SkeletonLine width="60%" height="28px" />
      <SkeletonLine width="80%" height="12px" />
    </div>
  );
}

export function SkeletonTableRow({ columns = 4 }) {
  return (
    <div className="skeleton-table-row">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonLine key={i} width={`${60 + Math.random() * 40}%`} />
      ))}
    </div>
  );
}
