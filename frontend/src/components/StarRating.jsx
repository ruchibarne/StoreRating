const StarRating = ({ value, onChange }) => {
  return (
    <div style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            cursor: 'pointer',
            fontSize: '20px',
            color: star <= value ? '#faa513' : '#c9cdd3',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
