import { useState } from 'react';

function StarRatingInput({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating-input">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            className="btn p-0"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            <i
              className={`bi ${starValue <= (hover || value) ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
              style={{ fontSize: '24px' }}
            />
          </button>
        );
      })}
    </div>
  );
}

export default StarRatingInput;
