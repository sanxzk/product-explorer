import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  windowSize?: number;
}

const base = 'rounded-md px-4 py-2 text-slate-700 shadow-sm transition-colors';

const Pagination = ({ page, totalPages, onChange, windowSize = 4 }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const size = Math.min(windowSize, totalPages);
  const start = Math.max(1, Math.min(page - 1, totalPages - size + 1));
  const pages = Array.from({ length: size }, (_, i) => start + i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${base} flex items-center gap-2 bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <ArrowLeft size={16} /> Previous
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`${base} ${
            p === page ? 'bg-blue-500 text-white' : 'bg-white hover:bg-slate-50'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={`${base} flex items-center gap-2 bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Next <ArrowRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;