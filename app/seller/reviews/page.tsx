'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Search } from 'lucide-react';

const mockReviews = [
  { id: 1, buyer: 'Rian K.', product: 'Serum Vitamin C 30ml', rating: 5, comment: 'Bagus banget! Kulit jadi lebih cerah setelah 2 minggu pakai. Packaging rapi dan cepat sampai.', date: '2026-08-13', replied: false, helpful: 12 },
  { id: 2, buyer: 'Nadia S.', product: 'Moisturizer SPF50', rating: 5, comment: 'Produknya sesuai deskripsi, teksturnya ringan ga bikin muka berminyak. Seller fast response juga!', date: '2026-08-12', replied: true, helpful: 8 },
  { id: 3, buyer: 'Faisal A.', product: 'Sony WF-1000XM5', rating: 4, comment: 'Kualitas suara luar biasa! Tapi pengiriman agak lama 5 hari. Overall puas lah.', date: '2026-08-11', replied: true, helpful: 5 },
  { id: 4, buyer: 'Maya P.', product: 'Toner AHA BHA', rating: 5, comment: 'Sudah coba banyak toner, ini yang paling bagus! Pori-pori mengecil setelah 1 minggu.', date: '2026-08-10', replied: false, helpful: 19 },
  { id: 5, buyer: 'Raka D.', product: 'Keychron K3 Pro', rating: 3, comment: 'Keyboardnya oke tapi ada 1 tombol yang agak seret. Mungkin butuh break-in time. Seller cepat respon waktu komplain.', date: '2026-08-09', replied: true, helpful: 3 },
];

export default function SellerReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  const filtered = mockReviews.filter(r => {
    const matchSearch = r.buyer.toLowerCase().includes(searchTerm.toLowerCase()) || r.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRating = filterRating === 0 || r.rating === filterRating;
    return matchSearch && matchRating;
  });

  const avgRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: mockReviews.filter(rev => rev.rating === r).length }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Ulasan Produk</h1>
        <p className="text-sm text-slate-500 mt-0.5">Kelola dan balas ulasan dari pembeli.</p>
      </div>

      {/* Rating Summary */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col sm:flex-row gap-6">
        <div className="text-center flex-shrink-0">
          <p className="text-5xl font-black text-slate-900">{avgRating}</p>
          <div className="flex items-center justify-center gap-0.5 mt-2">
            {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
          </div>
          <p className="text-xs text-slate-400 mt-1">{mockReviews.length} ulasan</p>
        </div>
        <div className="flex-1 space-y-2">
          {ratingCounts.map(({ rating, count }) => (
            <div key={rating} className="flex items-center gap-3 cursor-pointer" onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}>
              <div className="flex items-center gap-0.5 w-20 flex-shrink-0">
                {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
              </div>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / mockReviews.length) * 100}%` }} />
              </div>
              <span className="text-xs font-semibold text-slate-600 w-4 flex-shrink-0">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Cari ulasan berdasarkan produk atau nama..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:border-pink-400 transition-all" />
        </div>
        <div className="flex gap-1">
          {[0,5,4,3,2,1].map(r => (
            <button key={r} onClick={() => setFilterRating(filterRating === r ? 0 : r)} className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${filterRating === r ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              {r === 0 ? 'Semua' : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {review.buyer.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{review.buyer}</p>
                  <p className="text-[11px] text-slate-400">{review.product} • {review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />)}
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <ThumbsUp className="w-3.5 h-3.5" />
                {review.helpful} orang merasa terbantu
              </span>
              {!review.replied ? (
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                  <MessageSquare className="w-3 h-3" />
                  Balas Ulasan
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  ✓ Sudah dibalas
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
