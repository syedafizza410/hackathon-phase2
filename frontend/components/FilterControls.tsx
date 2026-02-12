// components/FilterControls.tsx
import React from 'react';
import Input from './Input';
import { TaskStatus, TaskSortOption } from '@/types';

interface FilterControlsProps {
  statusFilter: TaskStatus;
  sortOption: TaskSortOption;
  searchTerm: string;
  onStatusChange: (status: TaskStatus) => void;
  onSortChange: (sort: TaskSortOption) => void;
  onSearchChange: (term: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  statusFilter,
  sortOption,
  searchTerm,
  onStatusChange,
  onSortChange,
  onSearchChange,
}) => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search-input" className="block text-sm font-medium mb-2">
            Search tasks
          </label>
          <Input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or description..."
          />
        </div>
        
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium mb-2">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="sort-option" className="block text-sm font-medium mb-2">
            Sort by
          </label>
          <select
            id="sort-option"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as TaskSortOption)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="title_asc">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;