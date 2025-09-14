'use client';

interface LoadingSkeletonProps {
  count?: number;
  variant?: 'card' | 'category' | 'featured';
}

export function LoadingSkeleton({ count = 6, variant = 'card' }: LoadingSkeletonProps) {
  if (variant === 'category') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-10">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="group relative">
            {/* 主卡片容器 - 玻璃态效果 */}
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 animate-pulse">
              
              {/* 顶部装饰线 */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              
              {/* 图标容器 */}
              <div className="relative z-10 mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 shadow-lg"></div>
              </div>
              
              {/* 内容区域 */}
              <div className="relative z-10">
                <div className="h-6 bg-white/20 rounded-lg mb-3 w-4/5"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-white/15 rounded w-full"></div>
                  <div className="h-4 bg-white/15 rounded w-3/4"></div>
                </div>
                
                {/* 底部信息 */}
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-white/20 rounded w-16"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-white/15 rounded w-12"></div>
                    <div className="w-4 h-4 bg-white/15 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* 底部装饰光效 */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
