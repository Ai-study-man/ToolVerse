// 客户端导航工具函数
export const navigateToUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
};

export const isClient = () => typeof window !== 'undefined';
