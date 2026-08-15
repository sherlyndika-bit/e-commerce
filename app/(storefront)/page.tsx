import React from 'react';
import { HeroBento } from '@/components/home/HeroBento';
import { CategoryExplorer } from '@/components/home/CategoryExplorer';
import { FlashSaleZone } from '@/components/home/FlashSaleZone';
import { CuratedCollections } from '@/components/home/CuratedCollections';
import { FeaturedSellers } from '@/components/home/FeaturedSellers';
import { DiscoveryFeed } from '@/components/home/DiscoveryFeed';

export default function HomePage() {
  return (
    <div className="bg-slate-100 sm:bg-slate-50 space-y-2 sm:space-y-1 pb-6">
      {/* 1. Main Banner Slider & Quick Action Shortcuts */}
      <HeroBento />

      {/* 2. 12-Category Marketplace Explorer */}
      <CategoryExplorer />

      {/* 3. Live Kejar Diskon / Flash Sale Zone with Countdown */}
      <FlashSaleZone />

      {/* 4. Curated Theme Collections */}
      <CuratedCollections />

      {/* 5. Official Store & Verified Indonesian Sellers */}
      <FeaturedSellers />

      {/* 6. Dynamic Recommendation Feed (6-Column Grid) */}
      <DiscoveryFeed />
    </div>
  );
}
