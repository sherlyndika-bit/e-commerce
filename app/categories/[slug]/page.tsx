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
import { ChevronRight, ArrowLeft } from 'lucide-react';
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
        <h2 className="text-xl font-bold mb-2">Kategori Tidak Ditemukan</h2>
        <Link href="/products" className="text-sm text-brand-500 font-bold hover:underline">
          ← Kembali ke Semua Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-brand-500 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-brand-500 transition-colors">
            Kategori
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-500 font-bold">
            {category?.name || slug}
          </span>
        </div>

        {/* Category Hero Banner */}
        {category && (
          <div className="relative rounded-3xl overflow-hidden mb-8 h-44 sm:h-52 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between shadow-elevated">
            <Image
              src={category.bannerImage}
              alt={category.name}
              fill
              className="object-cover opacity-35"
            />
            <div className="relative z-10">
              <span className="inline-block bg-white/20 backdrop-blur-xs text-white font-extrabold text-[11px] px-3 py-0.5 rounded-full uppercase mb-2">
                Kategori Pilihan
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">{category.name}</h1>
              <p className="text-xs sm:text-sm text-white/85 max-w-xl mt-1">
                {category.description}
              </p>
            </div>

            {/* Subcategories Pills */}
            <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => filterState.setSubcategoryId('')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  !filterState.subcategoryId
                    ? 'bg-white text-slate-900 shadow-md font-extrabold'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                Semua Subkategori
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => filterState.setSubcategoryId(sub.slug)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    filterState.subcategoryId === sub.slug
                      ? 'bg-brand-500 text-white shadow-md'
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-9">
            <CatalogHeader totalCount={products.length} />
            <ActiveFilterChips />
            <ProductGrid products={products} isLoading={isLoading} columns={3} />
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
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-500">Memuat Kategori...</p>
        </div>
      }
    >
      <CategoryDetailContent />
    </Suspense>
  );
}
