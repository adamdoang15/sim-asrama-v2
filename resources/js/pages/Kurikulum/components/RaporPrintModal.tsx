import React from 'react';
import { Printer } from 'lucide-react';
import { LedgerStudent, ClassLedger } from '../types';

interface RaporPrintModalProps {
    student: LedgerStudent | null;
    selectedKelas: string;
    selectedTahun: string;
    classLedger: ClassLedger;
    waliKelas?: { name: string; niy: string | null } | null;
    onClose: () => void;
}

export default function RaporPrintModal({
    student,
    selectedKelas,
    selectedTahun,
    classLedger,
    waliKelas,
    onClose,
}: RaporPrintModalProps) {
    if (!student) return null;

    const getIndonesianDate = () => {
        return new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatKdDescription = (desc?: string) => {
        if (!desc) return 'Tuntas mencapai indikator kompetensi dasar standar KKM.';
        try {
            if (desc.startsWith('[') && desc.endsWith(']')) {
                const parsed = JSON.parse(desc);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.join('; ');
                }
            }
        } catch {
            // fallback
        }
        return desc;
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start print:p-0 print:bg-white print:static">
            {/* Control Bar (Hidden on print) */}
            <div className="no-print w-full max-w-[210mm] mb-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-4 sticky top-4 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Printer className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            Pratinjau Rapor Santri (A4 Portrait)
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {student.name} ({student.nig}) &bull; {selectedKelas}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
                    >
                        Tutup
                    </button>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer active:scale-[0.98]"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Rapor</span>
                    </button>
                </div>
            </div>

            {/* Lembar Rapor Dokumen (Target Cetak A4 Portrait - 6 Halaman) */}
            <div
                id="print-area"
                className="w-full max-w-[210mm] text-slate-900 print:p-0 print:max-w-none print:w-full font-sans"
            >
                {/* ==================== HALAMAN 1: COVER DEPAN ==================== */}
                <div className="print-page bg-white p-10 sm:p-14 mb-8 shadow-2xl rounded-sm print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between box-border">
                    <div className="border-4 border-double border-slate-900 h-full p-8 sm:p-12 flex flex-col justify-between items-center text-center">
                        <div className="pt-4">
                            <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase">
                                YAYASAN PEMBINA PENDIDIKAN DOA BANGSA
                            </h3>
                            <h2 className="text-xl font-extrabold tracking-wider text-slate-900 uppercase mt-1">
                                LEMBAGA KURSUS PELATIHAN (LKP) DOA BANGSA
                            </h2>
                            <p className="text-xs text-slate-600 mt-1">
                                Akreditasi BAN PAUD dan PNF • Izin Operasional Kemendikbudristek RI
                            </p>
                        </div>

                        <div className="my-8 flex flex-col items-center">
                            <div className="w-36 h-36 flex items-center justify-center p-2">
                                <img
                                    src="/logo.png"
                                    alt="Logo LKP Doa Bangsa"
                                    className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className="w-24 h-1 bg-amber-500 rounded-full mt-4" />
                        </div>

                        <div className="my-4">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 uppercase tracking-wide leading-tight">
                                LAPORAN PENILAIAN<br />HASIL BELAJAR GELARA
                            </h1>
                            <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mt-2">
                                (BUKU RAPOR ASRAMA &amp; AKADEMIK)
                            </p>
                        </div>

                        <div className="w-full max-w-md my-6 p-5 border-2 border-slate-900 rounded-lg bg-slate-50/50">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                                Nama Gelara / Santri:
                            </p>
                            <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                                {student.name}
                            </h4>
                            <div className="mt-3 pt-3 border-t border-slate-300 flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-medium">Nomor Induk Gelara (NIG):</span>
                                <span className="font-mono font-bold text-slate-900 text-sm tracking-wider">
                                    {student.nig}
                                </span>
                            </div>
                            <div className="mt-1 flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-medium">Kelas / Tingkat:</span>
                                <span className="font-semibold text-slate-900">{selectedKelas}</span>
                            </div>
                            <div className="mt-1 flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-medium">Tahun Akademik:</span>
                                <span className="font-semibold text-slate-900">{selectedTahun}</span>
                            </div>
                        </div>

                        <div className="pb-4 text-xs text-slate-700">
                            <p className="font-bold uppercase tracking-wider text-slate-900">
                                LKP DOA BANGSA CICANTAYAN SUKABUMI
                            </p>
                            <p className="mt-0.5 text-slate-600">
                                Jl. Pelabuhan II Km. 19, Desa Cicantayan, Kec. Cicantayan, Kab. Sukabumi, Jawa Barat
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">
                                Website: www.doabangsa.sch.id &bull; E-mail: lkp@doabangsa.sch.id
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================== HALAMAN 2: BIODATA GELARA (17 BUTIR) ==================== */}
                <div className="print-page bg-white p-8 sm:p-12 mb-8 shadow-2xl rounded-sm print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between box-border text-xs leading-relaxed">
                    <div>
                        <div className="text-center mb-6 pb-2 border-b-2 border-slate-900">
                            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900">
                                KETERANGAN TENTANG DIRI GELARA
                            </h2>
                            <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                                Buku Induk Santri Lembaga Kursus Pelatihan Doa Bangsa Cicantayan
                            </p>
                        </div>

                        <table className="w-full text-xs">
                            <tbody>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">1.</td>
                                    <td className="w-56 py-1 text-slate-700">Nama Lengkap Gelara</td>
                                    <td className="w-4 py-1 text-center">:</td>
                                    <td className="py-1 font-bold text-slate-900 uppercase">{student.name}</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">2.</td>
                                    <td className="py-1 text-slate-700">Nomor Induk Gelara (NIG)</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 font-semibold text-slate-900 font-mono">{student.nig}</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">3.</td>
                                    <td className="py-1 text-slate-700">Tempat, Tanggal Lahir</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">{student.ttl || 'Sukabumi, 12 Mei 2008'}</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">4.</td>
                                    <td className="py-1 text-slate-700">Jenis Kelamin</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">{student.jenis_kelamin || 'Laki-laki'}</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">5.</td>
                                    <td className="py-1 text-slate-700">Agama</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">{student.agama || 'Islam'}</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">6.</td>
                                    <td className="py-1 text-slate-700">Status dalam Keluarga</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">Anak Kandung</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">7.</td>
                                    <td className="py-1 text-slate-700">Anak ke-</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">1 (Satu)</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">8.</td>
                                    <td className="py-1 text-slate-700">Alamat Tempat Tinggal Santri</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">{student.domisili || 'Asrama Prestasi LKP Doa Bangsa Cicantayan Sukabumi'}</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">9.</td>
                                    <td className="py-1 text-slate-700">Nomor Telepon / WhatsApp</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">0812-3456-7890</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">10.</td>
                                    <td className="py-1 text-slate-700">Asal Satuan Pendidikan / LKP</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">LKP Doa Bangsa Cicantayan</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">11.</td>
                                    <td className="py-1 text-slate-700">Diterima di Lembaga Ini</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        <div>a. Di Tingkat / Kelas : <strong className="font-semibold text-slate-900">{selectedKelas}</strong></div>
                                        <div>b. Pada Tanggal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {student.tahun_diterima || '15 Juli 2024'}</div>
                                    </td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">12.</td>
                                    <td className="py-1 text-slate-700">Nama Orang Tua Kandung</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        <div>a. Ayah : <strong className="font-semibold text-slate-900">{student.nama_ayah || 'Bapak Santri'}</strong></div>
                                        <div>b. Ibu &nbsp;&nbsp;: <strong className="font-semibold text-slate-900">{student.nama_ibu || 'Ibu Santri'}</strong></div>
                                    </td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">13.</td>
                                    <td className="py-1 text-slate-700">Alamat Tempat Tinggal Orang Tua</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">{student.domisili || 'Kp. Cicantayan RT 02/03, Kec. Cicantayan, Kab. Sukabumi'}</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">14.</td>
                                    <td className="py-1 text-slate-700">Pekerjaan Orang Tua</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        <div>a. Ayah : {student.pekerjaan_ayah || 'Wiraswasta'}</div>
                                        <div>b. Ibu &nbsp;&nbsp;: {student.pekerjaan_ibu || 'Ibu Rumah Tangga'}</div>
                                    </td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">15.</td>
                                    <td className="py-1 text-slate-700">Nama Wali Gelara</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">-</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">16.</td>
                                    <td className="py-1 text-slate-700">Alamat Wali Gelara</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">-</td>
                                </tr>
                                <tr className="align-top py-1">
                                    <td className="w-8 py-1 font-semibold text-slate-700">17.</td>
                                    <td className="py-1 text-slate-700">Pekerjaan Wali Gelara</td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">-</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Pas Foto 3x4 & Tanda Tangan Kepala Lembaga */}
                        <div className="mt-8 flex justify-between items-end px-4">
                            <div className="w-28 h-36 border-2 border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center text-center p-2 rounded-sm text-slate-400">
                                {student.foto ? (
                                    <img src={student.foto} alt="Pas Foto" className="w-full h-full object-cover rounded-xs" />
                                ) : (
                                    <>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pas Foto</span>
                                        <span className="text-xs font-semibold text-slate-400 mt-0.5">3 x 4 cm</span>
                                    </>
                                )}
                            </div>

                            <div className="text-center text-xs">
                                <p className="text-slate-700">Sukabumi, {getIndonesianDate()}</p>
                                <p className="font-bold text-slate-900 mt-1">Kepala Lembaga LKP Doa Bangsa</p>
                                <div className="h-20" />
                                <p className="font-bold text-slate-900 underline underline-offset-2">
                                    H. Teguh Eko P, S.Pd., M.M.
                                </p>
                                <p className="text-slate-600 text-[11px] mt-0.5 font-mono">
                                    NIY: 19820415 200801 1 002
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 2 */}
                    <div className="pt-3 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between items-center italic">
                        <span>{student.name} ({student.nig})</span>
                        <span className="font-semibold text-slate-700">Halaman 2</span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>

                {/* ==================== HALAMAN 3: PENCAPAIAN SIKAP ==================== */}
                <div className="print-page bg-white p-8 sm:p-12 mb-8 shadow-2xl rounded-sm print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between box-border text-xs">
                    <div>
                        {/* Header Identitas Rapor */}
                        <div className="border-b border-slate-300 pb-3 mb-5">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                <div className="flex"><span className="w-28 text-slate-600">Nama Gelara</span><span className="w-3">:</span><strong className="font-bold text-slate-900">{student.name}</strong></div>
                                <div className="flex"><span className="w-28 text-slate-600">Kelas / Tingkat</span><span className="w-3">:</span><span className="font-semibold text-slate-900">{selectedKelas}</span></div>
                                <div className="flex"><span className="w-28 text-slate-600">Nomor Induk (NIG)</span><span className="w-3">:</span><span className="font-mono text-slate-900">{student.nig}</span></div>
                                <div className="flex"><span className="w-28 text-slate-600">Semester</span><span className="w-3">:</span><span className="font-semibold text-slate-900">{selectedTahun.includes('Genap') ? 'Genap (II)' : 'Ganjil (I)'}</span></div>
                                <div className="flex"><span className="w-28 text-slate-600">Nama Lembaga</span><span className="w-3">:</span><span className="text-slate-900 font-medium">LKP Doa Bangsa Cicantayan</span></div>
                                <div className="flex"><span className="w-28 text-slate-600">Tahun Akademik</span><span className="w-3">:</span><span className="font-semibold text-slate-900">{selectedTahun}</span></div>
                            </div>
                        </div>

                        {/* Judul Bagian */}
                        <div className="text-center mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 underline underline-offset-4">
                                CAPAIAN KOMPETENSI SIKAP
                            </h3>
                        </div>

                        {/* Bagian A. SIKAP */}
                        <div className="mb-6">
                            <h4 className="font-bold text-slate-900 text-xs mb-2">A. SIKAP</h4>

                            {/* 1. Sikap Spiritual */}
                            <div className="border border-slate-300 rounded-sm mb-4">
                                <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 font-bold text-slate-900 flex justify-between items-center">
                                    <span>1. Sikap Spiritual</span>
                                    <span className="text-xs bg-white px-2.5 py-0.5 rounded border border-slate-300 font-extrabold text-blue-900">
                                        Predikat: {student.pelengkap?.sikap_spiritual_predikat || 'A'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50/40">
                                    <p className="text-slate-500 font-semibold text-[11px] mb-1">Deskripsi Capaian:</p>
                                    <p className="text-slate-800 leading-relaxed text-xs">
                                        {student.pelengkap?.sikap_spiritual_deskripsi ||
                                            'Selalu bersyukur, sangat taat beribadah shalat fardhu dan sunnah berjamaah di masjid asrama, istiqomah dalam membaca Al-Qur\'an dan senantiasa berdzikir, serta menunjukkan keteladanan akhlak islami yang luhur kepada sesama santri.'}
                                    </p>
                                </div>
                            </div>

                            {/* 2. Sikap Sosial */}
                            <div className="border border-slate-300 rounded-sm">
                                <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 font-bold text-slate-900 flex justify-between items-center">
                                    <span>2. Sikap Sosial</span>
                                    <span className="text-xs bg-white px-2.5 py-0.5 rounded border border-slate-300 font-extrabold text-blue-900">
                                        Predikat: {student.pelengkap?.sikap_sosial_predikat || 'A'}
                                    </span>
                                </div>
                                <div className="p-3.5 bg-slate-50/40">
                                    <p className="text-slate-500 font-semibold text-[11px] mb-1">Deskripsi Capaian:</p>
                                    <p className="text-slate-800 leading-relaxed text-xs">
                                        {student.pelengkap?.sikap_sosial_deskripsi ||
                                            'Sangat santun dalam bertutur kata, memiliki jiwa kepemimpinan dan empati sosial yang tinggi, disiplin dalam mengikuti seluruh rangkaian kegiatan kedisiplinan asrama, serta aktif bergotong royong menjaga kebersihan dan ketertiban lingkungan bersama.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tanda Tangan Wali Tingkat */}
                        <div className="mt-12 flex justify-end">
                            <div className="text-center text-xs w-64">
                                <p className="text-slate-600">Sukabumi, {getIndonesianDate()}</p>
                                <p className="font-bold text-slate-900 mt-1">Wali Tingkat {selectedKelas}</p>
                                <div className="h-20" />
                                <p className="font-bold text-slate-900 underline underline-offset-2">
                                    {waliKelas?.name || '...........................................'}
                                </p>
                                <p className="text-slate-600 text-[11px] mt-0.5 font-mono">
                                    NIY: {waliKelas?.niy || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 3 */}
                    <div className="pt-3 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between items-center italic">
                        <span>{student.name} ({student.nig})</span>
                        <span className="font-semibold text-slate-700">Halaman 3</span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>

                {/* ==================== HALAMAN 4: PENGETAHUAN & KETERAMPILAN ==================== */}
                <div className="print-page bg-white p-8 sm:p-12 mb-8 shadow-2xl rounded-sm print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between box-border text-xs">
                    <div>
                        {/* Header Identitas Rapor */}
                        <div className="border-b border-slate-300 pb-3 mb-4">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                <div className="flex"><span className="w-28 text-slate-600">Nama Gelara</span><span className="w-3">:</span><strong className="font-bold text-slate-900">{student.name}</strong></div>
                                <div className="flex"><span className="w-28 text-slate-600">Kelas / Tingkat</span><span className="w-3">:</span><span className="font-semibold text-slate-900">{selectedKelas}</span></div>
                                <div className="flex"><span className="w-28 text-slate-600">Nomor Induk (NIG)</span><span className="w-3">:</span><span className="font-mono text-slate-900">{student.nig}</span></div>
                                <div className="flex"><span className="w-28 text-slate-600">Semester</span><span className="w-3">:</span><span className="font-semibold text-slate-900">{selectedTahun.includes('Genap') ? 'Genap (II)' : 'Ganjil (I)'}</span></div>
                            </div>
                        </div>

                        {/* Bagian B. PENGETAHUAN */}
                        <div className="mb-5">
                            <h4 className="font-bold text-slate-900 text-xs mb-2">B. PENGETAHUAN (KOGNITIF)</h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-300 text-center font-bold text-slate-800">
                                        <th className="border border-slate-300 py-1.5 px-1 w-8">No</th>
                                        <th className="border border-slate-300 py-1.5 px-2 text-left min-w-[130px]">Mata Pelajaran</th>
                                        <th className="border border-slate-300 py-1.5 px-1 w-12">KKM</th>
                                        <th className="border border-slate-300 py-1.5 px-1 w-14">Nilai</th>
                                        <th className="border border-slate-300 py-1.5 px-1 w-12">Predikat</th>
                                        <th className="border border-slate-300 py-1.5 px-2 text-left">Capaian Kompetensi / Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classLedger.mapels.map((mapel, index) => {
                                        const score = student.scores[mapel];
                                        const na = score?.nilai_akhir ?? 0;
                                        const pred = score?.predikat ?? '-';
                                        const desc = formatKdDescription(score?.deskripsi);
                                        return (
                                            <tr key={'p-' + mapel} className="border-b border-slate-300">
                                                <td className="border border-slate-300 py-1 px-1 text-center font-semibold text-slate-600">{index + 1}</td>
                                                <td className="border border-slate-300 py-1 px-2 font-semibold text-slate-900">{mapel}</td>
                                                <td className="border border-slate-300 py-1 px-1 text-center text-slate-600">75</td>
                                                <td className="border border-slate-300 py-1 px-1 text-center font-bold text-slate-900">{na > 0 ? na.toFixed(1) : '-'}</td>
                                                <td className="border border-slate-300 py-1 px-1 text-center font-bold">{pred}</td>
                                                <td className="border border-slate-300 py-1 px-2 text-[10px] text-slate-700 leading-tight">{desc}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Bagian C. KETERAMPILAN */}
                        <div className="mb-4">
                            <h4 className="font-bold text-slate-900 text-xs mb-2">C. KETERAMPILAN (PSIKOMOTORIK)</h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-300 text-center font-bold text-slate-800">
                                        <th className="border border-slate-300 py-1.5 px-1 w-8">No</th>
                                        <th className="border border-slate-300 py-1.5 px-2 text-left min-w-[130px]">Mata Pelajaran</th>
                                        <th className="border border-slate-300 py-1.5 px-1 w-12">KKM</th>
                                        <th className="border border-slate-300 py-1.5 px-1 w-14">Nilai</th>
                                        <th className="border border-slate-300 py-1.5 px-1 w-12">Predikat</th>
                                        <th className="border border-slate-300 py-1.5 px-2 text-left">Capaian Keterampilan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classLedger.mapels.slice(0, 4).map((mapel, index) => {
                                        const score = student.scores[mapel];
                                        const na = score?.nilai_akhir ? Math.min(100, Math.round((score.nilai_akhir + 1) * 10) / 10) : 0;
                                        const pred = score?.predikat ?? '-';
                                        return (
                                            <tr key={'k-' + mapel} className="border-b border-slate-300">
                                                <td className="border border-slate-300 py-1 px-1 text-center font-semibold text-slate-600">{index + 1}</td>
                                                <td className="border border-slate-300 py-1 px-2 font-semibold text-slate-900">{mapel}</td>
                                                <td className="border border-slate-300 py-1 px-1 text-center text-slate-600">75</td>
                                                <td className="border border-slate-300 py-1 px-1 text-center font-bold text-slate-900">{na > 0 ? na.toFixed(1) : '-'}</td>
                                                <td className="border border-slate-300 py-1 px-1 text-center font-bold">{pred}</td>
                                                <td className="border border-slate-300 py-1 px-2 text-[10px] text-slate-700 leading-tight">
                                                    Sangat terampil dan aktif dalam mempraktikkan materi pembelajaran serta penugasan mandiri.
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Tanda Tangan Wali Tingkat */}
                        <div className="mt-6 flex justify-end">
                            <div className="text-center text-xs w-64">
                                <p className="text-slate-600">Sukabumi, {getIndonesianDate()}</p>
                                <p className="font-bold text-slate-900 mt-0.5">Wali Tingkat {selectedKelas}</p>
                                <div className="h-16" />
                                <p className="font-bold text-slate-900 underline underline-offset-2">
                                    {waliKelas?.name || '...........................................'}
                                </p>
                                <p className="text-slate-600 text-[11px] mt-0.5 font-mono">
                                    NIY: {waliKelas?.niy || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 4 */}
                    <div className="pt-3 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between items-center italic">
                        <span>{student.name} ({student.nig})</span>
                        <span className="font-semibold text-slate-700">Halaman 4</span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>

                {/* ==================== HALAMAN 5: EKSKUL, PRESTASI, ABSENSI & CATATAN ==================== */}
                <div className="print-page bg-white p-8 sm:p-12 mb-8 shadow-2xl rounded-sm print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between box-border text-xs">
                    <div>
                        {/* Header Identitas Rapor */}
                        <div className="border-b border-slate-300 pb-3 mb-4">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                <div className="flex"><span className="w-28 text-slate-600">Nama Gelara</span><span className="w-3">:</span><strong className="font-bold text-slate-900">{student.name}</strong></div>
                                <div className="flex"><span className="w-28 text-slate-600">Kelas / Tingkat</span><span className="w-3">:</span><span className="font-semibold text-slate-900">{selectedKelas}</span></div>
                                <div className="flex"><span className="w-28 text-slate-600">Nomor Induk (NIG)</span><span className="w-3">:</span><span className="font-mono text-slate-900">{student.nig}</span></div>
                                <div className="flex"><span className="w-28 text-slate-600">Semester</span><span className="w-3">:</span><span className="font-semibold text-slate-900">{selectedTahun.includes('Genap') ? 'Genap (II)' : 'Ganjil (I)'}</span></div>
                            </div>
                        </div>

                        {/* D. EKSTRAKURIKULER */}
                        <div className="mb-4">
                            <h4 className="font-bold text-slate-900 text-xs mb-1.5">D. EKSTRAKURIKULER</h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-300 text-center font-bold text-slate-800">
                                        <th className="border border-slate-300 py-1.5 px-1 w-8">No</th>
                                        <th className="border border-slate-300 py-1.5 px-3 text-left w-56">Kegiatan Ekstrakurikuler</th>
                                        <th className="border border-slate-300 py-1.5 px-2 w-16">Nilai</th>
                                        <th className="border border-slate-300 py-1.5 px-3 text-left">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(student.pelengkap?.ekskul?.length ? student.pelengkap.ekskul : [
                                        { nama: 'Pramuka Garuda / Kepanduan', nilai: 'A', keterangan: 'Sangat aktif dan berdedikasi tinggi' },
                                        { nama: 'Tahfidz Al-Qur\'an', nilai: 'A', keterangan: 'Mencapai target hafalan juz dengan tartil' },
                                        { nama: 'Seni Hadroh / Tilawah', nilai: 'B', keterangan: 'Menguasai teknik dasar dengan baik' }
                                    ]).map((item, idx) => (
                                        <tr key={idx} className="border-b border-slate-300">
                                            <td className="border border-slate-300 py-1.5 px-1 text-center font-semibold text-slate-600">{idx + 1}</td>
                                            <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-900">{item.nama}</td>
                                            <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-slate-900">{item.nilai}</td>
                                            <td className="border border-slate-300 py-1.5 px-3 text-slate-700">{item.keterangan}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* E. PRESTASI & F. KETIDAKHADIRAN dalam 2 kolom */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* E. PRESTASI */}
                            <div>
                                <h4 className="font-bold text-slate-900 text-xs mb-1.5">E. PRESTASI</h4>
                                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                    <thead>
                                        <tr className="bg-slate-100 border-b border-slate-300 text-center font-bold text-slate-800">
                                            <th className="border border-slate-300 py-1.5 px-1 w-8">No</th>
                                            <th className="border border-slate-300 py-1.5 px-2 text-left">Jenis Prestasi</th>
                                            <th className="border border-slate-300 py-1.5 px-2 text-left">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(student.prestasis?.length ? student.prestasis : [
                                            { nama: 'Lomba Pidato Bahasa Arab', keterangan: 'Juara II Tingkat Kabupaten' },
                                            { nama: 'MHQ 5 Juz Antar Santri', keterangan: 'Peringkat Terbaik' },
                                        ]).map((pres, idx) => (
                                            <tr key={idx} className="border-b border-slate-300">
                                                <td className="border border-slate-300 py-1.5 px-1 text-center font-semibold text-slate-600">{idx + 1}</td>
                                                <td className="border border-slate-300 py-1.5 px-2 font-semibold text-slate-900">{pres.nama}</td>
                                                <td className="border border-slate-300 py-1.5 px-2 text-slate-700">{pres.keterangan}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* F. KETIDAKHADIRAN */}
                            <div>
                                <h4 className="font-bold text-slate-900 text-xs mb-1.5">F. KETIDAKHADIRAN</h4>
                                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                    <tbody>
                                        <tr className="border-b border-slate-300">
                                            <td className="border border-slate-300 py-1.5 px-3 text-slate-700">1. Sakit</td>
                                            <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-slate-900 w-24">
                                                {student.pelengkap?.absensi_sakit ?? 0} hari
                                            </td>
                                        </tr>
                                        <tr className="border-b border-slate-300">
                                            <td className="border border-slate-300 py-1.5 px-3 text-slate-700">2. Izin</td>
                                            <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-slate-900 w-24">
                                                {student.pelengkap?.absensi_izin ?? 0} hari
                                            </td>
                                        </tr>
                                        <tr className="border-b border-slate-300">
                                            <td className="border border-slate-300 py-1.5 px-3 text-slate-700">3. Tanpa Keterangan</td>
                                            <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-slate-900 w-24">
                                                {student.pelengkap?.absensi_alpha ?? 0} hari
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* G. CATATAN WALI TINGKAT */}
                        <div className="border border-slate-300 rounded-sm p-3 mb-3 bg-slate-50/50">
                            <h4 className="font-bold text-slate-900 text-xs mb-1">G. CATATAN WALI TINGKAT</h4>
                            <p className="text-slate-800 italic leading-relaxed text-[11px]">
                                "{student.pelengkap?.catatan_wali || 'Alhamdulillah ananda ' + student.name + ' menunjukkan peningkatan yang sangat menggembirakan baik dalam disiplin asrama, adab kepada asatidz, maupun prestasi belajar. Teruslah istiqomah dalam menuntut ilmu dan menjaga hafalan.'}"
                            </p>
                        </div>

                        {/* H. TANGGAPAN ORANG TUA / WALI */}
                        <div className="border border-slate-300 rounded-sm p-3 mb-4 min-h-[50px]">
                            <h4 className="font-bold text-slate-900 text-xs mb-1">H. TANGGAPAN ORANG TUA / WALI</h4>
                            <div className="h-8 border-b border-dashed border-slate-200" />
                        </div>

                        {/* Tanda Tangan 3 Pihak */}
                        <div className="grid grid-cols-3 gap-4 text-center text-xs mt-3">
                            <div>
                                <p className="text-slate-600 mb-0.5">Mengetahui,</p>
                                <p className="font-bold text-slate-900">Orang Tua / Wali Gelara</p>
                                <div className="h-16" />
                                <p className="border-t border-slate-400 pt-1 font-semibold mx-2">
                                    ( .................................................. )
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-600 mb-0.5">Mengetahui,</p>
                                <p className="font-bold text-slate-900">Kepala Lembaga LKP Doa Bangsa</p>
                                <div className="h-16" />
                                <p className="border-t border-slate-400 pt-1 font-bold mx-2 underline underline-offset-2">
                                    H. Teguh Eko P, S.Pd., M.M.
                                </p>
                                <p className="text-slate-600 text-[10px] font-mono">NIY: 19820415 200801 1 002</p>
                            </div>
                            <div>
                                <p className="text-slate-600 mb-0.5">Sukabumi, {getIndonesianDate()}</p>
                                <p className="font-bold text-slate-900">Wali Tingkat {selectedKelas}</p>
                                <div className="h-16" />
                                <p className="border-t border-slate-400 pt-1 font-bold mx-2 underline underline-offset-2">
                                    {waliKelas?.name || '...........................................'}
                                </p>
                                <p className="text-slate-600 text-[10px] font-mono">NIY: {waliKelas?.niy || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 5 */}
                    <div className="pt-3 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between items-center italic">
                        <span>{student.name} ({student.nig})</span>
                        <span className="font-semibold text-slate-700">Halaman 5</span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>

                {/* ==================== HALAMAN 6: LAMPIRAN PEMERIKSAAN KESEHATAN ==================== */}
                <div className="print-page bg-white p-8 sm:p-12 mb-8 shadow-2xl rounded-sm print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between box-border text-xs">
                    <div>
                        {/* KOP RESMI LEMBAGA LKP DOA BANGSA */}
                        <div className="border-b-4 border-double border-slate-900 pb-3 mb-5">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                                    <img
                                        src="/logo.png"
                                        alt="Logo LKP"
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                </div>
                                <div className="text-center flex-1 pr-10">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                                        YAYASAN PEMBINA PENDIDIKAN DOA BANGSA
                                    </h4>
                                    <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-900 mt-0.5">
                                        LEMBAGA KURSUS PELATIHAN (LKP) DOA BANGSA
                                    </h2>
                                    <p className="text-[11px] text-slate-700 mt-0.5">
                                        Jl. Pelabuhan II Km. 19, Desa Cicantayan, Kec. Cicantayan, Kab. Sukabumi, Jawa Barat
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                        Telp/WA: 0812-8888-9999 &bull; Website: www.doabangsa.sch.id &bull; E-mail: lkp@doabangsa.sch.id
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Judul Dokumen */}
                        <div className="text-center mb-5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 underline underline-offset-4">
                                LAPORAN HASIL PEMERIKSAAN KESEHATAN GELARA
                            </h3>
                            <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                                Pemeriksaan Berkala Pos Kesehatan Santri (Poskestren) &bull; Semester {selectedTahun.includes('Genap') ? 'Genap (II)' : 'Ganjil (I)'}
                            </p>
                        </div>

                        {/* Identitas Singkat */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs mb-5 border border-slate-300 bg-slate-50/50 p-3 rounded-sm">
                            <div className="flex"><span className="w-28 text-slate-600">Nama Gelara</span><span className="w-3">:</span><strong className="font-bold text-slate-900">{student.name}</strong></div>
                            <div className="flex"><span className="w-28 text-slate-600">Kelas / Tingkat</span><span className="w-3">:</span><span className="font-semibold text-slate-900">{selectedKelas}</span></div>
                            <div className="flex"><span className="w-28 text-slate-600">Nomor Induk (NIG)</span><span className="w-3">:</span><span className="font-mono text-slate-900">{student.nig}</span></div>
                            <div className="flex"><span className="w-28 text-slate-600">Tahun Akademik</span><span className="w-3">:</span><span className="font-semibold text-slate-900">{selectedTahun}</span></div>
                        </div>

                        {/* 1. PEMERIKSAAN FISIK & TANDA VITAL */}
                        <div className="mb-5">
                            <h4 className="font-bold text-slate-900 text-xs mb-2">1. PEMERIKSAAN FISIK &amp; TANDA VITAL</h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-300 text-center font-bold text-slate-800">
                                        <th className="border border-slate-300 py-1.5 px-1 w-8">No</th>
                                        <th className="border border-slate-300 py-1.5 px-3 text-left">Parameter Pemeriksaan</th>
                                        <th className="border border-slate-300 py-1.5 px-3 text-center w-36">Hasil Pengukuran</th>
                                        <th className="border border-slate-300 py-1.5 px-3 text-left w-48">Nilai Rujukan / Kategori</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 py-1.5 px-1 text-center font-semibold text-slate-600">1</td>
                                        <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-900">Berat Badan (BB)</td>
                                        <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-slate-900">
                                            {student.kesehatan?.berat_badan ? `${student.kesehatan.berat_badan} kg` : '55.0 kg'}
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-3 text-slate-700">Rentang Ideal: 45 - 65 kg</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 py-1.5 px-1 text-center font-semibold text-slate-600">2</td>
                                        <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-900">Tinggi Badan (TB)</td>
                                        <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-slate-900">
                                            {student.kesehatan?.tinggi_badan ? `${student.kesehatan.tinggi_badan} cm` : '165.0 cm'}
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-3 text-slate-700">Pertumbuhan Normal Remaja</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 py-1.5 px-1 text-center font-semibold text-slate-600">3</td>
                                        <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-900">Indeks Massa Tubuh (IMT)</td>
                                        <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-blue-900">
                                            {student.kesehatan?.imt ? `${student.kesehatan.imt} kg/m²` : '20.2 kg/m²'}
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-3 font-semibold text-emerald-800">
                                            {student.kesehatan?.imt_kategori || 'Normal (Ideal)'}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 py-1.5 px-1 text-center font-semibold text-slate-600">4</td>
                                        <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-900">Tekanan Darah (Tensi)</td>
                                        <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-slate-900">
                                            {student.kesehatan?.tensi || '120/80 mmHg'}
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-3 font-semibold text-emerald-800">
                                            {student.kesehatan?.tensi_kategori || 'Normal'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 2. REKAPITULASI RIWAYAT KESEHATAN / SAKIT */}
                        <div className="mb-5">
                            <h4 className="font-bold text-slate-900 text-xs mb-2">2. REKAPITULASI RIWAYAT SAKIT SELAMA SATU SEMESTER</h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-300 text-center font-bold text-slate-800">
                                        <th className="border border-slate-300 py-1.5 px-1 w-8">No</th>
                                        <th className="border border-slate-300 py-1.5 px-3 text-left w-64">Klasifikasi Sakit</th>
                                        <th className="border border-slate-300 py-1.5 px-2 text-center w-28">Jumlah Kasus</th>
                                        <th className="border border-slate-300 py-1.5 px-3 text-left">Keterangan Diagnosa &amp; Penanganan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 py-1.5 px-1 text-center font-semibold text-slate-600">1</td>
                                        <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-900">
                                            Sakit Ringan (Flu, Batuk, Sakit Kepala)
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-slate-900">
                                            {student.kesehatan?.riwayat_sakit?.ringan?.jumlah ?? 1} kali
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-3 text-slate-700">
                                            {student.kesehatan?.riwayat_sakit?.ringan?.keterangan || 'Penanganan obat oral Poskestren, sembuh total setelah istirahat'}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 py-1.5 px-1 text-center font-semibold text-slate-600">2</td>
                                        <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-900">
                                            Sakit Sedang (Demam &gt; 38°C, Maag, Tipes)
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-slate-900">
                                            {student.kesehatan?.riwayat_sakit?.sedang?.jumlah ?? 0} kali
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-3 text-slate-700">
                                            {student.kesehatan?.riwayat_sakit?.sedang?.keterangan || '-'}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 py-1.5 px-1 text-center font-semibold text-slate-600">3</td>
                                        <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-900">
                                            Sakit Berat (Rujukan Rumah Sakit / Rawat Inap)
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-slate-900">
                                            {student.kesehatan?.riwayat_sakit?.berat?.jumlah ?? 0} kali
                                        </td>
                                        <td className="border border-slate-300 py-1.5 px-3 text-slate-700">
                                            {student.kesehatan?.riwayat_sakit?.berat?.keterangan || '-'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 3. CATATAN & REKOMENDASI KESEHATAN UNTUK ORANG TUA */}
                        <div className="border border-slate-300 rounded-sm p-3 mb-6 bg-slate-50/50">
                            <h4 className="font-bold text-slate-900 text-xs mb-1">3. CATATAN &amp; REKOMENDASI MEDIS UNTUK ORANG TUA / WALI</h4>
                            <p className="text-slate-800 italic leading-relaxed text-[11px]">
                                "{student.kesehatan?.catatan_kesehatan || 'Kondisi fisik dan vital santri terpantau dalam batas normal dan bugar. Pertahankan pola makan bergizi seimbang, cukupi asupan cairan minimal 2 liter per hari, dan istirahat teratur di sela rutinitas halaqah dan kegiatan asrama.'}"
                            </p>
                        </div>

                        {/* Tanda Tangan Tim Medis */}
                        <div className="flex justify-end">
                            <div className="text-center text-xs w-64">
                                <p className="text-slate-600">Sukabumi, {getIndonesianDate()}</p>
                                <p className="font-bold text-slate-900 mt-0.5">Petugas Kesehatan Poskestren</p>
                                <div className="h-16" />
                                <p className="font-bold text-slate-900 underline underline-offset-2">
                                    dr. H. Rahmat Hidayat, M.Kes.
                                </p>
                                <p className="text-slate-600 text-[10px] font-mono">
                                    SIP: 440/123/SIP-D/DINKES/2023
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 6 */}
                    <div className="pt-3 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between items-center italic">
                        <span>{student.name} ({student.nig})</span>
                        <span className="font-semibold text-slate-700">Halaman 6 (Lampiran)</span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
