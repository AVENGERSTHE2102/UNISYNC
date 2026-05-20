function SearchBar({
  id = 'search',
  label = 'Search',
  placeholder = 'Search',
  className = '',
  ...props
}) {
  return (
    <label className={['us-search', className].filter(Boolean).join(' ')} htmlFor={id}>
      <span className="us-search__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4" />
        </svg>
      </span>
      <span className="us-sr-only">{label}</span>
      <input id={id} type="search" placeholder={placeholder} {...props} />
    </label>
  );
}

export default SearchBar;
