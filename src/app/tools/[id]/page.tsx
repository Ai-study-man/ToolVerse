import ToolDetailClient from './ToolDetailClient';

// 为静态导出生成参数
export async function generateStaticParams() {
  // 返回空数组，允许动态生成
  return [];
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function ToolDetailPage({ params }: PageProps) {
  return <ToolDetailClient params={params} />;
}
