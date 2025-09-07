'use client';

import { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      
      items.push({
        id,
        title,
        level
      });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element);

      const currentHeading = headings.find(heading => {
        const rect = heading.element!.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📋</span>
        Table of Contents
      </h3>
      
      <nav className="space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`block w-full text-left text-sm transition-colors duration-200 py-1 px-2 rounded ${
              activeId === item.id 
                ? 'text-blue-600 bg-blue-50 font-medium' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
            style={{ 
              paddingLeft: `${(item.level - 1) * 16 + 8}px`,
              fontSize: item.level === 1 ? '14px' : '13px',
              fontWeight: item.level === 1 ? '600' : '400'
            }}
          >
            {item.title}
          </button>
        ))}
      </nav>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Click any section to jump directly to it</span>
        </div>
      </div>
    </div>
  );
}
