'use client';

import { useState } from 'react';

interface SimpleSearchProps {
  onSearch: (query: string) => void;
}

export default function SimpleSearch({ onSearch }: SimpleSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Simple search submit:', query);
    onSearch(query);
  };

  return (
    <div className="bg-red-100 p-4 rounded-lg border-2 border-red-500">
      <p className="text-red-800 mb-2">Test Search (should work):</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            console.log('Simple input change:', e.target.value);
            setQuery(e.target.value);
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded"
          placeholder="Type here to test..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test
        </button>
      </form>
    </div>
  );
}
