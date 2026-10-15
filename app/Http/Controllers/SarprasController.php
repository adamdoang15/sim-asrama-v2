<?php

namespace App\Http\Controllers;

use App\Models\Aset;
use App\Models\PengadaanAset;
use App\Models\PerbaikanAset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SarprasController extends Controller
{
    public function getLembagaOptions(): array
    {
        return [
            'Lembaga 1' => ['Ruang Kelas 7', 'Ruang Kelas 8', 'Ruang Kelas 9', 'Lab IPA', 'Ruang Guru SMP'],
            'Lembaga 2' => ['Ruang Kelas 10', 'Ruang Kelas 11', 'Ruang Kelas 12', 'Lab Komputer', 'Ruang Guru SMA'],
            'Lembaga 3' => ['Gedung Asrama Putra', 'Gedung Asrama Putri', 'Masjid Asrama', 'Dapur & Ruang Makan', 'Gudang Utama'],
        ];
    }

    public function getAllLokasiOptions(): array
    {
        $all = [];
        foreach ($this->getLembagaOptions() as $ruangans) {
            $all = array_merge($all, $ruangans);
        }

        return array_values(array_unique($all));
    }

    /**
     * Halaman 1: Inventaris Aset, Pemeriksaan Berkala & Penghapusan
     */
    public function inventaris(Request $request): Response
    {
        $kategoriOptions = [
            'Mebel & Furnitur',
            'Elektronik & IT',
            'Fasilitas Asrama',
            'Alat Kebersihan',
            'Peralatan Dapur',
            'Kendaraan',
            'Lainnya',
        ];

        $lokasiOptions = $this->getAllLokasiOptions();
        $lembagaOptions = $this->getLembagaOptions();

        $kondisiOptions = ['Baik', 'Rusak Ringan', 'Rusak Berat'];
        $statusOptions = ['Tersedia', 'Dalam Perbaikan', 'Dihapuskan'];

        $tab = $request->input('tab', 'aktif'); // 'aktif' | 'dihapuskan'
        $search = $request->input('search', '');
        $lembaga = $request->input('lembaga', '');
        $kategori = $request->input('kategori', '');
        $lokasi = $request->input('lokasi', '');
        $kondisi = $request->input('kondisi', '');

        $query = Aset::query();

        if ($tab === 'dihapuskan') {
            $query->where('status', 'Dihapuskan');
        } else {
            $query->where('status', '!=', 'Dihapuskan');
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('kode_aset', 'like', "%{$search}%")
                    ->orWhere('nama_aset', 'like', "%{$search}%")
                    ->orWhere('lokasi', 'like', "%{$search}%");
            });
        }

        $user = $request->user();
        if (! empty($lembaga)) {
            $query->where('lembaga', $lembaga);
        } elseif ($user && $user->lembaga !== 'Yayasan') {
            $query->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }

        if (! empty($kategori)) {
            $query->where('kategori', $kategori);
        }

        if (! empty($lokasi)) {
            $query->where('lokasi', $lokasi);
        }

        if (! empty($kondisi)) {
            $query->where('kondisi', $kondisi);
        }

        $asets = $query->orderBy('updated_at', 'desc')->get();

        $statsBase = Aset::query();
        if ($user && $user->lembaga !== 'Yayasan') {
            $statsBase->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }

        $stats = [
            'total_aset' => (clone $statsBase)->where('status', '!=', 'Dihapuskan')->count(),
            'kondisi_baik' => (clone $statsBase)->where('kondisi', 'Baik')->where('status', '!=', 'Dihapuskan')->count(),
            'kondisi_rusak' => (clone $statsBase)->whereIn('kondisi', ['Rusak Ringan', 'Rusak Berat'])->where('status', '!=', 'Dihapuskan')->count(),
            'dihapuskan' => (clone $statsBase)->where('status', 'Dihapuskan')->count(),
            'total_nilai' => (float) (clone $statsBase)->where('status', '!=', 'Dihapuskan')->sum('nilai_perolehan'),
        ];

        return Inertia::render('Sarpras/Inventaris', [
            'asets' => $asets,
            'filters' => [
                'tab' => $tab,
                'search' => $search,
                'lembaga' => $lembaga,
                'kategori' => $kategori,
                'lokasi' => $lokasi,
                'kondisi' => $kondisi,
            ],
            'options' => [
                'kategori' => $kategoriOptions,
                'lokasi' => $lokasiOptions,
                'kondisi' => $kondisiOptions,
                'status' => $statusOptions,
                'lembaga' => array_keys($lembagaOptions),
                'lembaga_ruangan' => $lembagaOptions,
            ],
            'stats' => $stats,
        ]);
    }

    public function storeAset(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_aset' => 'required|string|max:255',
            'lembaga' => 'nullable|string|max:255',
            'kategori' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'satuan' => 'required|string|max:50',
            'kondisi' => 'required|in:Baik,Rusak Ringan,Rusak Berat',
            'tanggal_perolehan' => 'nullable|date',
            'nilai_perolehan' => 'nullable|numeric|min:0',
        ]);

        $nextId = (Aset::max('id') ?? 0) + 1;
        $validated['kode_aset'] = 'AST-'.date('Y').'-'.str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);
        $validated['status'] = 'Tersedia';

        $user = $request->user();
        $validated['lembaga'] = $request->input('lembaga') ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

        Aset::create($validated);

        return back()->with('success', 'Aset baru berhasil ditambahkan ke inventaris.');
    }

    public function updateAset(Request $request, Aset $aset): RedirectResponse
    {
        $validated = $request->validate([
            'nama_aset' => 'required|string|max:255',
            'lembaga' => 'nullable|string|max:255',
            'kategori' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'satuan' => 'required|string|max:50',
            'kondisi' => 'required|in:Baik,Rusak Ringan,Rusak Berat',
            'tanggal_perolehan' => 'nullable|date',
            'nilai_perolehan' => 'nullable|numeric|min:0',
        ]);

        $aset->update($validated);

        return back()->with('success', 'Data aset berhasil diperbarui.');
    }

    public function periksaBerkala(Request $request, Aset $aset): RedirectResponse
    {
        $validated = $request->validate([
            'kondisi' => 'required|in:Baik,Rusak Ringan,Rusak Berat',
            'status' => 'nullable|string|in:Tersedia,Tidak Tersedia,Dalam Perbaikan,Dihapuskan',
            'catatan_pemeriksaan' => 'nullable|string',
            'tanggal_pemeriksaan' => 'nullable|date',
            'tanggal_pemeriksaan_terakhir' => 'nullable|date',
        ]);

        $updateData = [
            'kondisi' => $validated['kondisi'],
            'catatan_pemeriksaan' => $validated['catatan_pemeriksaan'] ?? null,
            'tanggal_pemeriksaan_terakhir' => $validated['tanggal_pemeriksaan'] ?? $validated['tanggal_pemeriksaan_terakhir'] ?? now()->toDateString(),
        ];

        if (! empty($validated['status'])) {
            $updateData['status'] = $validated['status'];
            if ($validated['status'] === 'Dihapuskan') {
                $updateData['tanggal_penghapusan'] = now()->toDateString();
                $updateData['alasan_penghapusan'] = $validated['catatan_pemeriksaan'] ?? 'Dihapuskan hasil pemeriksaan berkala.';
            }
        }

        $aset->update($updateData);

        return back()->with('success', 'Hasil pemeriksaan berkala aset berhasil dicatat.');
    }

    public function destroyAset(Aset $aset): RedirectResponse
    {
        $aset->delete();

        return back()->with('success', 'Data aset berhasil dihapus permanen.');
    }

    public function hapusAset(Request $request, Aset $aset): RedirectResponse
    {
        $validated = $request->validate([
            'alasan_penghapusan' => 'required|string',
            'tanggal_penghapusan' => 'nullable|date',
        ]);

        $aset->update([
            'status' => 'Dihapuskan',
            'alasan_penghapusan' => $validated['alasan_penghapusan'],
            'tanggal_penghapusan' => $validated['tanggal_penghapusan'] ?? now()->toDateString(),
        ]);

        return back()->with('success', 'Aset telah dipindahkan ke daftar aset dihapuskan.');
    }

    /**
     * Halaman 2: Laporan Kerusakan & Riwayat Perbaikan
     */
    public function perbaikan(Request $request): Response
    {
        $tab = $request->input('tab', 'aktif'); // 'aktif' | 'selesai'
        $search = $request->input('search', '');
        $lembaga = $request->input('lembaga', '');
        $prioritas = $request->input('prioritas', '');

        $query = PerbaikanAset::with('aset');

        if ($tab === 'selesai') {
            $query->whereIn('status', ['Selesai', 'Ditolak']);
        } else {
            $query->whereIn('status', ['Menunggu', 'Diproses']);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_laporan', 'like', "%{$search}%")
                    ->orWhere('pelapor', 'like', "%{$search}%")
                    ->orWhere('deskripsi_kerusakan', 'like', "%{$search}%")
                    ->orWhereHas('aset', function ($qa) use ($search) {
                        $qa->where('nama_aset', 'like', "%{$search}%")
                            ->orWhere('kode_aset', 'like', "%{$search}%");
                    });
            });
        }

        // Ambil daftar aset aktif untuk modal pengajuan perbaikan
        $activeAsetQuery = Aset::where('status', '!=', 'Dihapuskan')
            ->orderBy('nama_aset', 'asc');

        $user = $request->user();
        if (! empty($lembaga)) {
            $query->whereHas('aset', function ($qa) use ($lembaga) {
                $qa->where('lembaga', $lembaga);
            });
            $activeAsetQuery->where('lembaga', $lembaga);
        } elseif ($user && $user->lembaga !== 'Yayasan') {
            $query->whereHas('aset', function ($qa) use ($user) {
                $qa->where('lembaga', $user->lembaga)->orWhereNull('lembaga');
            });
            $activeAsetQuery->where(function ($qa) use ($user) {
                $qa->where('lembaga', $user->lembaga)->orWhereNull('lembaga');
            });
        }

        if (! empty($prioritas)) {
            $query->where('prioritas', $prioritas);
        }

        $perbaikans = $query->orderBy('created_at', 'desc')->get();
        $activeAsets = $activeAsetQuery->get();

        $statsBase = PerbaikanAset::query();
        if ($user && $user->lembaga !== 'Yayasan') {
            $statsBase->whereHas('aset', fn ($qa) => $qa->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }

        $stats = [
            'total_laporan' => (clone $statsBase)->count(),
            'menunggu' => (clone $statsBase)->where('status', 'Menunggu')->count(),
            'diproses' => (clone $statsBase)->where('status', 'Diproses')->count(),
            'selesai' => (clone $statsBase)->where('status', 'Selesai')->count(),
            'total_biaya' => (float) (clone $statsBase)->where('status', 'Selesai')->sum('biaya'),
        ];

        return Inertia::render('Sarpras/Perbaikan', [
            'perbaikans' => $perbaikans,
            'activeAsets' => $activeAsets,
            'filters' => [
                'tab' => $tab,
                'search' => $search,
                'lembaga' => $lembaga,
                'prioritas' => $prioritas,
            ],
            'options' => [
                'lembaga' => array_keys($this->getLembagaOptions()),
                'lembaga_ruangan' => $this->getLembagaOptions(),
            ],
            'stats' => $stats,
        ]);
    }

    public function storePerbaikan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'aset_id' => 'required|exists:asets,id',
            'pelapor' => 'required|string|max:255',
            'deskripsi_kerusakan' => 'required|string',
            'prioritas' => 'required|in:Rendah,Sedang,Tinggi,Darurat',
            'tanggal_pengajuan' => 'nullable|date',
        ]);

        $nextId = (PerbaikanAset::max('id') ?? 0) + 1;
        $validated['nomor_laporan'] = 'PBK-'.date('Y').'-'.str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);
        $validated['status'] = 'Menunggu';
        $validated['tanggal_pengajuan'] = $validated['tanggal_pengajuan'] ?? now()->toDateString();

        PerbaikanAset::create($validated);

        // Update status aset terkait
        Aset::where('id', $validated['aset_id'])->update([
            'status' => 'Dalam Perbaikan',
        ]);

        return back()->with('success', 'Laporan kerusakan aset berhasil dibuat dan menunggu tindakan.');
    }

    public function updateStatusPerbaikan(Request $request, PerbaikanAset $perbaikan): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Menunggu,Diproses,Selesai,Ditolak',
            'biaya' => 'nullable|numeric|min:0',
            'teknisi' => 'nullable|string|max:255',
            'catatan_penyelesaian' => 'nullable|string',
            'tanggal_selesai' => 'nullable|date',
        ]);

        if ($validated['status'] === 'Selesai') {
            $validated['tanggal_selesai'] = $validated['tanggal_selesai'] ?? now()->toDateString();
            // Kembalikan kondisi aset jadi Baik dan status Tersedia
            $perbaikan->aset()->update([
                'kondisi' => 'Baik',
                'status' => 'Tersedia',
            ]);
        } elseif ($validated['status'] === 'Ditolak') {
            // Kembalikan status aset jadi Tersedia (tetap sesuai kondisi terakhir)
            $perbaikan->aset()->update([
                'status' => 'Tersedia',
            ]);
        }

        $perbaikan->update($validated);

        return back()->with('success', 'Status perbaikan aset berhasil diperbarui.');
    }

    /**
     * Halaman 3: Pengadaan Aset Baru
     */
    public function pengadaan(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('status', '');
        $lembaga = $request->input('lembaga', '');

        $query = PengadaanAset::query();

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_pengadaan', 'like', "%{$search}%")
                    ->orWhere('nama_barang', 'like', "%{$search}%")
                    ->orWhere('lokasi_tujuan', 'like', "%{$search}%");
            });
        }

        if (! empty($status)) {
            $query->where('status', $status);
        }

        $user = $request->user();
        if (! empty($lembaga)) {
            $query->where('lembaga', $lembaga);
        } elseif ($user && $user->lembaga !== 'Yayasan') {
            $query->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }

        $pengadaans = $query->orderBy('created_at', 'desc')->get();

        $statsBase = PengadaanAset::query();
        if ($user && $user->lembaga !== 'Yayasan') {
            $statsBase->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }

        $stats = [
            'total_pengadaan' => (clone $statsBase)->count(),
            'diajukan' => (clone $statsBase)->where('status', 'Diajukan')->count(),
            'disetujui' => (clone $statsBase)->where('status', 'Disetujui')->count(),
            'diterima' => (clone $statsBase)->where('status', 'Diterima')->count(),
            'estimasi_total' => (float) (clone $statsBase)->whereIn('status', ['Diajukan', 'Disetujui', 'Diterima'])->sum('estimasi_biaya'),
        ];

        $kategoriOptions = [
            'Mebel & Furnitur',
            'Elektronik & IT',
            'Fasilitas Asrama',
            'Alat Kebersihan',
            'Peralatan Dapur',
            'Kendaraan',
            'Lainnya',
        ];

        $lembagaOptions = $this->getLembagaOptions();
        $lokasiOptions = $this->getAllLokasiOptions();

        return Inertia::render('Sarpras/Pengadaan', [
            'pengadaans' => $pengadaans,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'lembaga' => $lembaga,
            ],
            'options' => [
                'kategori' => $kategoriOptions,
                'lokasi' => $lokasiOptions,
                'status' => ['Diajukan', 'Disetujui', 'Ditolak', 'Diterima'],
                'lembaga' => array_keys($lembagaOptions),
                'lembaga_ruangan' => $lembagaOptions,
            ],
            'stats' => $stats,
        ]);
    }

    public function storePengadaan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'lembaga' => 'nullable|string|max:255',
            'kategori' => 'required|string|max:255',
            'lokasi_tujuan' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'satuan' => 'required|string|max:50',
            'estimasi_biaya' => 'nullable|numeric|min:0',
            'sumber_dana' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string',
            'tanggal_pengajuan' => 'nullable|date',
        ]);

        $nextId = (PengadaanAset::max('id') ?? 0) + 1;
        $nomorPengadaan = 'PGD-'.date('Y').'-'.str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);
        $tgl = $validated['tanggal_pengajuan'] ?? now()->toDateString();

        $user = $request->user();
        $lembaga = $validated['lembaga'] ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

        // 1. Simpan riwayat transaksi pengadaan dengan status langsung Diterima
        $pengadaan = PengadaanAset::create([
            'nomor_pengadaan' => $nomorPengadaan,
            'nama_barang' => $validated['nama_barang'],
            'lembaga' => $lembaga,
            'kategori' => $validated['kategori'],
            'lokasi_tujuan' => $validated['lokasi_tujuan'],
            'jumlah' => $validated['jumlah'],
            'satuan' => $validated['satuan'],
            'estimasi_biaya' => $validated['estimasi_biaya'] ?? null,
            'sumber_dana' => $validated['sumber_dana'] ?? null,
            'keterangan' => $validated['keterangan'] ?? null,
            'tanggal_pengajuan' => $tgl,
            'status' => 'Diterima',
            'tanggal_diterima' => $tgl,
        ]);

        // 2. Langsung masukkan ke inventaris aktif
        $nextAsetId = (Aset::max('id') ?? 0) + 1;
        $kodeAset = 'AST-'.date('Y').'-'.str_pad((string) $nextAsetId, 4, '0', STR_PAD_LEFT);

        Aset::create([
            'kode_aset' => $kodeAset,
            'nama_aset' => $validated['nama_barang'],
            'lembaga' => $lembaga,
            'kategori' => $validated['kategori'],
            'lokasi' => $validated['lokasi_tujuan'],
            'jumlah' => $validated['jumlah'],
            'satuan' => $validated['satuan'],
            'kondisi' => 'Baik',
            'status' => 'Tersedia',
            'tanggal_perolehan' => $tgl,
            'nilai_perolehan' => $validated['estimasi_biaya'],
            'catatan_pemeriksaan' => 'Aset baru dari pengadaan nomor '.$nomorPengadaan,
            'tanggal_pemeriksaan_terakhir' => $tgl,
        ]);

        return back()->with('success', 'Pembelian aset baru berhasil dicatat dan langsung otomatis masuk ke Inventaris aktif.');
    }

    public function updateStatusPengadaan(Request $request, PengadaanAset $pengadaan): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Diajukan,Disetujui,Ditolak',
        ]);

        $pengadaan->update($validated);

        return back()->with('success', 'Status usulan pengadaan berhasil diperbarui.');
    }

    public function terimaPengadaan(Request $request, PengadaanAset $pengadaan): RedirectResponse
    {
        $pengadaan->update([
            'status' => 'Diterima',
            'tanggal_diterima' => now()->toDateString(),
        ]);

        // Otomatis masukkan ke inventaris aktif
        $nextId = (Aset::max('id') ?? 0) + 1;
        $kodeAset = 'AST-'.date('Y').'-'.str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);

        Aset::create([
            'kode_aset' => $kodeAset,
            'nama_aset' => $pengadaan->nama_barang,
            'kategori' => $pengadaan->kategori,
            'lokasi' => $pengadaan->lokasi_tujuan,
            'jumlah' => $pengadaan->jumlah,
            'satuan' => $pengadaan->satuan,
            'kondisi' => 'Baik',
            'status' => 'Tersedia',
            'tanggal_perolehan' => now()->toDateString(),
            'nilai_perolehan' => $pengadaan->estimasi_biaya,
            'catatan_pemeriksaan' => 'Barang baru dari pengadaan nomor '.$pengadaan->nomor_pengadaan,
            'tanggal_pemeriksaan_terakhir' => now()->toDateString(),
        ]);

        return back()->with('success', 'Barang pengadaan berhasil diterima dan otomatis dimasukkan ke inventaris aktif.');
    }

    public function destroyPengadaan(PengadaanAset $pengadaan): RedirectResponse
    {
        // Hapus juga aset di inventaris yang dibuat otomatis dari nomor pengadaan ini
        Aset::where('catatan_pemeriksaan', 'like', '%'.$pengadaan->nomor_pengadaan.'%')->delete();

        $pengadaan->delete();

        return back()->with('success', 'Riwayat pembelian aset dan data inventaris terkait berhasil dihapus.');
    }
}
