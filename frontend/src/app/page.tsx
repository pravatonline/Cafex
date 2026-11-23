import React from 'react';
import NextLink from 'next/link';
import { 
  Coffee, 
  Sparkles, 
  Award, 
  Leaf, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Star, 
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import { ProductCard } from '@/components/ProductCard';
import { ReservationWidget } from '@/components/ReservationWidget';

export default function HomePage() {
  const chefSpecials = mockProducts.filter(p => p.is_chef_special || p.is_featured).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-espresso-950">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop&q=80"
            alt="Artisan Roastery Ambience"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Trade Micro-Roastery & Bakery
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-md">
            Awaken Your Senses with <span className="text-amber-500 italic">Artisan Craft</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 font-light leading-relaxed mb-10">
            Single-origin Ethiopian & Colombian beans slow-roasted in micro batches, paired with European cultured-butter pastries and wholesome gourmet plates.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NextLink
              href="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 group"
            >
              Order Online
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NextLink>

            <NextLink
              href="/reservations"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm uppercase tracking-wider transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              Reserve a Table
            </NextLink>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-white/10 text-neutral-300 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase">Single Origin</span>
                <span className="text-[11px] text-neutral-400">100% Arabica Specialty</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase">Baked Fresh</span>
                <span className="text-[11px] text-neutral-400">Daily French Patisserie</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase">Express Delivery</span>
                <span className="text-[11px] text-neutral-400">Hot & Fresh in 30 Mins</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase">Eco Conscious</span>
                <span className="text-[11px] text-neutral-400">100% Compostable Cups</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PROMO BANNER (WELCOME50) */}
      <section className="bg-amber-600 text-white py-3.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium">
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Special Launch Offer
          </span>
          <span>Use coupon code <strong className="font-mono bg-white text-amber-700 px-2 py-0.5 rounded">WELCOME50</strong> for 50% off your first online order!</span>
          <NextLink href="/menu" className="underline font-bold hover:text-neutral-100 flex items-center">
            Claim Now <ChevronRight className="w-3.5 h-3.5" />
          </NextLink>
        </div>
      </section>

      {/* 3. CHEF'S RECOMMENDATIONS & SIGNATURE PICKS */}
      <section className="py-20 bg-espresso-50/50 dark:bg-[#12100E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Curated Craft
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 dark:text-white mt-1">
                Chef&apos;s Signature Picks
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-lg">
                Handcrafted beverage compositions and bakery delicacies loved by our downtown community.
              </p>
            </div>

            <NextLink
              href="/menu"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:underline"
            >
              View Full Menu <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {chefSpecials.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE TABLE RESERVATION SECTION */}
      <section className="py-20 bg-white dark:bg-[#161412] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Artisan Hospitality
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 dark:text-white leading-tight">
                An Ambiance Crafted for Unhurried Moments.
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Whether you need a sunlit window table for creative work, a cozy garden patio for intimate conversations, or a private lounge for celebratory gatherings, Cafex welcomes you with warmth and unmatched barista mastery.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-espresso-900 dark:text-neutral-300">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold">✓</div>
                  <span>High-speed optical WiFi & quiet acoustic zones</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-espresso-900 dark:text-neutral-300">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Specialty pour-over coffee bar with personal tasting notes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-espresso-900 dark:text-neutral-300">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Instant reservation confirmation — zero booking deposit</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ReservationWidget />
            </div>

          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-espresso-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Community Love
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              Loved by Coffee Aficionados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-300 italic leading-relaxed">
                &ldquo;The Golden Cortado is a revelation! You can immediately taste the difference in their Ethiopian bean sourcing. And ordering online takes less than a minute.&rdquo;
              </p>
              <div>
                <h4 className="font-serif font-bold text-white text-sm">Marcus Vance</h4>
                <span className="text-xs text-amber-400">Verified Regular &bull; 140+ Orders</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-300 italic leading-relaxed">
                &ldquo;Their Nitro Cold Brew poured over block ice has zero bitterness and a thick Guinness-style cream head. The Burrata panini with truffle glaze is unbeatable.&rdquo;
              </p>
              <div>
                <h4 className="font-serif font-bold text-white text-sm">Elena Rostova</h4>
                <span className="text-xs text-amber-400">Food & Lifestyle Critic</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-neutral-300 italic leading-relaxed">
                &ldquo;Reserved a patio table for our quarterly team meeting. Flawless service, incredible pastries, and the Cafex rewards points rack up quickly!&rdquo;
              </p>
              <div>
                <h4 className="font-serif font-bold text-white text-sm">David Chen</h4>
                <span className="text-xs text-amber-400">Tech Founder</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
