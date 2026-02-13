'use client';

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
      {/* ===== Line 1: Search ===== */}
      <div className="mb-4">
        <label htmlFor="search-input" className="block text-sm font-medium mb-2 text-white">
          Search tasks
        </label>
        <Input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or description..."
          className="w-full text-black bg-white rounded-md px-3 py-2"
        />
      </div>

      {/* ===== Line 2: Filter by Status + Sort ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium mb-2 text-white">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            className="w-full rounded-md border border-gray-300 bg-white text-gray-700 px-3 py-2 text-sm"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-option" className="block text-sm font-medium mb-2 text-white">
            Sort by
          </label>
          <select
            id="sort-option"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as TaskSortOption)}
            className="w-full rounded-md border border-gray-300 text-gray-700 px-3 py-2 text-sm bg-white"
          >
            <option value="created_desc" className='bg-black'>Newest First</option>
            <option value="created_asc" className='bg-black'>Oldest First</option>
            <option value="title_asc" className='bg-black'>Title A-Z</option>
            <option value="title_desc" className='bg-black'>Title Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
