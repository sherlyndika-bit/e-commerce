'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { categoryService } from '@/lib/services/categoryService';
import { productService } from '@/lib/services/productService';
import { Category, Product } from '@/lib/types/product';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { ActiveFilterChips } from '@/components/catalog/ActiveFilterChips';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { ChevronRight } from 'lucide-react';
import { useFilterStore } from '@/lib/store/useFilterStore';

function CategoryDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filterState = useFilterStore();

  useEffect(() => {
    categoryService.getBySlug(slug).then((cat) => {
      setCategory(cat);
      if (cat) {
        filterState.setCategorySlug(cat.slug);
      }
    });

    const sub = searchParams.get('sub');
    if (sub) {
      filterState.setSubcategoryId(sub);
    }
  }, [slug, searchParams]);

  useEffect(() => {
    setIsLoading(true);
    productService
      .filterProducts({
        categorySlug: slug,
        subcategoryId: filterState.subcategoryId || undefined,
        minPrice: filterState.minPrice > 0 ? filterState.minPrice : undefined,
        maxPrice: filterState.maxPrice > 0 ? filterState.maxPrice : undefined,
        rating: filterState.minRating > 0 ? filterState.minRating : undefined,
        sellerBadge: filterState.sellerBadge || undefined,
        freeShippingOnly: filterState.freeShippingOnly,
        sortBy: filterState.sortBy,
      })
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      });
  }, [
    slug,
    filterState.subcategoryId,
    filterState.minPrice,
    filterState.maxPrice,
    filterState.minRating,
    filterState.sellerBadge,
    filterState.freeShippingOnly,
    filterState.sortBy,
  ]);

  if (!category && !isLoading) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-lg font-bold mb-2">Kategori Tidak Ditemukan</h2>
        <Link href="/products" className="text-xs text-pink-600 font-bold hover:underline">
          ← Kembali ke Semua Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <Link href="/" className="hover:text-pink-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-pink-600 transition-colors">
            Kategori
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-pink-600 font-bold">
            {category?.name || slug}
          </span>
        </div>

        {/* Category Hero Banner */}
        {category && (
          <div className="relative rounded-lg overflow-hidden mb-5 h-36 sm:h-44 bg-slate-900 text-white p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
            <Image
              src={category.bannerImage}
              alt={category.name}
              fill
              className="object-cover opacity-40"
            />
            <div className="relative z-10">
              <span className="inline-block bg-pink-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase mb-1">
                Kategori Pilihan
              </span>
              <h1 className="text-xl sm:text-2xl font-black">{category.name}</h1>
              <p className="text-xs text-slate-200 max-w-lg mt-0.5">
                {category.description}
              </p>
            </div>

            {/* Subcategories Pills */}
            <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <button
                onClick={() => filterState.setSubcategoryId('')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors whitespace-nowrap ${
                  !filterState.subcategoryId
                    ? 'bg-pink-600 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                Semua Subkategori
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => filterState.setSubcategoryId(sub.slug)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors whitespace-nowrap ${
                    filterState.subcategoryId === sub.slug
                      ? 'bg-pink-600 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {sub.name} ({sub.itemCount})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-9">
            <CatalogHeader totalCount={products.length} />
            <ActiveFilterChips />
            <ProductGrid products={products} isLoading={isLoading} columns={5} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin w-6 h-6 border-3 border-pink-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Memuat Kategori...</p>
        </div>
      }
    >
      <CategoryDetailContent />
    </Suspense>
  );
}
