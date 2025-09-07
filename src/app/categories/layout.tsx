import { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seoConfig';

export const metadata: Metadata = generatePageMetadata('categories');

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
