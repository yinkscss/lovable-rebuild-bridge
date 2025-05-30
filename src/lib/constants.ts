import { DebtRange, Testimonial } from '../types';

export const COMPANY_PHONE = '+4102584893';
export const COMPANY_EMAIL = 'info@nationadebtsrelief.com';

export const DEBT_RANGES: DebtRange[] = [
  { id: '1', label: '$7,500 - $10,000', min: 7500, max: 10000 },
  { id: '2', label: '$10,001 - $15,000', min: 10001, max: 15000 },
  { id: '3', label: '$15,001 - $25,000', min: 15001, max: 25000 },
  { id: '4', label: '$25,001 - $50,000', min: 25001, max: 50000 },
  { id: '5', label: '$50,001 - $75,000', min: 50001, max: 75000 },
  { id: '6', label: '$75,001 - $100,000', min: 75001, max: 100000 },
  { id: '7', label: '$100,001+', min: 100001, max: null },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Andrea A.',
    quote: 'Being able to trust them to do their job allows you to take care of what\'s important in your life.',
    totalDebt: 51361,
    monthlyPayment: 684,
    programLength: 53,
    totalSavings: 15068,
    savingsPercentage: 29,
    imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
  },
  {
    id: '2',
    name: 'Thomas R.',
    quote: 'I was drowning in debt with no end in sight. National Debt Relief gave me a path forward.',
    totalDebt: 42500,
    monthlyPayment: 560,
    programLength: 48,
    totalSavings: 16575,
    savingsPercentage: 39,
    imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  {
    id: '3',
    name: 'Samantha P.',
    quote: 'Their team walked me through every step. I feel like I have my life back again.',
    totalDebt: 36750,
    monthlyPayment: 495,
    programLength: 42,
    totalSavings: 12862,
    savingsPercentage: 35,
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
  },
];

export const VALUE_PROPS = [
  'Pay Up To 30% Less Than You Owe',
  'Debt Free In As Little As 12-48 Months',
  'Free Consultation and Zero Up-Front Fees'
];

export const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Apply', path: '/apply' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'About Us', path: '/about-us' },
  { 
    label: 'Resources', 
    path: '/resources',
    dropdownItems: [
      { label: 'Debt Relief Guides', path: '/resources/guides' },
      { label: 'Debt By State', path: '/resources/by-state' },
      { label: 'Debt Calculator', path: '/resources/calculator' },
      { label: 'FAQs', path: '/resources/faqs' },
    ]
  },
  { label: 'Client Stories', path: '/client-stories' },
  { label: 'Blog', path: '/blog' },
];

export const CERTIFICATIONS = [
  { name: 'Wall Street Journal', imageUrl: '/assets/wsj-logo.png' },
  { name: 'Forbes Advisor', imageUrl: '/assets/forbes-logo.png' },
  { name: 'Bankrate', imageUrl: '/assets/bankrate-logo.png' },
];
