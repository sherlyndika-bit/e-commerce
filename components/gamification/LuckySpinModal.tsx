'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils/formatters';
import { Sparkles, Gift, CheckCircle, Flame, Trophy, Coins } from 'lucide-react';

interface LuckySpinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LuckySpinModal({ isOpen, onClose }: LuckySpinModalProps) {
  const { currentUser, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(3);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  const prizes = [
    { label: '+2.500 Koin', value: 2500, type: 'coin', color: 'from-amber-400 to-coin-500' },
    { label: 'Voucher Ongkir 100%', value: 0, type: 'voucher', color: 'from-pink-400 to-teal-500' },
    { label: '+1.000 Koin', value: 1000, type: 'coin', color: 'from-indigo-400 to-brand-600' },
    { label: '+5.000 Koin', value: 5000, type: 'coin', color: 'from-amber-500 to-coin-600' },
    { label: 'Cashback 50%', value: 0, type: 'voucher', color: 'from-rose-400 to-pink-500' },
    { label: '+10.000 Koin', value: 10000, type: 'coin', color: 'from-purple-500 to-indigo-600' },
  ];

  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) return;

    const rewardCoins = 1000;
    const newBalance = (currentUser.coinBalance || 0) + rewardCoins;
    updateUser({ coinBalance: newBalance });
    setHasCheckedInToday(true);
    setDailyStreak((prev) => prev + 1);

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {}

    addToast({
      title: 'Check-in Harian Berhasil! 🪙',
      description: `+${rewardCoins.toLocaleString('id-ID')} Koin TumbasCO ditambahkan ke saldo akunmu. Streak: ${dailyStreak + 1} Hari!`,
      type: 'success',
    });
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWonPrize(null);

    // Pick random prize index (0 to 5)
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[prizeIndex];

    // Calculate rotation: 5 full spins (1800 deg) + segment angle
    const segmentAngle = 360 / prizes.length;
    const targetAngle = 1800 + (360 - prizeIndex * segmentAngle - segmentAngle / 2);

    setRotationDegree((prev) => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize.label);

      if (selectedPrize.type === 'coin') {
        const newBalance = (currentUser.coinBalance || 0) + selectedPrize.value;
        updateUser({ coinBalance: newBalance });
      }

      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {}

      addToast({
        title: `Selamat! Kamu Menang ${selectedPrize.label}! 🎉`,
        description: 'Hadiah otomatis aktif di akun TumbasCO kamu.',
        type: 'success',
      });
    }, 4000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🪙 Pusat Koin & Hadiah Harian" maxWidth="md">
      <div className="space-y-6 text-center">
        {/* User Balance Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-coin-500 via-amber-500 to-brand-600 text-white shadow-elevated flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider block">
              Saldo Koin Kamu Saat Ini
            </span>
            <span className="text-2xl font-black">{formatRupiah(currentUser.coinBalance || 0)}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner animate-coin-pulse">
            🪙
          </div>
        </div>

        {/* Daily Check-In Streak Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Check-in Harian ({dailyStreak} Hari Berturut-turut)
              </h4>
            </div>
            <span className="text-[10px] font-bold text-coin-600 dark:text-coin-400 bg-coin-100 dark:bg-coin-950/60 px-2 py-0.5 rounded-full">
              +1.000 Koin/Hari
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-3 text-center">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => {
              const isChecked = idx < dailyStreak;
              const isToday = idx === dailyStreak - 1;
              return (
                <div
                  key={day}
                  className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
                    isChecked
                      ? 'bg-coin-500 text-slate-950 border-coin-400 shadow-xs'
                      : 'bg-white dark:bg-slate-850 text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{day}</span>
                  <span className="text-xs">{isChecked ? '✓' : '🪙'}</span>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleDailyCheckIn}
            disabled={hasCheckedInToday}
            variant={hasCheckedInToday ? 'outline' : 'primary'}
            size="sm"
            className="w-full font-black text-xs"
          >
            {hasCheckedInToday ? '✅ Sudah Check-in Hari Ini (+1.000 Koin)' : '⚡ Klaim +1.000 Koin Hari Ini'}
          </Button>
        </div>

        {/* Lucky Spin Wheel Zone */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
            🎯 Roda Putar Keberuntungan (Lucky Spin)
          </h4>

          {/* Wheel Graphic */}
          <div className="relative w-48 h-48 mx-auto my-4">
            {/* Top Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-rose-500 drop-shadow-md" />

            {/* Spinning Circle */}
            <div
              className="w-full h-full rounded-full border-4 border-slate-900 dark:border-white shadow-2xl overflow-hidden relative transition-transform duration-[4000ms] ease-[cubic-bezier(0.15,0.9,0.2,1)]"
              style={{ transform: `rotate(${rotationDegree}deg)` }}
            >
              {prizes.map((p, idx) => {
                const angle = idx * 60;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 bg-gradient-to-br ${p.color} border border-white/20`}
                    style={{
                      clipPath: 'polygon(50% 50%, 0% 0%, 100% 0%)',
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '50% 50%',
                    }}
                  >
                    <span
                      className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-black text-white text-center leading-tight drop-shadow-xs"
                      style={{ transform: 'rotate(-30deg)' }}
                    >
                      {p.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center Pin Button */}
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-950 border-4 border-amber-400 text-amber-300 font-black text-xs shadow-glow-coin hover:scale-105 active:scale-95 disabled:opacity-80 transition-transform flex flex-col items-center justify-center z-10"
            >
              <span>PUTAR</span>
            </button>
          </div>

          {wonPrize && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold animate-in zoom-in-95 duration-200">
              🎉 Hadiah didapat: <span className="font-black text-brand-600 dark:text-brand-400">{wonPrize}</span>!
            </div>
          )}

          <Button
            onClick={handleSpinWheel}
            disabled={isSpinning}
            variant="primary"
            size="md"
            className="w-full mt-3 bg-gradient-to-r from-brand-600 to-indigo-600 font-black"
          >
            {isSpinning ? 'Sedang Memutar Roda...' : '🎲 Putar Roda Koin Sekarang (Gratis 1x)'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
