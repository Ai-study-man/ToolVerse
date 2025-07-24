import { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seoConfig';

export const metadata: Metadata = generatePageMetadata('tools');

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
