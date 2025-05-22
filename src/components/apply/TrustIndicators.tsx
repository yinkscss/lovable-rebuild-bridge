
import React from 'react';

const TrustIndicators: React.FC = () => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex justify-center space-x-8">
        <img alt="Forbes Advisor Badge" src="https://images.ctfassets.net/5xdc9rzhmhnq/2w76p4cNJtyPzBIB2ksKPF/aa2c8cde64b9ab878b081a8103a2f987/Wall_street_journal_logo.svg" className="h-20 object-contain" />
        <img alt="Bankrate Certification" src="https://images.ctfassets.net/5xdc9rzhmhnq/5Lu8G1TwoxMc3Qu8cXSeV/c0b2d4eeeb3c79e961ef13aeb776c353/NDR-Badge-2025__1_-99-__3_.svg" className="h-20 object-contain" />
        <img alt="BBB Accredited" src="https://start.nationaldebtrelief.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F5xdc9rzhmhnq%2F5tJzAk64KVtKPW0nJifBB0%2Feec2e8a4260d5e08b7dafa41e80b06eb%2Fimage__9_.png%3Fw%3D120%26fm%3Dwebp%26fit%3Dfill&w=256&q=75" className="h-20 object-contain" />
      </div>
    </div>
  );
};

export default TrustIndicators;
