'use client';

import { useState, useEffect } from 'react';
import { SiswaLayout } from '@/components/SiswaLayout';

interface Logbook {
  id: number;
  tanggal: string;
  kegiatan: string;
  kendala: string;
  status_verifikasi: string;
  file?: string;
}

export default function SiswaLogbookPage() {
  const [logbooks, setLogbooks] = useState<Logbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // form state
  const [tanggal, setTanggal] = useState('');
  const [kegiatan, setKegiatan] = useState('');
  const [kendala, setKendala] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // fetch logbooks
  useEffect(() => {
    fetch('/api/logbook')
      .then(res => res.json())
      .then(data => {
        setLogbooks(data);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let fileUrl = null;

    // 1. Upload file jika ada
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/logbook/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.url;
      } else {
        alert("Gagal upload file");
        return;
      }
    }

    // 2. Simpan data logbook
    const res = await fetch('/api/logbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        magang_id: 1, // sementara hardcode, nanti dari user login
        tanggal,
        kegiatan,
        kendala,
        file: fileUrl,
      }),
    });

    if (res.ok) {
      const newLog = await res.json();
      setLogbooks([newLog, ...logbooks]);
      setShowForm(false);
      setTanggal('');
      setKegiatan('');
      setKendala('');
      setFile(null);
    } else {
      alert('Gagal menambahkan jurnal');
    }
  }

  return (
    <SiswaLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jurnal Harian</h1>
            <p className="text-gray-600">Catat kegiatan harian magang Anda</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Tambah Jurnal
          </button>
        </div>

        {/* Tabel Logbook */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <p className="p-4">Loading...</p>
          ) : logbooks.length === 0 ? (
            <p className="p-4 text-gray-500">Belum ada jurnal harian</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Tanggal</th>
                  <th className="px-4 py-2 text-left">Kegiatan</th>
                  <th className="px-4 py-2 text-left">Kendala</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Bukti</th>
                </tr>
              </thead>
              <tbody>
                {logbooks.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{log.tanggal}</td>
                    <td className="px-4 py-2">{log.kegiatan}</td>
                    <td className="px-4 py-2">{log.kendala}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          log.status_verifikasi === 'disetujui'
                            ? 'bg-green-100 text-green-700'
                            : log.status_verifikasi === 'ditolak'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {log.status_verifikasi}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {log.file ? (
                        <a
                          href={log.file}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          Lihat
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Form Tambah */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-900/50 bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Tambah Jurnal Harian</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Tanggal</label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Kegiatan</label>
                  <textarea
                    value={kegiatan}
                    onChange={(e) => setKegiatan(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Kendala</label>
                  <textarea
                    value={kendala}
                    onChange={(e) => setKendala(e.target.value)}
                    className="w-full border px-3 py-2 rounded mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Upload Bukti</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded border"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SiswaLayout>
  );
}
