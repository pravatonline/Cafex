import React from 'react';
import NextLink from 'next/link';
import { Coffee, Award, Leaf, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      
      {/* 1. HERO STORY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Our Heritage & Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-espresso-950 dark:text-white leading-[1.15]">
            Born from a Reverence for the Coffee Bean.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Founded in 2021 by certified Q-graders and artisan pastry chefs, Cafex began with a single vintage 12kg Probat cast-iron drum roaster and a simple mission: strip away corporate commodification and elevate coffee to the culinary art form it truly is.
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Every green coffee bean arriving at our roastery is ethically purchased through direct trade partnerships with smallholder family farms across Ethiopia, Guatemala, Colombia, and Sumatra at prices averaging 300% above Fair Trade minimums.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <NextLink
              href="/menu"
              className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-600/20"
            >
              Taste the Craft
            </NextLink>
            <NextLink
              href="/reservations"
              className="px-6 py-3 rounded-full border border-espresso-300 dark:border-neutral-700 hover:border-amber-500 text-espresso-900 dark:text-white font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Visit Our Roastery
            </NextLink>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-espresso-950">
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&auto=format&fit=crop&q=80"
              alt="Artisan Barista Crafting Espresso"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. PILLARS OF EXCELLENCE */}
      <section className="border-t border-espresso-100 dark:border-neutral-800 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            The Cafex Standards
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 dark:text-white mt-1">
            Our Four Commitments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white">Micro-Batch Roasting</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              We roast only what is consumed within 7 days, locking in volatile aromatic compounds and delicate terroir sweetness.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white">Direct Trade Equity</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              We travel directly to origin estates every harvest season, investing in farmer community education and soil health.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white">Certified Q-Graders</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Every coffee on our menu scores a minimum of 86+ points on the international Specialty Coffee Association (SCA) cupping protocol.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#161412] border border-espresso-100 dark:border-neutral-800 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-espresso-950 dark:text-white">Zero Waste Packaging</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              100% plant-based compostable takeaway cups, strawless lids, and spent espresso grounds repurposed for urban composting.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
