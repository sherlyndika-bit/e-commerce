'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatRupiah } from '@/lib/utils/formatters';
import { QrCode, CheckCircle2, Wallet, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  const { currentUser, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [selectedNominal, setSelectedNominal] = useState(50000);
  const [step, setStep] = useState<'nominal' | 'qris' | 'success'>('nominal');
  const [isProcessing, setIsProcessing] = useState(false);

  const nominals = [20000, 50000, 100000, 200000, 500000];

  const handleProceedToQRIS = () => {
    setStep('qris');
  };

  const handleSimulatePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newBalance = (currentUser.coinBalance || 0) + selectedNominal;
      updateUser({ coinBalance: newBalance });
      setStep('success');

      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch {}

      addToast({
        title: 'Top Up Koin Berhasil! 🪙',
        description: `+${formatRupiah(selectedNominal)} Koin TumbasCO telah masuk ke saldo akunmu.`,
        type: 'success',
      });
    }, 1000);
  };

  const handleResetAndClose = () => {
    setStep('nominal');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleResetAndClose} title="💳 Isi Saldo Koin TumbasCO" maxWidth="md">
      <div className="space-y-5">
        {step === 'nominal' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-coin-500 via-amber-500 to-brand-600 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-white/80 font-bold block">Saldo Koin Saat Ini</span>
                <span className="text-xl font-black">{formatRupiah(currentUser.coinBalance || 0)}</span>
              </div>
              <span className="text-2xl animate-coin-pulse">🪙</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Pilih Nominal Top Up:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {nominals.map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => setSelectedNominal(nom)}
                    className={`py-3 px-2 rounded-xl text-xs font-black transition-all border ${
                      selectedNominal === nom
                        ? 'bg-brand-500 text-white border-brand-500 shadow-xs scale-[1.02]'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-brand-300'
                    }`}
                  >
                    {formatRupiah(nom)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] text-slate-500 space-y-1">
              <p>• 1 Rupiah = 1 Koin TumbasCO (Bisa langsung dipotong saat belanja checkout).</p>
              <p>• Bebas biaya admin transfer untuk pembayaran melalui QRIS.</p>
            </div>

            <Button onClick={handleProceedToQRIS} variant="primary" size="md" className="w-full font-black">
              Lanjut ke Pembayaran ({formatRupiah(selectedNominal)})
            </Button>
          </div>
        )}

        {step === 'qris' && (
          <div className="space-y-4 text-center">
            <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-900">
              <span className="text-xs font-bold text-brand-700 dark:text-brand-300">
                Scan QRIS di bawah ini dengan BCA, Mandiri, GoPay, OVO, atau ShopeePay
              </span>
            </div>

            {/* Realistic QRIS Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-xs mx-auto shadow-elevated space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-700">
                <span className="font-black text-xs text-brand-600">QRIS STANDAR NASIONAL</span>
                <span className="font-bold text-[10px] text-slate-400">TumbasCO Pay</span>
              </div>

              <div className="w-44 h-44 mx-auto bg-slate-100 dark:bg-slate-700 p-2 rounded-xl flex items-center justify-center border">
                {/* Simulated QR Code Graphic */}
                <div className="w-full h-full bg-white p-2 flex flex-col justify-between items-center text-slate-950 font-mono text-[9px] select-none">
                  <div className="flex justify-between w-full">
                    <span className="w-8 h-8 border-4 border-slate-900 bg-slate-900" />
                    <span className="w-8 h-8 border-4 border-slate-900 bg-slate-900" />
                  </div>
                  <div className="text-center font-bold">
                    <QrCode className="w-10 h-10 mx-auto text-brand-600 animate-pulse" />
                    <span>{formatRupiah(selectedNominal)}</span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="w-8 h-8 border-4 border-slate-900 bg-slate-900" />
                    <span className="text-[8px] text-slate-400">NMID: ID10293847</span>
                  </div>
                </div>
              </div>

              <span className="font-mono text-sm font-black text-slate-900 dark:text-white block">
                Total: {formatRupiah(selectedNominal)}
              </span>
            </div>

            <Button
              onClick={handleSimulatePaymentSuccess}
              isLoading={isProcessing}
              variant="primary"
              size="md"
              className="w-full bg-pink-600 hover:bg-pink-700 font-black"
            >
              Simulasikan Scan & Bayar Berhasil ✨
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-950/60 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Top Up Berhasil!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Saldo Koin TumbasCO bertambah sebesar <strong className="text-brand-600">{formatRupiah(selectedNominal)}</strong>
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold">
              Saldo Baru: <span className="text-pink-600">{formatRupiah(currentUser.coinBalance || 0)}</span>
            </div>

            <Button onClick={handleResetAndClose} variant="primary" size="md" className="w-full">
              Selesai & Belanja Sekarang
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
