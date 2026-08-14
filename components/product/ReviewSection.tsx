'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductReview } from '@/lib/types/product';
import { RatingStars } from '../ui/RatingStars';
import { ThumbsUp, CheckCircle, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { formatDateIndo } from '@/lib/utils/formatters';

interface ReviewSectionProps {
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewSection({ reviews, averageRating, totalReviews }: ReviewSectionProps) {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [filterWithPhotos, setFilterWithPhotos] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState<{ [id: string]: number }>({});

  const handleHelpful = (id: string, initialCount: number) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] !== undefined ? prev[id] : initialCount) + 1,
    }));
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedStar && r.rating !== selectedStar) return false;
    if (filterWithPhotos && (!r.images || r.images.length === 0)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Review Summary Breakdown */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Big Score */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white block">
              {averageRating.toFixed(1)}
            </span>
            <RatingStars rating={averageRating} size="md" className="justify-center mt-1" />
            <span className="text-xs text-slate-400 mt-1 block">
              dari {totalReviews} ulasan
            </span>
          </div>
        </div>

        {/* Filter Pills for Stars and Photos */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSelectedStar(null);
              setFilterWithPhotos(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedStar === null && !filterWithPhotos
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Semua ({reviews.length})
          </button>

          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => {
                setSelectedStar(star);
                setFilterWithPhotos(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                selectedStar === star
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              ★ {star}
            </button>
          ))}

          <button
            onClick={() => setFilterWithPhotos(!filterWithPhotos)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              filterWithPhotos
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Dengan Foto
          </button>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">
            Belum ada ulasan untuk filter bintang ini.
          </p>
        ) : (
          filteredReviews.map((review) => {
            const currentHelpful =
              helpfulCounts[review.id] !== undefined
                ? helpfulCounts[review.id]
                : review.helpfulCount;

            return (
              <div
                key={review.id}
                className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle"
              >
                {/* User Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <Image
                        src={review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120'}
                        alt={review.userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {review.userName}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-pink-600 bg-pink-50 dark:bg-pink-950/40 px-1.5 py-0.2 rounded font-semibold">
                          <CheckCircle className="w-2.5 h-2.5" /> Pembeli Terverifikasi
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RatingStars rating={review.rating} size="xs" />
                        <span className="text-[11px] text-slate-400">
                          {formatDateIndo(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {review.variantSelected && (
                    <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg font-medium">
                      Variasi: <strong>{review.variantSelected}</strong>
                    </span>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  {review.comment}
                </p>

                {/* Attached Buyer Photos */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2.5 mb-4">
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0"
                      >
                        <Image src={img} alt="Foto Ulasan" fill className="object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Seller Reply Box */}
                {review.sellerReply && (
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 mb-3 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-brand-600 dark:text-brand-400 mb-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Respon dari {review.sellerReply.sellerName}:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {review.sellerReply.comment}
                    </p>
                  </div>
                )}

                {/* Helpful action */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleHelpful(review.id, review.helpfulCount)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-500 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Membantu ({currentHelpful})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
