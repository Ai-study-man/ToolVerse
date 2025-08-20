import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import BlogGrid from '@/components/blog/BlogGrid';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { getBlogCategory, getBlogPostsByCategory, getBlogCategories } from '@/lib/blogService';

interface BlogCategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = await getBlogCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const category = await getBlogCategory(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found | ToolVerse',
    };
  }

  return {
    title: `${category.name} - AI Tools Blog | ToolVerse`,
    description: `Explore ${category.name.toLowerCase()} articles and insights on ToolVerse. Latest updates, reviews, and tutorials about AI tools in the ${category.name.toLowerCase()} category.`,
    keywords: `${category.name}, AI tools, artificial intelligence, ${category.slug}, blog, tutorials, reviews`,
    openGraph: {
      title: `${category.name} Articles | ToolVerse`,
      description: `Explore the latest ${category.name.toLowerCase()} articles and insights`,
      url: `https://toolverse.com/blog/category/${params.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | ToolVerse Blog`,
      description: `Latest ${category.name.toLowerCase()} articles and insights`,
    },
    alternates: {
      canonical: `https://toolverse.com/blog/category/${params.slug}`,
    }
  };
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const category = await getBlogCategory(params.slug);
  
  if (!category) {
    notFound();
  }

  const posts = await getBlogPostsByCategory(params.slug);
  const allCategories = await getBlogCategories();

  // Generate structured data for the category page
  const categoryStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Articles`,
    description: `Collection of articles about ${category.name.toLowerCase()}`,
    url: `https://toolverse.com/blog/category/${params.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          url: `https://toolverse.com/blog/${post.slug}`,
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
        item: 'https://toolverse.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://toolverse.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://toolverse.com/blog/category/${params.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      {/* Header */}
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Breadcrumb */}
              <nav className="flex justify-center items-center space-x-2 text-blue-200 mb-6 text-sm">
                <a href="/" className="hover:text-white transition-colors">Home</a>
                <span>•</span>
                <a href="/blog" className="hover:text-white transition-colors">Blog</a>
                <span>•</span>
                <span className="text-white">{category.name}</span>
              </nav>
              
              <div className="flex justify-center items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold">
                    {category.name}
                  </h1>
                  <p className="text-xl text-blue-100 mt-2">
                    {category.description}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-6 text-blue-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{posts.length} articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                  <span>Updated weekly</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {posts.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">
                        All {category.name} Articles
                      </h2>
                      <div className="text-sm text-gray-500">
                        Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                      </div>
                    </div>
                    
                    <BlogGrid posts={posts} />
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 text-4xl">📝</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      No articles yet
                    </h2>
                    <p className="text-gray-600 mb-8">
                      We&apos;re working on creating amazing content for the {category.name} category. 
                      Check back soon for new articles!
                    </p>
                    <a 
                      href="/blog" 
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
        </section>
      </main>
    </>
  );
}
