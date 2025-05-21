import React from 'react';
import Layout from '../components/layout/Layout';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPage: React.FC = () => {
  const featuredPost = {
    id: '1',
    title: '10 Strategies to Get Out of Debt Faster',
    excerpt: 'Discover proven methods to accelerate your debt payoff and achieve financial freedom sooner than you thought possible.',
    image: 'https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg',
    author: 'Sarah Johnson',
    date: '2024-03-15',
    category: 'Debt Relief'
  };

  const posts = [
    {
      id: '2',
      title: 'Understanding Debt Settlement vs. Debt Consolidation',
      excerpt: 'Learn the key differences between these two popular debt relief options and which might be right for you.',
      image: 'https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg',
      author: 'Michael Chen',
      date: '2024-03-10',
      category: 'Education'
    },
    {
      id: '3',
      title: 'How to Negotiate with Creditors: Expert Tips',
      excerpt: 'Get insider advice on how to effectively negotiate with creditors and potentially reduce what you owe.',
      image: 'https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg',
      author: 'David Smith',
      date: '2024-03-05',
      category: 'Tips'
    },
    {
      id: '4',
      title: 'The Impact of Debt on Mental Health',
      excerpt: 'Explore the connection between financial stress and mental wellbeing, and learn coping strategies.',
      image: 'https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg',
      author: 'Emily Wilson',
      date: '2024-03-01',
      category: 'Wellness'
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          {/* Featured Post */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
                    {featuredPost.category}
                  </div>
                  <h2 className="mt-2 text-3xl font-bold leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-4 text-gray-600">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-6 flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-gray-600">{featuredPost.author}</span>
                    <Calendar className="h-5 w-5 ml-6 text-gray-400" />
                    <span className="ml-2 text-gray-600">
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </span>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
                    {post.category}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-gray-600">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Debt Relief', 'Financial Tips', 'Credit Score', 'Budgeting'].map((category) => (
                <Link
                  key={category}
                  to={`/blog/category/${category.toLowerCase().replace(' ', '-')}`}
                  className="bg-white rounded-lg shadow px-6 py-4 text-center hover:bg-blue-50 transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;