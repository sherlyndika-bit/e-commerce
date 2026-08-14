'use client';

import React, { useState } from 'react';
import { Address } from '@/lib/types/user';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToastStore } from '@/lib/store/useToastStore';
import { MapPin, Check, Plus, Edit2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface AddressCardProps {
  selectedAddress: Address;
  onSelectAddress: (address: Address) => void;
}

export function AddressCard({ selectedAddress, onSelectAddress }: AddressCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Address Form State
  const [label, setLabel] = useState('Rumah');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const { currentUser, addAddress } = useAuthStore();
  const { addToast } = useToastStore();

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !phone || !fullAddress || !city) {
      addToast({
        title: 'Mohon lengkapi formulir alamat',
        type: 'warning',
      });
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label,
      recipientName,
      phone,
      fullAddress,
      district: district || 'Kecamatan',
      city,
      province: province || 'Provinsi',
      postalCode: postalCode || '12345',
      isDefault: false,
    };

    addAddress(newAddr);
    onSelectAddress(newAddr);
    setIsAddModalOpen(false);
    setIsModalOpen(false);
    addToast({
      title: 'Alamat Baru Berhasil Ditambahkan! 📍',
      description: `${recipientName} - ${city}`,
      type: 'success',
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-subtle">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-500" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Alamat Pengiriman
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors"
          >
            Pilih Alamat Lain
          </button>
        </div>

        {selectedAddress ? (
          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedAddress.recipientName}
              </span>
              <span className="text-slate-400">({selectedAddress.phone})</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">
                {selectedAddress.label}
              </span>
              {selectedAddress.isDefault && (
                <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Utama
                </span>
              )}
            </div>
            <p className="mt-0.5">{selectedAddress.fullAddress}</p>
            <p className="text-slate-400 mt-0.5">
              {selectedAddress.district}, {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-400">Belum ada alamat yang dipilih.</p>
        )}
      </div>

      {/* Select Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pilih Alamat Pengiriman"
        maxWidth="lg"
      >
        <div className="space-y-3">
          {currentUser.addresses.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => {
                  onSelectAddress(addr);
                  setIsModalOpen(false);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {addr.recipientName}
                    </span>
                    <span className="text-slate-400">({addr.phone})</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-[10px]">
                      {addr.label}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{addr.fullAddress}</p>
                  <p className="text-slate-400">
                    {addr.district}, {addr.city}, {addr.province} {addr.postalCode}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}

          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="outline"
            size="md"
            className="w-full mt-3"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Tambah Alamat Baru
          </Button>
        </div>
      </Modal>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Alamat Baru"
        maxWidth="md"
      >
        <form onSubmit={handleAddNewAddress} className="space-y-3 text-xs">
          <div>
            <label className="font-bold block mb-1">Label Alamat (e.g. Rumah, Kantor):</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">Nama Penerima:</label>
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Nomor Telepon:</label>
              <input
                type="tel"
                placeholder="08123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Alamat Lengkap:</label>
            <textarea
              rows={2}
              placeholder="Nama jalan, nomor rumah, RT/RW, patokan..."
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">Kota / Kabupaten:</label>
              <input
                type="text"
                placeholder="Jakarta Selatan"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Kode Pos:</label>
              <input
                type="text"
                placeholder="12730"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-3">
            <Button type="submit" variant="primary" size="md" className="w-full">
              Simpan & Gunakan Alamat Ini
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
