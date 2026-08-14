import React from 'react';
import { HeroBento } from '@/components/home/HeroBento';
import { FlashSaleZone } from '@/components/home/FlashSaleZone';
import { CategoryExplorer } from '@/components/home/CategoryExplorer';
import { CuratedCollections } from '@/components/home/CuratedCollections';
import { FeaturedSellers } from '@/components/home/FeaturedSellers';
import { DiscoveryFeed } from '@/components/home/DiscoveryFeed';

export default function HomePage() {
  return (
    <div className="space-y-4">
      {/* 1. Asymmetric Hero Bento */}
      <HeroBento />

      {/* 2. Live Flash Sale Zone with Countdown Timer */}
      <FlashSaleZone />

      {/* 3. 12-Category Marketplace Bento Explorer */}
      <CategoryExplorer />

      {/* 4. Thematic Curated Collections */}
      <CuratedCollections />

      {/* 5. Official Store & Verified Indonesian Sellers Spotlight */}
      <FeaturedSellers />

      {/* 6. Dynamic Recommendation Feed with Filter Pills */}
      <DiscoveryFeed />
    </div>
  );
}
