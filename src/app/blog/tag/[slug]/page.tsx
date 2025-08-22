import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import BlogCard from '@/components/blog/BlogCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { getBlogPostsByTag, getAllBlogTags } from '@/lib/blogService';

interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = params.slug.replace(/-/g, ' ');
  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  
  return {
    title: `${capitalizedTag} Articles - AI Tools Blog | ToolVerse`,
    description: `Explore all articles tagged with ${capitalizedTag}. Expert insights, tutorials, and reviews related to ${capitalizedTag} in AI tools and technology.`,
    keywords: `${capitalizedTag}, AI tools, artificial intelligence, blog, tutorials, reviews`,
    openGraph: {
      title: `${capitalizedTag} Articles | ToolVerse`,
      description: `Explore all articles tagged with ${capitalizedTag}`,
      url: `https://www.toolsverse.tools/blog/tag/${params.slug}`,
      type: 'website',
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = params.slug.replace(/-/g, ' ');
  const posts = await getBlogPostsByTag(tag);
  
  if (!posts || posts.length === 0) {
    notFound();
  }

  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  // Structured data for the tag page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${capitalizedTag} Articles`,
    description: `Articles tagged with ${capitalizedTag}`,
    url: `https://www.toolsverse.tools/blog/tag/${params.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          url: `https://www.toolsverse.tools/blog/${post.slug}`,
          datePublished: post.publishedAt.toISOString(),
          author: {
            '@type': 'Person',
            name: post.author.name,
          },
        },
      })),
    },
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.toolsverse.tools',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.toolsverse.tools/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${capitalizedTag} Tag`,
        item: `https://www.toolsverse.tools/blog/tag/${params.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <span>/</span>
            <a href="/blog" className="hover:text-blue-600 transition-colors">Blog</a>
            <span>/</span>
            <span className="text-gray-900">#{capitalizedTag}</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg font-bold">#</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Articles tagged with "#{capitalizedTag}"
                </h1>
                <p className="text-gray-600 mt-1">
                  {posts.length} {posts.length === 1 ? 'article' : 'articles'} found
                </p>
              </div>
            </div>
            
            {/* Tag description */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700">
                Explore our collection of articles about <strong>{capitalizedTag}</strong>. 
                Get insights, tutorials, and expert analysis on topics related to {tag} in the AI tools ecosystem.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Posts */}
            <div className="lg:col-span-3">
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    There are no articles tagged with "{capitalizedTag}" yet.
                  </p>
                  <a
                    href="/blog"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse All Articles
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const tags = await getAllBlogTags();
    return tags.map((tag: string) => ({
      slug: tag.toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch (error) {
    console.error('Error generating static params for tags:', error);
    return [];
  }
}
