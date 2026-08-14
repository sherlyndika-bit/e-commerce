'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFilterStore } from '@/lib/store/useFilterStore';
import { productService } from '@/lib/services/productService';
import { Product } from '@/lib/types/product';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { ActiveFilterChips } from '@/components/catalog/ActiveFilterChips';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filterState = useFilterStore();

  // Sync URL search params to filter store on initial load
  useEffect(() => {
    const qParam = searchParams.get('q');
    const catParam = searchParams.get('cat');
    const freeShipParam = searchParams.get('free_shipping');
    const badgeParam = searchParams.get('seller_badge');
    const sortParam = searchParams.get('sort');

    if (qParam !== null) filterState.setSearchQuery(qParam);
    if (catParam !== null) filterState.setCategorySlug(catParam);
    if (freeShipParam === 'true') filterState.setFreeShippingOnly(true);
    if (badgeParam !== null) filterState.setSellerBadge(badgeParam);
    if (
      sortParam === 'popular' ||
      sortParam === 'latest' ||
      sortParam === 'price_asc' ||
      sortParam === 'price_desc' ||
      sortParam === 'rating'
    ) {
      filterState.setSortBy(sortParam);
    }
  }, [searchParams]);

  // Fetch filtered products whenever filter state changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    productService
      .filterProducts({
        query: filterState.searchQuery,
        categorySlug: filterState.categorySlug || undefined,
        subcategoryId: filterState.subcategoryId || undefined,
        minPrice: filterState.minPrice > 0 ? filterState.minPrice : undefined,
        maxPrice: filterState.maxPrice > 0 ? filterState.maxPrice : undefined,
        rating: filterState.minRating > 0 ? filterState.minRating : undefined,
        sellerBadge: filterState.sellerBadge || undefined,
        freeShippingOnly: filterState.freeShippingOnly,
        sortBy: filterState.sortBy,
      })
      .then((data) => {
        if (isMounted) {
          if (filterState.selectedCities.length > 0) {
            data = data.filter((p) =>
              filterState.selectedCities.some((c) =>
                p.sellerCity.toLowerCase().includes(c.toLowerCase())
              )
            );
          }
          setProducts(data);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    filterState.searchQuery,
    filterState.categorySlug,
    filterState.subcategoryId,
    filterState.minPrice,
    filterState.maxPrice,
    filterState.minRating,
    filterState.selectedCities,
    filterState.sellerBadge,
    filterState.freeShippingOnly,
    filterState.sortBy,
  ]);

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-brand-500 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">
            Katalog Produk
          </span>
          {filterState.categorySlug && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-brand-500 font-bold">
                {filterState.categorySlug.replace(/-/g, ' ')}
              </span>
            </>
          )}
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold text-xs shadow-xs"
          >
            <Filter className="w-4 h-4 text-brand-500" />
            <span>{isMobileFilterOpen ? 'Tutup Filter' : 'Buka Filter & Urutkan'}</span>
          </button>
        </div>

        {/* Grid Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Filter (Col 3) */}
          <div
            className={`lg:col-span-3 ${
              isMobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <FilterSidebar />
          </div>

          {/* Right Main Catalog (Col 9) */}
          <div className="lg:col-span-9 flex flex-col justify-between">
            <div>
              {/* Header Bar */}
              <CatalogHeader totalCount={products.length} />

              {/* Active Filter Chips */}
              <ActiveFilterChips />

              {/* Products Feed */}
              <ProductGrid
                products={products}
                isLoading={isLoading}
                columns={3}
                emptyMessage="Coba ubah kata kunci pencarian atau sesuaikan filter rentang harga dan lokasi."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-500">Memuat Katalog Produk...</p>
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
