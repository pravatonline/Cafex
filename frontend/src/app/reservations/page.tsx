import React from 'react';
import { ReservationWidget } from '@/components/ReservationWidget';
import { Users, Sparkles, MapPin, Wine, SunMedium } from 'lucide-react';

export default function ReservationsPage() {
  const sections = [
    {
      title: 'Window Bar & Sunlit Tables',
      capacity: '1 - 2 Guests',
      description: 'Overlooking the downtown tree-lined boulevard. Ideal for morning espresso rituals and creative deep work.',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Indoor Velvet Lounge',
      capacity: '2 - 6 Guests',
      description: 'Plush velvet armchairs, acoustic warmth, and intimate pendant lighting for casual meetings and conversations.',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Botanical Garden Patio',
      capacity: '2 - 6 Guests',
      description: 'Al fresco European dining surrounded by olive trees, hanging ferns, and gentle breeze.',
      imageUrl: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Private Roastery Lounge',
      capacity: '6 - 12 Guests',
      description: 'Dedicated acoustic suite with private pour-over tasting service for corporate lunches and celebrations.',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Unhurried Hospitality
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-950 dark:text-white mt-1">
          Table Reservations
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          Reserve your table online in seconds with immediate confirmation. No reservation fees or deposits.
        </p>
      </div>

      {/* Main Reservation Widget */}
      <div className="max-w-4xl mx-auto mb-20">
        <ReservationWidget />
      </div>

      {/* Seating Ambiance Preview */}
      <div className="border-t border-espresso-100 dark:border-neutral-800 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Choose Your Ambience
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950 dark:text-white mt-1">
            Distinctive Dining Spaces
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((sec) => (
            <div
              key={sec.title}
              className="rounded-3xl overflow-hidden bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 shadow-md flex flex-col justify-between"
            >
              <div className="h-44 w-full overflow-hidden bg-espresso-100 dark:bg-neutral-800">
                <img
                  src={sec.imageUrl}
                  alt={sec.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {sec.capacity}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-espresso-950 dark:text-white">
                  {sec.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {sec.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
