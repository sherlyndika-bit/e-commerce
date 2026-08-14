'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, MapPin, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types/product';
import { formatRupiah, formatDiscount, formatCompactNumber } from '@/lib/utils/formatters';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  const isLiked = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? formatDiscount(product.originalPrice, product.price)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has variants, open Quick View so user can choose variant
    if (product.variantGroups && product.variantGroups.length > 0) {
      setIsQuickViewOpen(true);
      return;
    }

    addItem(product, 1);
    addToast({
      title: 'Masuk Keranjang! 🛒',
      description: `${product.title} berhasil ditambahkan.`,
      type: 'success',
    });
  };

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
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-800/80 shadow-subtle hover:shadow-elevated transition-all duration-300 overflow-hidden hover:-translate-y-1"
      >
        {/* Top Image Container */}
        <Link href={`/products/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isFlashSale && (
              <Badge variant="flash" size="xs">
                ⚡ Kilat {discountPercent}%
              </Badge>
            )}
            {product.sellerBadge === 'official' && !product.isFlashSale && (
              <Badge variant="official" size="xs">
                Official
              </Badge>
            )}
            {product.badges.includes('gratis_ongkir') && (
              <Badge variant="free_shipping" size="xs">
                Bebas Ongkir
              </Badge>
            )}
          </div>

          {/* Wishlist Floating Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isLiked
                ? 'bg-rose-50 text-rose-500 shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 shadow-xs'
            }`}
            title="Simpan ke Wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white text-xs font-bold backdrop-blur-md shadow-md transition-all duration-200 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Cepat</span>
          </button>
        </Link>

        {/* Product Details */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Seller location */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{product.sellerCity}</span>
              <span className="text-slate-300">•</span>
              <span className="truncate text-slate-500 font-medium">{product.sellerName}</span>
            </div>

            {/* Title */}
            <Link
              href={`/products/${product.slug}`}
              className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 line-clamp-2 leading-snug transition-colors mb-2"
              title={product.title}
            >
              {product.title}
            </Link>
          </div>

          <div>
            {/* Price section */}
            <div className="flex items-baseline gap-1.5 flex-wrap mb-1.5">
              <span className="text-sm sm:text-base font-extrabold text-brand-600 dark:text-brand-400">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Rating & Sold count */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1">
                <RatingStars rating={product.rating} size="xs" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {product.rating}
                </span>
              </div>
              <span>Terjual {formatCompactNumber(product.soldCount)}</span>
            </div>

            {/* Quick Add To Cart Button */}
            <button
              onClick={handleQuickAdd}
              className="mt-2.5 w-full h-8 rounded-xl bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white dark:bg-brand-950/40 dark:text-brand-400 dark:hover:bg-brand-500 dark:hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-98 cursor-pointer border border-brand-200/60 dark:border-brand-900/60"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>+ Keranjang</span>
            </button>
          </div>
        </div>
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
