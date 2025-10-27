import React from 'react';

interface StarsProps {
  value: number; // 0-5, can be fractional (e.g., 4.2)
  size?: number; // pixel size for icons
  interactive?: boolean; // if true, clicking a star calls onChange
  onChange?: (v: number) => void;
}

const Star: React.FC<{ filled: boolean; size?: number; onClick?: () => void }> = ({ filled, size = 16, onClick }) => (
  <button type="button" onClick={onClick} className="focus:outline-none" aria-hidden>
    {filled ? (
      <svg className="text-yellow-500" width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.383 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.617 9.401c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
      </svg>
    ) : (
      <svg className="text-yellow-400" width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor">
        <path strokeWidth={1.2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.383 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.617 9.401c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
      </svg>
    )}
  </button>
);

const Stars: React.FC<StarsProps> = ({ value, size = 16, interactive = false, onChange }) => {
  const normalized = Math.max(0, Math.min(5, value));
  const fullStars = Math.floor(normalized);

  const handleClick = (i: number) => {
    if (!interactive || !onChange) return;
    onChange(i);
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const index = i + 1;
        const filled = index <= fullStars;
        // simple half-star behaviour not visually implemented (keep filled or empty)
        return (
          <Star key={i} filled={filled} size={size} onClick={() => handleClick(index)} />
        );
      })}
    </div>
  );
};

export default Stars;
