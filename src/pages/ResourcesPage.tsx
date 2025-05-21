
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
}

const ResourcesPage: React.FC = () => {
  const params = useParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const category = params.category;

  useEffect(() => {
    const fetchResources = async () => {
      let query = supabase.from('resources').select('*');
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching resources:', error);
      } else {
        setResources(data as Resource[] || []);
      }
    };

    fetchResources();
  }, [category]);

  return (
    <Layout>
      <div className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {category ? `Resources for ${category}` : 'All Resources'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{resource.title}</h3>
                <p className="text-gray-600">{resource.description}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 block"
                >
                  Learn More
                </a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
