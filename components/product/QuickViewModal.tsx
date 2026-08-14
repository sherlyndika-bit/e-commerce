'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types/product';
import { formatRupiah, formatDiscount } from '@/lib/utils/formatters';
import { useCartStore } from '@/lib/store/useCartStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { ShoppingBag, ArrowRight, ShieldCheck, MapPin, Plus, Minus, Check } from 'lucide-react';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [groupName: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    if (product.variantGroups) {
      product.variantGroups.forEach((vg) => {
        if (vg.options.length > 0) {
          initial[vg.name] = vg.options[0].name;
        }
      });
    }
    return initial;
  });

  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const variantString = Object.values(selectedVariants).join(', ');

  // Calculate dynamic price if variants have modifiers
  let currentPrice = product.price;
  if (product.variantGroups) {
    product.variantGroups.forEach((vg) => {
      const selectedOptionName = selectedVariants[vg.name];
      const opt = vg.options.find((o) => o.name === selectedOptionName);
      if (opt && opt.priceModifier) {
        currentPrice += opt.priceModifier;
      }
    });
  }

  const handleAddToCart = () => {
    addItem(product, quantity, variantString || undefined, currentPrice);
    addToast({
      title: 'Berhasil Masuk Keranjang! 🛒',
      description: `${product.title} (${variantString || 'Varian Standar'}) x ${quantity}`,
      type: 'success',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 mb-3">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-brand-500 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Variant Selection */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Seller info pill */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {product.sellerCity}
              </span>
              <span className="text-slate-300">•</span>
              <Badge variant={product.sellerBadge === 'official' ? 'official' : 'neutral'} size="xs">
                {product.sellerName}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <RatingStars rating={product.rating} showNumber size="xs" />
              <span className="text-xs text-slate-400">
                ({product.reviewCount} ulasan • {product.soldCount} terjual)
              </span>
            </div>

            {/* Price */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-brand-500">
                  {formatRupiah(currentPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge variant="discount" size="xs">
                    Hemat {formatDiscount(product.originalPrice, currentPrice)}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Variant groups */}
            {product.variantGroups && product.variantGroups.length > 0 && (
              <div className="space-y-3 mb-4">
                {product.variantGroups.map((group) => (
                  <div key={group.name}>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Pilih {group.name}: <span className="text-brand-500 font-semibold">{selectedVariants[group.name]}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const isSelected = selectedVariants[group.name] === opt.name;
                        return (
                          <button
                            key={opt.id}
                            onClick={() =>
                              setSelectedVariants({ ...selectedVariants, [group.name]: opt.name })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
                              isSelected
                                ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 shadow-xs'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-brand-500" />}
                            <span>{opt.name}</span>
                            {opt.priceModifier ? (
                              <span className="text-[10px] text-slate-400">(+{formatRupiah(opt.priceModifier)})</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Jumlah:
              </span>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-4 py-1 text-xs font-bold text-slate-900 dark:text-white min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-xs text-slate-400">
                Sisa stok: <strong>{product.stock}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="md"
              className="w-full"
              leftIcon={<ShoppingBag className="w-4 h-4" />}
            >
              Masukin Keranjang • {formatRupiah(currentPrice * quantity)}
            </Button>

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="w-full text-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 py-1.5 flex items-center justify-center gap-1"
            >
              Lihat Detail Lengkap & Review Pembeli
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
