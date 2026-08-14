'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/lib/services/productService';
import { sellerService } from '@/lib/services/sellerService';
import { mockReviews } from '@/lib/mock-data/reviews';
import { Product } from '@/lib/types/product';
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
  Truck,
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
        productService.getRelated(prod.id, 6).then((rel) => setRelatedProducts(rel));
      }
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-6 h-6 border-3 border-pink-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500">Memuat detail produk...</p>
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
      description: `${product.title} (${variantString || 'Standar'}) x ${quantity}`,
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
    <div className="py-4 sm:py-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 flex-wrap">
          <Link href="/" className="hover:text-pink-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-pink-600 transition-colors">
            Katalog
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/categories/${product.categorySlug}`}
            className="hover:text-pink-600 transition-colors capitalize"
          >
            {product.categorySlug.replace(/-/g, ' ')}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-bold truncate max-w-xs">
            {product.title}
          </span>
        </div>

        {/* Top Detail Card: Gallery + Product Info */}
        <div className="bg-white rounded-lg border border-slate-200/90 p-4 sm:p-6 shadow-2xs mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left: Gallery (Col 5) */}
            <div className="lg:col-span-5">
              <ProductGallery images={product.images} title={product.title} />
            </div>

            {/* Right: Details & Purchase Actions (Col 7) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Badges & Share Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {product.sellerBadge === 'official' && (
                      <Badge variant="official" size="xs">
                        Official Store
                      </Badge>
                    )}
                    {product.isFlashSale && (
                      <Badge variant="flash" size="xs">
                        ⚡ Flash Sale Kilat
                      </Badge>
                    )}
                    {product.badges.includes('gratis_ongkir') && (
                      <Badge variant="free_shipping" size="xs">
                        Bebas Ongkir
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleShare}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Bagikan Produk"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-1.5 rounded-md transition-colors ${
                        isLiked
                          ? 'bg-rose-50 text-rose-500'
                          : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                      }`}
                      title="Simpan ke Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-base sm:text-xl font-bold text-slate-900 leading-tight mb-2">
                  {product.title}
                </h1>

                {/* Rating & Sold Stats */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 text-xs">
                  <div className="flex items-center gap-1">
                    <RatingStars rating={product.rating} showNumber size="sm" />
                    <span className="text-slate-400">({product.reviewCount} ulasan)</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600">
                    Terjual <strong className="text-slate-900">{product.soldCount}</strong>
                  </span>
                </div>

                {/* Price Box */}
                <div className="my-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-xl sm:text-2xl font-black text-pink-600">
                      {formatRupiah(currentPrice)}
                    </span>
                    {product.originalPrice && product.originalPrice > currentPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded">
                        HEMAT {discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-pink-700 font-medium mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Dapatkan cashback koin hingga 10.000 koin untuk transaksi ini!
                  </p>
                </div>

                {/* Variant Selector */}
                {product.variantGroups && product.variantGroups.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {product.variantGroups.map((group) => (
                      <div key={group.name}>
                        <span className="text-xs font-bold text-slate-700 block mb-1.5">
                          Pilihan {group.name}:{' '}
                          <strong className="text-pink-700">{selectedVariants[group.name]}</strong>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {group.options.map((opt) => {
                            const isSelected = selectedVariants[group.name] === opt.name;
                            return (
                              <button
                                key={opt.id}
                                onClick={() =>
                                  setSelectedVariants({ ...selectedVariants, [group.name]: opt.name })
                                }
                                className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors flex items-center gap-1 ${
                                  isSelected
                                    ? 'border-pink-600 bg-pink-50 text-pink-700 ring-1 ring-pink-600'
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                                <span>{opt.name}</span>
                                {opt.priceModifier ? (
                                  <span className="text-[10px] text-slate-400">
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
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-slate-700">
                    Jumlah:
                  </span>
                  <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">
                    Stok: <strong className="text-slate-800">{product.stock}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="md"
                  className="w-full border-pink-600 text-pink-700 hover:bg-pink-50"
                  leftIcon={<ShoppingBag className="w-4 h-4 text-pink-600" />}
                >
                  + Keranjang
                </Button>

                <Button
                  onClick={handleBuyNow}
                  variant="primary"
                  size="md"
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
          <div className="mb-5">
            <SellerInfoCard seller={seller} />
          </div>
        )}

        {/* Product Details Tabs (Deskripsi, Spesifikasi, Ulasan, Pengiriman) */}
        <div className="bg-white rounded-lg border border-slate-200/90 p-4 sm:p-6 shadow-2xs mb-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 border-b border-slate-100 pb-3 mb-4">
            <button
              onClick={() => setActiveTab('desc')}
              className={`text-xs sm:text-sm font-bold transition-colors pb-1 relative ${
                activeTab === 'desc'
                  ? 'text-pink-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Deskripsi & Spesifikasi
              {activeTab === 'desc' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 -mb-3" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-xs sm:text-sm font-bold transition-colors pb-1 relative ${
                activeTab === 'reviews'
                  ? 'text-pink-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ulasan Pembeli ({product.reviewCount})
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 -mb-3" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`text-xs sm:text-sm font-bold transition-colors pb-1 relative ${
                activeTab === 'shipping'
                  ? 'text-pink-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pengiriman & Garansi
              {activeTab === 'shipping' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 -mb-3" />
              )}
            </button>
          </div>

          {/* Tab 1: Description & Specs */}
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-xs text-slate-900 mb-1">
                  Deskripsi Produk
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs text-slate-900 mb-2">
                    Spesifikasi Teknis
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl">
                    {product.specifications.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100 text-xs"
                      >
                        <span className="text-slate-400">{spec.label}</span>
                        <span className="font-semibold text-slate-800">{spec.value}</span>
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
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                <Truck className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900">
                    Dikirim dari {product.sellerCity}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pesanan diproses setiap hari Senin - Sabtu sebelum pukul 15.00 WIB untuk pengiriman hari yang sama.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg">
                <RotateCcw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900">
                    Garansi Pengembalian 7 Hari Bebas Biaya
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Jika produk tidak sesuai deskripsi, cacat pabrik, atau rusak dalam perjalanan, ajukan retur via aplikasi untuk penggantian unit baru atau uang kembali 100%.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Rekomendasi Produk Serupa
            </h3>
            <ProductGrid products={relatedProducts} columns={6} />
          </div>
        )}
      </div>
    </div>
  );
}
