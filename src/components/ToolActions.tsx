'use client';

import { useState, useEffect, useRef } from 'react';

interface ToolActionsProps {
  tool: {
    name: string;
    website: string;
    description: string;
  };
}

export default function ToolActions({ tool }: ToolActionsProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'right' | 'left' | 'down'>('down');
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  // 检查是否已经收藏
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favorites.includes(tool.name));
  }, [tool.name]);

  // 计算菜单位置
  useEffect(() => {
    if (showShareMenu && shareButtonRef.current) {
      const buttonRect = shareButtonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // 检查右侧空间
      const spaceOnRight = windowWidth - buttonRect.right;
      const spaceOnLeft = buttonRect.left;
      const spaceBelow = windowHeight - buttonRect.bottom;
      
      if (spaceOnRight > 200) {
        setMenuPosition('right');
      } else if (spaceOnLeft > 200) {
        setMenuPosition('left');
      } else {
        setMenuPosition('down');
      }
    }
  }, [showShareMenu]);

  // 点击外部关闭分享菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    
    if (!isFavorited) {
      // 保存到localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      favorites.push(tool.name);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      // 显示友好提示
      alert('✅ Added to favorites! Your favorites are saved locally and will persist until you clear your browser data.');
    } else {
      // 从localStorage移除
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const updatedFavorites = favorites.filter((name: string) => name !== tool.name);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      alert('❌ Removed from favorites!');
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const shareToLinkedIn = () => {
    // LinkedIn分享
    const text = `Discovered an amazing AI tool: ${tool.name} - ${tool.description}`;
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToWeChat = () => {
    // 微信分享逻辑
    alert('WeChat sharing requires WeChat environment');
  };

  const shareToTwitter = () => {
    // Twitter分享
    const text = `Discovered an amazing AI tool: ${tool.name} - ${tool.description}`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
      setShowShareMenu(false);
    } catch (err) {
      // 备用方案
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
      setShowShareMenu(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={tool.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg        >
          Visit Website
        </a>
      
      <button 
        onClick={handleFavorite}
        className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors ${
          isFavorited 
            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <svg className="w-5 h-5 mr-2" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {isFavorited ? 'Favorited' : 'Favorite'}
      </button>
      
      <div className="relative" ref={shareMenuRef}>
        <button 
          ref={shareButtonRef}
          onClick={handleShare}
          className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          Share
        </button>
        
        {showShareMenu && (
          <div 
            className={`absolute w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 ${
              menuPosition === 'right' 
                ? 'top-0 left-full ml-2' 
                : menuPosition === 'left'
                ? 'top-0 right-full mr-2'
                : 'top-full left-0 mt-2'
            }`}
          >
            <button
              onClick={copyLink}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
            <button
              onClick={shareToTwitter}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Share to Twitter
            </button>
            <button
              onClick={shareToLinkedIn}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share to LinkedIn
            </button>
            <button
              onClick={shareToWeChat}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.918 8.174c.24 0 .478.024.71.064-.64-2.977-3.744-5.19-7.304-5.19-4.068 0-7.378 2.718-7.378 6.08 0 1.957 1.054 3.755 2.7 5.037l-.674 2.025 2.36-1.18c.844.158 1.572.237 2.362.237.23 0 .457-.008.683-.025-.142-.475-.22-.975-.22-1.493.001-3.193 2.69-5.78 6.08-5.78l.68.225zm-4.645-2.28c.512 0 .843.33.843.826s-.33.827-.843.827c-.513 0-1.01-.33-1.01-.827s.497-.826 1.01-.826zm-4.565 1.653c-.513 0-1.01-.33-1.01-.827s.497-.826 1.01-.826c.512 0 .843.33.843.826s-.33.827-.843.827z"/>
              </svg>
              Share to WeChat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
