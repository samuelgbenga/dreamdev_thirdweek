import Button from './Button';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="row-between" style={{ marginTop: 16 }}>
      <div className="muted" style={{ fontSize: 13 }}>
        Page {page + 1} of {totalPages}
      </div>
      <div className="row">
        <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => onPageChange(page - 1)}>Prev</Button>
        <Button variant="secondary" size="sm" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
