'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/lib/services/productService';
import { sellerService } from '@/lib/services/sellerService';
import { mockReviews } from '@/lib/mock-data/reviews';
import { Product, ProductVariantGroup } from '@/lib/types/product';
import { Seller } from '@/lib/types/seller';
import { ProductGallery } from '@/components/product/ProductGallery';
import { SellerInfoCard } from '@/components/product/SellerInfoCard';
import { ReviewSection } from '@/components/product/ReviewSection';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { formatRupiah, formatDiscount } from '@/lib/utils/formatters';
import { useCartStore } from '@/lib/store/useCartStore';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useToastStore } from '@/lib/store/useToastStore';
import {
  ChevronRight,
  Heart,
  Share2,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'shipping'>('desc');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [groupName: string]: string }>({});

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    productService.getBySlug(slug).then((prod) => {
      if (prod) {
        setProduct(prod);

        // Set initial variants
        const initialVars: { [key: string]: string } = {};
        if (prod.variantGroups) {
          prod.variantGroups.forEach((vg) => {
            if (vg.options.length > 0) {
              initialVars[vg.name] = vg.options[0].name;
            }
          });
        }
        setSelectedVariants(initialVars);

        sellerService.getById(prod.sellerId).then((s) => setSeller(s));
        productService.getRelated(prod.id, 4).then((rel) => setRelatedProducts(rel));
      }
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-500">Memuat detail produk...</p>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
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

  const discountPercent = product.originalPrice
    ? formatDiscount(product.originalPrice, currentPrice)
    : 0;

  const productReviews = mockReviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addItem(product, quantity, variantString || undefined, currentPrice);
    addToast({
      title: 'Masuk Keranjang! 🛒',
      description: `${product.title} (${variantString || 'Varian Standar'}) x ${quantity}`,
      type: 'success',
    });
  };

  const handleBuyNow = () => {
    addItem(product, quantity, variantString || undefined, currentPrice);
    router.push('/cart');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: 'Tautan Produk Disalin! 🔗',
        description: 'Bagikan tautan ini ke teman atau keluargamu.',
        type: 'info',
      });
    }
  };

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-500 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-brand-500 transition-colors">
            Katalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/categories/${product.categorySlug}`}
            className="hover:text-brand-500 transition-colors capitalize"
          >
            {product.categorySlug.replace(/-/g, ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-xs">
            {product.title}
          </span>
        </div>

        {/* Top Detail Card: Gallery + Product Info */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-subtle mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left: Gallery (Col 5) */}
            <div className="lg:col-span-5">
              <ProductGallery images={product.images} title={product.title} />
            </div>

            {/* Right: Details & Purchase Actions (Col 7) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Badges & Share Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {product.sellerBadge === 'official' && (
                      <Badge variant="official" size="sm">
                        Official Store
                      </Badge>
                    )}
                    {product.isFlashSale && (
                      <Badge variant="flash" size="sm">
                        ⚡ Flash Sale Kilat
                      </Badge>
                    )}
                    {product.badges.includes('gratis_ongkir') && (
                      <Badge variant="free_shipping" size="sm">
                        Bebas Ongkir Xtra
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Bagikan Produk"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isLiked
                          ? 'bg-rose-50 text-rose-500'
                          : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Simpan ke Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-3">
                  {product.title}
                </h1>

                {/* Rating & Sold Stats */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={product.rating} showNumber size="sm" />
                    <span className="text-slate-400">({product.reviewCount} ulasan)</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Terjual <strong>{product.soldCount}</strong> barang
                  </span>
                </div>

                {/* Price Box */}
                <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/60 border border-brand-100 dark:border-slate-700">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-brand-500">
                      {formatRupiah(currentPrice)}
                    </span>
                    {product.originalPrice && product.originalPrice > currentPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-lg shadow-xs">
                        HEMAT {discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Dapatkan cashback koin s/d 10.000 koin untuk pembelian ini!
                  </p>
                </div>

                {/* Variant Selector */}
                {product.variantGroups && product.variantGroups.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {product.variantGroups.map((group) => (
                      <div key={group.name}>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                          Pilihan {group.name}:{' '}
                          <strong className="text-brand-500">{selectedVariants[group.name]}</strong>
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
                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'border-brand-500 bg-brand-500 text-white shadow-md ring-2 ring-brand-500/20'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                                <span>{opt.name}</span>
                                {opt.priceModifier ? (
                                  <span className={isSelected ? 'text-white/80' : 'text-slate-400'}>
                                    (+{formatRupiah(opt.priceModifier)})
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Stepper & Stock */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Jumlah:
                  </span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1.5 text-xs font-extrabold text-slate-900 dark:text-white min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">
                    Total Stok: <strong className="text-slate-800 dark:text-slate-200">{product.stock}</strong> buah
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  className="w-full border-brand-500 text-brand-600 hover:bg-brand-50"
                  leftIcon={<ShoppingBag className="w-5 h-5 text-brand-500" />}
                >
                  + Masukin Keranjang
                </Button>

                <Button
                  onClick={handleBuyNow}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Beli Langsung • {formatRupiah(currentPrice * quantity)}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Info Card */}
        {seller && (
          <div className="mb-8">
            <SellerInfoCard seller={seller} />
          </div>
        )}

        {/* Product Details Tabs (Deskripsi, Spesifikasi, Ulasan, Pengiriman) */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-subtle mb-10">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`text-sm font-extrabold transition-colors pb-1 relative ${
                activeTab === 'desc'
                  ? 'text-brand-500'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Deskripsi & Spesifikasi
              {activeTab === 'desc' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-full -mb-4" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-extrabold transition-colors pb-1 relative ${
                activeTab === 'reviews'
                  ? 'text-brand-500'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Ulasan Pembeli ({product.reviewCount})
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-full -mb-4" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`text-sm font-extrabold transition-colors pb-1 relative ${
                activeTab === 'shipping'
                  ? 'text-brand-500'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pengiriman & Garansi
              {activeTab === 'shipping' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-full -mb-4" />
              )}
            </button>
          </div>

          {/* Tab 1: Description & Specs */}
          {activeTab === 'desc' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">
                  Deskripsi Produk
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
                    Spesifikasi Teknis
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                    {product.specifications.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                      >
                        <span className="text-slate-400 font-medium">{spec.label}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Reviews */}
          {activeTab === 'reviews' && (
            <ReviewSection
              reviews={productReviews}
              averageRating={product.rating}
              totalReviews={product.reviewCount}
            />
          )}

          {/* Tab 3: Shipping & Warranty */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <Truck className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    Dikirim dari {product.sellerCity}
                  </h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Pesanan diproses setiap hari Senin - Sabtu sebelum pukul 15.00 WIB untuk pengiriman hari yang sama.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <RotateCcw className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    Garansi Pengembalian 7 Hari Bebas Biaya
                  </h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Jika produk tidak sesuai deskripsi, cacat pabrik, atau rusak dalam perjalanan, ajukan retur via aplikasi untuk penggantian unit baru atau uang kembali 100%.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Rekomendasi Produk Serupa
            </h3>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
