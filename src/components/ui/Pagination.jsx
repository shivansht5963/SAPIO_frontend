import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export default function Pagination({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 5,
  onPageChange,
  className = '',
}) {
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  function getPageNumbers() {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }

  return (
    <div className={`pagination ${className}`}>
      <span className="pagination__info">
        Showing {startItem} to {endItem} of {totalItems.toLocaleString()} entries
      </span>
      <div className="pagination__controls">
        <button
          className="pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {getPageNumbers().map((p, i) => (
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="pagination__ellipsis">...</span>
          ) : (
            <button
              key={p}
              className={`pagination__btn pagination__page ${p === page ? 'pagination__page--active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        ))}
        <button
          className="pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
