import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetBlogDetailsQuery } from '../redux/api/blogApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/ui/Breadcrumb';
import { Loader2 } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetBlogDetailsQuery(slug || '');
  const blog = data?.blog;

  // Debug için
  useEffect(() => {
    if (error) {
      console.error('Blog Detail Error:', error);
      console.log('Slug:', slug);
      console.log('Data:', data);
    }
  }, [error, slug, data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <Loader2 className="h-8 w-8 text-[#5C4977] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-20">
          <p className="text-red-600 mb-4">Blog yazısı tapılmadı.</p>
          <Link to="/" className="text-[#5C4977] hover:underline">
            Ana səhifəyə qayıt
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <section className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="py-6 pb-0">
            <Breadcrumb 
              items={[
                { label: "Ana səhifə", path: "/" },
                { label: "Bloq", path: "/" },
                { label: blog.title }
              ]}
            />
          </div>

          {/* Blog Image - CoverImage varsa onu, yoxdursa ilk şəkli göstər */}
          {(blog.coverImage?.url || (blog.images && blog.images.length > 0)) && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img
                  src={blog.coverImage?.url || blog.images[0].url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Blog Content - Arka plan olmadan */}
          <article className="mb-8">
            {/* Title ve Date - Yan yana */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {blog.title}
              </h1>
              {blog.date && (() => {
                const date = new Date(blog.date);
                const months = [
                  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
                  'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
                ];
                const day = date.getDate();
                const month = months[date.getMonth()];
                const year = date.getFullYear();
                return (
                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    {day} {month} {year}
                  </p>
                );
              })()}
            </div>

            {/* Main Content */}
            {blog.content && (
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}
          </article>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BlogDetail;




