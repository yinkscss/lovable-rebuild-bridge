import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import DebtCalculator from '../components/home/DebtCalculator';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <DebtCalculator />
      <FeaturesSection />
      <HowItWorksSection />
    </Layout>
  );
};

export default HomePage;