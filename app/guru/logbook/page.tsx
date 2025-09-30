'use client';

import { GuruLayout } from '@/components/GuruLayout';

export default function GuruLogbookPage() {
  return (
    <GuruLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jurnal Harian</h1>
          <p className="text-gray-600">Logbook siswa bimbingan</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Halaman dalam pengembangan</p>
          <p className="text-sm text-gray-400">Fitur ini akan segera tersedia</p>
        </div>
      </div>
    </GuruLayout>
  );
}