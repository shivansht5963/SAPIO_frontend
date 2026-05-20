import { Search } from 'lucide-react';
import Select from '../ui/Select';
import './FilterBar.css';

export default function FilterBar({ filters = [], searchValue, onSearchChange, searchPlaceholder = 'Search...' }) {
  return (
    <div className="filter-bar">
      {filters.map(filter => (
        <Select
          key={filter.key}
          label={filter.label}
          options={filter.options}
          value={filter.value}
          onChange={filter.onChange}
          icon={filter.icon}
          placeholder={filter.placeholder}
          className="filter-bar__select"
        />
      ))}
      {onSearchChange && (
        <div className="filter-bar__search">
          <label className="filter-bar__search-label">ACTOR / USER</label>
          <div className="filter-bar__search-wrapper">
            <Search size={16} className="filter-bar__search-icon" />
            <input
              type="text"
              className="filter-bar__search-input"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
