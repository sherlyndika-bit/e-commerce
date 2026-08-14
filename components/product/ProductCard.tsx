'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { Product } from '@/lib/types/product';
import { formatRupiah, formatDiscount, formatCompactNumber } from '@/lib/utils/formatters';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  const isLiked = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? formatDiscount(product.originalPrice, product.price)
    : 0;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const liked = toggleWishlist(product.id);
    addToast({
      title: liked ? 'Ditambahkan ke Wishlist ♥' : 'Dihapus dari Wishlist',
      description: product.title,
      type: liked ? 'success' : 'info',
    });
  };

  return (
    <>
      <div className="group relative flex flex-col bg-white rounded-lg border border-slate-200/80 hover:border-pink-500 hover:shadow-sm transition-all duration-150 overflow-hidden">
        {/* Top Image Container */}
        <Link href={`/products/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-slate-50">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            priority={priority}
            className="object-cover group-hover:scale-102 transition-transform duration-200"
          />

          {/* Badges Overlay */}
          <div className="absolute top-0 left-0 flex flex-col gap-0.5 z-10">
            {product.isFlashSale && (
              <div className="bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-br shadow-2xs">
                Kilat {discountPercent}%
              </div>
            )}
            {product.sellerBadge === 'official' && !product.isFlashSale && (
              <div className="bg-indigo-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-br shadow-2xs uppercase tracking-wider">
                Official
              </div>
            )}
            {product.badges.includes('gratis_ongkir') && (
              <div className="bg-pink-600 text-white font-bold text-[8px] px-1 py-0.5 rounded-br shadow-2xs w-fit">
                Bebas Ongkir
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute bottom-1.5 right-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
              isLiked
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </Link>

        {/* Product Details */}
        <Link href={`/products/${product.slug}`} className="p-2 flex-1 flex flex-col justify-between">
          <div>
            {/* Title */}
            <h3
              className="text-[11px] sm:text-xs text-slate-800 line-clamp-2 leading-snug mb-1 group-hover:text-pink-600 transition-colors"
              title={product.title}
            >
              {product.title}
            </h3>

            {/* Price */}
            <div className="flex flex-col mb-1">
              <span className="text-xs sm:text-sm font-black text-slate-900 leading-none">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="bg-rose-50 text-rose-600 text-[8px] font-black px-1 rounded">
                    {discountPercent}%
                  </span>
                  <span className="text-[9px] text-slate-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Location, Rating & Sold count */}
          <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-100/80 text-[10px] text-slate-500">
            <div className="flex items-center gap-1 text-[9px] text-slate-400">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{product.sellerCity}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-amber-400 text-[10px]">★</span>
              <span className="font-bold text-slate-700 text-[10px]">{product.rating}</span>
              <span className="text-slate-300">|</span>
              <span className="text-[9px] text-slate-500">Terjual {formatCompactNumber(product.soldCount)}+</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
