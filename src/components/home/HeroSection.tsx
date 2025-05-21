import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TESTIMONIALS } from '../../lib/constants';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };
  
  const testimonial = TESTIMONIALS[currentSlide];
  
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[620px]">
        {/* Image Side */}
        <div className="relative md:w-1/2 h-[300px] md:h-auto">
          <img
            src={testimonial.imageUrl || 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg'}
            alt={`${testimonial.name}'s testimonial`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
        </div>
        
        {/* Content Side */}
        <div className="relative md:w-1/2 bg-blue-900 text-white p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            {testimonial.name}
          </h2>
          <blockquote className="text-xl md:text-2xl italic mb-6">
            "{testimonial.quote}"
          </blockquote>
          
          <div className="mb-8">
          <Link to="/apply">
  <Button 
    variant="primary" 
    size="lg" 
    className="bg-blue-500 hover:bg-blue-600"
  >
    Apply Now
  </Button>
</Link>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 border-t border-blue-800 pt-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-blue-300">Total Debt</p>
              <p className="text-xl font-bold">{formatCurrency(testimonial.totalDebt)}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-blue-300">Monthly Payment</p>
              <p className="text-xl font-bold">{formatCurrency(testimonial.monthlyPayment)}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-blue-300">Program Length</p>
              <p className="text-xl font-bold">{testimonial.programLength} Months</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm text-blue-300">Total Savings</p>
              <p className="text-xl font-bold">{formatCurrency(testimonial.totalSavings)}</p>
            </div>
          </div>
          
          <p className="mt-4 text-lg font-medium text-blue-300">
            {testimonial.name} saved {testimonial.savingsPercentage}% on her debt
          </p>
          
          {/* Carousel Controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-blue-700'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;