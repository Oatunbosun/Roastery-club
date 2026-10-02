'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Flame, Compass, Coffee, Heart, Award } from 'lucide-react';

export default function OurStorySection() {
  const steps = [
    {
      num: '01',
      title: 'High-Altitude Sourcing',
      desc: 'We partner directly with smallholder family farms situated above 1,800m elevation where volcanic soil nurtures intense, complex bean flavors.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'Cast-Iron Drum Roasting',
      desc: 'Our vintage Probat drum roaster applies indirect radiant heat, coaxing out natural notes of stone fruits, floral jasmine, and honey caramel.',
      icon: Flame,
    },
    {
      num: '03',
      title: 'Daily Barista Calibration',
      desc: 'Every sunrise, our certified Q-graders pull 20 test extractions to dial in water TDS, grind particle distribution, and exact contact duration.',
      icon: Coffee,
    },
    {
      num: '04',
      title: 'Soulful Community Spaces',
      desc: 'Designed as a warm sensory sanctuary: the comforting aroma of freshly ground coffee, soft vinyl jazz, and cozy fireside reading corners.',
      icon: Heart,
    },
  ];

  return (
    <section id="story" className="py-20 md:py-28 bg-[#fbf7ee] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f3ebd9] text-[#8c5020] text-xs font-bold uppercase tracking-wider mb-4 border border-[#e5d5c0]">
              <Award className="w-3.5 h-3.5 text-[#c97a3e]" />
              <span>Our Philosophy & Craft</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-[#2c1810] tracking-tight leading-tight mb-6">
              Born from a pure devotion to the sacred morning ritual.
            </h2>
            <p className="text-sm sm:text-base text-[#6a4c37] leading-relaxed mb-4">
              At The Roastery Club, coffee is neither a hasty commodity nor an industrial rush. It is a slow, tactile art form connecting the misty volcanic slopes of Ethiopia and Colombia to the porcelain cup resting in your hands.
            </p>
            <p className="text-sm sm:text-base text-[#6a4c37] leading-relaxed">
              Founded by master baristas with over two decades of combined cupping experience, we treat every single crop with culinary reverence. No artificial syrups. No shortcuts. Just pure, unadulterated terroir.
            </p>
          </div>

          {/* Artistic Image Composition */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-[#2c1810]/20 border-4 border-white bg-[#ebdcc9]">
              <Image
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80"
                alt="Coffee Roasting Drum"
                fill
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>
            {/* Overlapping Floating Quote Card */}
            <div className="absolute -bottom-8 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-[#ebdcc9] shadow-xl max-w-xs hidden sm:block">
              <span className="font-editorial text-3xl text-[#c97a3e] leading-none">&ldquo;</span>
              <p className="font-editorial italic text-sm text-[#2c1810] leading-snug">
                The sweetest notes in coffee are the ones awakened by patience and gentle flame.
              </p>
              <span className="text-[11px] font-bold text-[#8c6e58] uppercase tracking-wider block mt-2">
                — Head Roaster & Co-Founder
              </span>
            </div>
          </div>
        </div>

        {/* 4 Steps of Craft */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-6 rounded-3xl bg-[#f6efe3] border border-[#ebdcc9] flex flex-col justify-between hover:bg-white transition-colors duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial text-2xl font-bold text-[#c97a3e]">
                      {st.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#ecdcc9]/60 flex items-center justify-center text-[#70492b]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#2c1810] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#6a4c37] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
