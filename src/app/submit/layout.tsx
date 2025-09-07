import { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seoConfig';

export const metadata: Metadata = generatePageMetadata('submit');

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
