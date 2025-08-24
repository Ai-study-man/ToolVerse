import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Automated AI Tools | ToolVerse',
  description: 'Discover the best automated AI tools for streamlining your workflow and increasing productivity.',
  keywords: 'automated AI tools, automation, productivity, workflow optimization',
};

export default function AutomatedToolsPage() {
  // 重定向到带有分类参数的主工具页面
  redirect('/tools?category=automation');
}