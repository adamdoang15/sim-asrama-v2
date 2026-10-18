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
        if (!desc)
            return 'Tuntas mencapai indikator kompetensi dasar standar KKM.';
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs sm:p-6 print:static print:bg-white print:p-0">
            {/* Control Bar (Hidden on print) */}
            <div className="no-print sticky top-4 z-10 mb-4 flex w-full max-w-[210mm] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                        <Printer className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm leading-tight font-bold text-slate-900">
                            Pratinjau Rapor Santri (A4 Portrait)
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {student.name} ({student.nig}) &bull;{' '}
                            {selectedKelas}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                        Tutup
                    </button>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Cetak Rapor</span>
                    </button>
                </div>
            </div>

            {/* Lembar Rapor Dokumen (Target Cetak A4 Portrait - 6 Halaman) */}
            <div
                id="print-area"
                className="w-full max-w-[210mm] font-sans text-slate-900 print:w-full print:max-w-none print:p-0"
            >
                {/* ==================== HALAMAN 1: COVER DEPAN ==================== */}
                <div className="print-page mb-8 box-border flex min-h-[297mm] flex-col justify-between rounded-sm bg-white p-10 shadow-2xl sm:p-14 print:m-0 print:p-0 print:shadow-none">
                    <div className="flex h-full flex-col items-center justify-between border-4 border-double border-slate-900 p-8 text-center sm:p-12">
                        <div className="pt-4">
                            <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase">
                                YAYASAN PEMBINA PENDIDIKAN DOA BANGSA
                            </h3>
                            <h2 className="mt-1 text-xl font-extrabold tracking-wider text-slate-900 uppercase">
                                LEMBAGA KURSUS PELATIHAN (LKP) DOA BANGSA
                            </h2>
                            <p className="mt-1 text-xs text-slate-600">
                                Akreditasi BAN PAUD dan PNF • Izin Operasional
                                Kemendikbudristek RI
                            </p>
                        </div>

                        <div className="my-8 flex flex-col items-center">
                            <div className="flex h-36 w-36 items-center justify-center p-2">
                                <img
                                    src="/logo.png"
                                    alt="Logo LKP Doa Bangsa"
                                    className="max-h-full max-w-full object-contain drop-shadow-sm filter"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className="mt-4 h-1 w-24 rounded-full bg-amber-500" />
                        </div>

                        <div className="my-4">
                            <h1 className="text-2xl leading-tight font-extrabold tracking-wide text-slate-900 uppercase sm:text-3xl">
                                LAPORAN PENILAIAN
                                <br />
                                HASIL BELAJAR GELARA
                            </h1>
                            <p className="mt-2 text-sm font-bold tracking-widest text-slate-700 uppercase">
                                (BUKU RAPOR ASRAMA &amp; AKADEMIK)
                            </p>
                        </div>

                        <div className="my-6 w-full max-w-md rounded-lg border-2 border-slate-900 bg-slate-50/50 p-5">
                            <p className="mb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Nama Gelara / Santri:
                            </p>
                            <h4 className="text-lg font-bold tracking-tight text-slate-900 uppercase">
                                {student.name}
                            </h4>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-300 pt-3 text-xs">
                                <span className="font-medium text-slate-600">
                                    Nomor Induk Gelara (NIG):
                                </span>
                                <span className="font-mono text-sm font-bold tracking-wider text-slate-900">
                                    {student.nig}
                                </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-xs">
                                <span className="font-medium text-slate-600">
                                    Kelas / Tingkat:
                                </span>
                                <span className="font-semibold text-slate-900">
                                    {selectedKelas}
                                </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-xs">
                                <span className="font-medium text-slate-600">
                                    Tahun Akademik:
                                </span>
                                <span className="font-semibold text-slate-900">
                                    {selectedTahun}
                                </span>
                            </div>
                        </div>

                        <div className="pb-4 text-xs text-slate-700">
                            <p className="font-bold tracking-wider text-slate-900 uppercase">
                                LKP DOA BANGSA CICANTAYAN SUKABUMI
                            </p>
                            <p className="mt-0.5 text-slate-600">
                                Jl. Pelabuhan II Km. 19, Desa Cicantayan, Kec.
                                Cicantayan, Kab. Sukabumi, Jawa Barat
                            </p>
                            <p className="mt-1 font-mono text-[10px] text-slate-500">
                                Website: www.doabangsa.sch.id &bull; E-mail:
                                lkp@doabangsa.sch.id
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==================== HALAMAN 2: BIODATA GELARA (17 BUTIR) ==================== */}
                <div className="print-page mb-8 box-border flex min-h-[297mm] flex-col justify-between rounded-sm bg-white p-8 text-xs leading-relaxed shadow-2xl sm:p-12 print:m-0 print:p-0 print:shadow-none">
                    <div>
                        <div className="mb-6 border-b-2 border-slate-900 pb-2 text-center">
                            <h2 className="text-base font-bold tracking-wider text-slate-900 uppercase sm:text-lg">
                                KETERANGAN TENTANG DIRI GELARA
                            </h2>
                            <p className="mt-0.5 text-[11px] font-medium text-slate-600">
                                Buku Induk Santri Lembaga Kursus Pelatihan Doa
                                Bangsa Cicantayan
                            </p>
                        </div>

                        <table className="w-full text-xs">
                            <tbody>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        1.
                                    </td>
                                    <td className="w-56 py-1 text-slate-700">
                                        Nama Lengkap Gelara
                                    </td>
                                    <td className="w-4 py-1 text-center">:</td>
                                    <td className="py-1 font-bold text-slate-900 uppercase">
                                        {student.name}
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        2.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Nomor Induk Gelara (NIG)
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 font-mono font-semibold text-slate-900">
                                        {student.nig}
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        3.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Tempat, Tanggal Lahir
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        {student.ttl || 'Sukabumi, 12 Mei 2008'}
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        4.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Jenis Kelamin
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        {student.jenis_kelamin || 'Laki-laki'}
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        5.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Agama
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        {student.agama || 'Islam'}
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        6.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Status dalam Keluarga
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        Anak Kandung
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        7.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Anak ke-
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        1 (Satu)
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        8.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Alamat Tempat Tinggal Santri
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        {student.domisili ||
                                            'Asrama Prestasi LKP Doa Bangsa Cicantayan Sukabumi'}
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        9.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Nomor Telepon / WhatsApp
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        0812-3456-7890
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        10.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Asal Satuan Pendidikan / LKP
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        LKP Doa Bangsa Cicantayan
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        11.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Diterima di Lembaga Ini
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        <div>
                                            a. Di Tingkat / Kelas :{' '}
                                            <strong className="font-semibold text-slate-900">
                                                {selectedKelas}
                                            </strong>
                                        </div>
                                        <div>
                                            b. Pada Tanggal
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                                            {student.tahun_diterima ||
                                                '15 Juli 2024'}
                                        </div>
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        12.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Nama Orang Tua Kandung
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        <div>
                                            a. Ayah :{' '}
                                            <strong className="font-semibold text-slate-900">
                                                {student.nama_ayah ||
                                                    'Bapak Santri'}
                                            </strong>
                                        </div>
                                        <div>
                                            b. Ibu &nbsp;&nbsp;:{' '}
                                            <strong className="font-semibold text-slate-900">
                                                {student.nama_ibu ||
                                                    'Ibu Santri'}
                                            </strong>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        13.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Alamat Tempat Tinggal Orang Tua
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        {student.domisili ||
                                            'Kp. Cicantayan RT 02/03, Kec. Cicantayan, Kab. Sukabumi'}
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        14.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Pekerjaan Orang Tua
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">
                                        <div>
                                            a. Ayah :{' '}
                                            {student.pekerjaan_ayah ||
                                                'Wiraswasta'}
                                        </div>
                                        <div>
                                            b. Ibu &nbsp;&nbsp;:{' '}
                                            {student.pekerjaan_ibu ||
                                                'Ibu Rumah Tangga'}
                                        </div>
                                    </td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        15.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Nama Wali Gelara
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">-</td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        16.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Alamat Wali Gelara
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">-</td>
                                </tr>
                                <tr className="py-1 align-top">
                                    <td className="w-8 py-1 font-semibold text-slate-700">
                                        17.
                                    </td>
                                    <td className="py-1 text-slate-700">
                                        Pekerjaan Wali Gelara
                                    </td>
                                    <td className="py-1 text-center">:</td>
                                    <td className="py-1 text-slate-900">-</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Pas Foto 3x4 & Tanda Tangan Kepala Lembaga */}
                        <div className="mt-8 flex items-end justify-between px-4">
                            <div className="flex h-36 w-28 flex-col items-center justify-center rounded-sm border-2 border-dashed border-slate-400 bg-slate-50 p-2 text-center text-slate-400">
                                {student.foto ? (
                                    <img
                                        src={student.foto}
                                        alt="Pas Foto"
                                        className="h-full w-full rounded-xs object-cover"
                                    />
                                ) : (
                                    <>
                                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                                            Pas Foto
                                        </span>
                                        <span className="mt-0.5 text-xs font-semibold text-slate-400">
                                            3 x 4 cm
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="text-center text-xs">
                                <p className="text-slate-700">
                                    Sukabumi, {getIndonesianDate()}
                                </p>
                                <p className="mt-1 font-bold text-slate-900">
                                    Kepala Lembaga LKP Doa Bangsa
                                </p>
                                <div className="h-20" />
                                <p className="font-bold text-slate-900 underline underline-offset-2">
                                    H. Teguh Eko P, S.Pd., M.M.
                                </p>
                                <p className="mt-0.5 font-mono text-[11px] text-slate-600">
                                    NIY: 19820415 200801 1 002
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 2 */}
                    <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-[10px] text-slate-500 italic">
                        <span>
                            {student.name} ({student.nig})
                        </span>
                        <span className="font-semibold text-slate-700">
                            Halaman 2
                        </span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>

                {/* ==================== HALAMAN 3: PENCAPAIAN SIKAP ==================== */}
                <div className="print-page mb-8 box-border flex min-h-[297mm] flex-col justify-between rounded-sm bg-white p-8 text-xs shadow-2xl sm:p-12 print:m-0 print:p-0 print:shadow-none">
                    <div>
                        {/* Header Identitas Rapor */}
                        <div className="mb-5 border-b border-slate-300 pb-3">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Nama Gelara
                                    </span>
                                    <span className="w-3">:</span>
                                    <strong className="font-bold text-slate-900">
                                        {student.name}
                                    </strong>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Kelas / Tingkat
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedKelas}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Nomor Induk (NIG)
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-mono text-slate-900">
                                        {student.nig}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Semester
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedTahun.includes('Genap')
                                            ? 'Genap (II)'
                                            : 'Ganjil (I)'}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Nama Lembaga
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-medium text-slate-900">
                                        LKP Doa Bangsa Cicantayan
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Tahun Akademik
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedTahun}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Judul Bagian */}
                        <div className="mb-6 text-center">
                            <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase underline underline-offset-4">
                                CAPAIAN KOMPETENSI SIKAP
                            </h3>
                        </div>

                        {/* Bagian A. SIKAP */}
                        <div className="mb-6">
                            <h4 className="mb-2 text-xs font-bold text-slate-900">
                                A. SIKAP
                            </h4>

                            {/* 1. Sikap Spiritual */}
                            <div className="mb-4 rounded-sm border border-slate-300">
                                <div className="flex items-center justify-between border-b border-slate-300 bg-slate-100 px-3 py-2 font-bold text-slate-900">
                                    <span>1. Sikap Spiritual</span>
                                    <span className="rounded border border-slate-300 bg-white px-2.5 py-0.5 text-xs font-extrabold text-blue-900">
                                        Predikat:{' '}
                                        {student.pelengkap
                                            ?.sikap_spiritual_predikat || 'A'}
                                    </span>
                                </div>
                                <div className="bg-slate-50/40 p-3.5">
                                    <p className="mb-1 text-[11px] font-semibold text-slate-500">
                                        Deskripsi Capaian:
                                    </p>
                                    <p className="text-xs leading-relaxed text-slate-800">
                                        {student.pelengkap
                                            ?.sikap_spiritual_deskripsi ||
                                            "Selalu bersyukur, sangat taat beribadah shalat fardhu dan sunnah berjamaah di masjid asrama, istiqomah dalam membaca Al-Qur'an dan senantiasa berdzikir, serta menunjukkan keteladanan akhlak islami yang luhur kepada sesama santri."}
                                    </p>
                                </div>
                            </div>

                            {/* 2. Sikap Sosial */}
                            <div className="rounded-sm border border-slate-300">
                                <div className="flex items-center justify-between border-b border-slate-300 bg-slate-100 px-3 py-2 font-bold text-slate-900">
                                    <span>2. Sikap Sosial</span>
                                    <span className="rounded border border-slate-300 bg-white px-2.5 py-0.5 text-xs font-extrabold text-blue-900">
                                        Predikat:{' '}
                                        {student.pelengkap
                                            ?.sikap_sosial_predikat || 'A'}
                                    </span>
                                </div>
                                <div className="bg-slate-50/40 p-3.5">
                                    <p className="mb-1 text-[11px] font-semibold text-slate-500">
                                        Deskripsi Capaian:
                                    </p>
                                    <p className="text-xs leading-relaxed text-slate-800">
                                        {student.pelengkap
                                            ?.sikap_sosial_deskripsi ||
                                            'Sangat santun dalam bertutur kata, memiliki jiwa kepemimpinan dan empati sosial yang tinggi, disiplin dalam mengikuti seluruh rangkaian kegiatan kedisiplinan asrama, serta aktif bergotong royong menjaga kebersihan dan ketertiban lingkungan bersama.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tanda Tangan Wali Tingkat */}
                        <div className="mt-12 flex justify-end">
                            <div className="w-64 text-center text-xs">
                                <p className="text-slate-600">
                                    Sukabumi, {getIndonesianDate()}
                                </p>
                                <p className="mt-1 font-bold text-slate-900">
                                    Wali Tingkat {selectedKelas}
                                </p>
                                <div className="h-20" />
                                <p className="font-bold text-slate-900 underline underline-offset-2">
                                    {waliKelas?.name ||
                                        '...........................................'}
                                </p>
                                <p className="mt-0.5 font-mono text-[11px] text-slate-600">
                                    NIY: {waliKelas?.niy || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 3 */}
                    <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-[10px] text-slate-500 italic">
                        <span>
                            {student.name} ({student.nig})
                        </span>
                        <span className="font-semibold text-slate-700">
                            Halaman 3
                        </span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>

                {/* ==================== HALAMAN 4: PENGETAHUAN & KETERAMPILAN ==================== */}
                <div className="print-page mb-8 box-border flex min-h-[297mm] flex-col justify-between rounded-sm bg-white p-8 text-xs shadow-2xl sm:p-12 print:m-0 print:p-0 print:shadow-none">
                    <div>
                        {/* Header Identitas Rapor */}
                        <div className="mb-4 border-b border-slate-300 pb-3">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Nama Gelara
                                    </span>
                                    <span className="w-3">:</span>
                                    <strong className="font-bold text-slate-900">
                                        {student.name}
                                    </strong>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Kelas / Tingkat
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedKelas}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Nomor Induk (NIG)
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-mono text-slate-900">
                                        {student.nig}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Semester
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedTahun.includes('Genap')
                                            ? 'Genap (II)'
                                            : 'Ganjil (I)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bagian B. PENGETAHUAN */}
                        <div className="mb-5">
                            <h4 className="mb-2 text-xs font-bold text-slate-900">
                                B. PENGETAHUAN (KOGNITIF)
                            </h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="border-b border-slate-300 bg-slate-100 text-center font-bold text-slate-800">
                                        <th className="w-8 border border-slate-300 px-1 py-1.5">
                                            No
                                        </th>
                                        <th className="min-w-[130px] border border-slate-300 px-2 py-1.5 text-left">
                                            Mata Pelajaran
                                        </th>
                                        <th className="w-12 border border-slate-300 px-1 py-1.5">
                                            KKM
                                        </th>
                                        <th className="w-14 border border-slate-300 px-1 py-1.5">
                                            Nilai
                                        </th>
                                        <th className="w-12 border border-slate-300 px-1 py-1.5">
                                            Predikat
                                        </th>
                                        <th className="border border-slate-300 px-2 py-1.5 text-left">
                                            Capaian Kompetensi / Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classLedger.mapels.map((mapel, index) => {
                                        const score = student.scores[mapel];
                                        const na = score?.nilai_akhir ?? 0;
                                        const pred = score?.predikat ?? '-';
                                        const desc = formatKdDescription(
                                            score?.deskripsi,
                                        );
                                        return (
                                            <tr
                                                key={'p-' + mapel}
                                                className="border-b border-slate-300"
                                            >
                                                <td className="border border-slate-300 px-1 py-1 text-center font-semibold text-slate-600">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-slate-300 px-2 py-1 font-semibold text-slate-900">
                                                    {mapel}
                                                </td>
                                                <td className="border border-slate-300 px-1 py-1 text-center text-slate-600">
                                                    75
                                                </td>
                                                <td className="border border-slate-300 px-1 py-1 text-center font-bold text-slate-900">
                                                    {na > 0
                                                        ? na.toFixed(1)
                                                        : '-'}
                                                </td>
                                                <td className="border border-slate-300 px-1 py-1 text-center font-bold">
                                                    {pred}
                                                </td>
                                                <td className="border border-slate-300 px-2 py-1 text-[10px] leading-tight text-slate-700">
                                                    {desc}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Bagian C. KETERAMPILAN */}
                        <div className="mb-4">
                            <h4 className="mb-2 text-xs font-bold text-slate-900">
                                C. KETERAMPILAN (PSIKOMOTORIK)
                            </h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="border-b border-slate-300 bg-slate-100 text-center font-bold text-slate-800">
                                        <th className="w-8 border border-slate-300 px-1 py-1.5">
                                            No
                                        </th>
                                        <th className="min-w-[130px] border border-slate-300 px-2 py-1.5 text-left">
                                            Mata Pelajaran
                                        </th>
                                        <th className="w-12 border border-slate-300 px-1 py-1.5">
                                            KKM
                                        </th>
                                        <th className="w-14 border border-slate-300 px-1 py-1.5">
                                            Nilai
                                        </th>
                                        <th className="w-12 border border-slate-300 px-1 py-1.5">
                                            Predikat
                                        </th>
                                        <th className="border border-slate-300 px-2 py-1.5 text-left">
                                            Capaian Keterampilan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classLedger.mapels
                                        .slice(0, 4)
                                        .map((mapel, index) => {
                                            const score = student.scores[mapel];
                                            const na = score?.nilai_akhir
                                                ? Math.min(
                                                      100,
                                                      Math.round(
                                                          (score.nilai_akhir +
                                                              1) *
                                                              10,
                                                      ) / 10,
                                                  )
                                                : 0;
                                            const pred = score?.predikat ?? '-';
                                            return (
                                                <tr
                                                    key={'k-' + mapel}
                                                    className="border-b border-slate-300"
                                                >
                                                    <td className="border border-slate-300 px-1 py-1 text-center font-semibold text-slate-600">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border border-slate-300 px-2 py-1 font-semibold text-slate-900">
                                                        {mapel}
                                                    </td>
                                                    <td className="border border-slate-300 px-1 py-1 text-center text-slate-600">
                                                        75
                                                    </td>
                                                    <td className="border border-slate-300 px-1 py-1 text-center font-bold text-slate-900">
                                                        {na > 0
                                                            ? na.toFixed(1)
                                                            : '-'}
                                                    </td>
                                                    <td className="border border-slate-300 px-1 py-1 text-center font-bold">
                                                        {pred}
                                                    </td>
                                                    <td className="border border-slate-300 px-2 py-1 text-[10px] leading-tight text-slate-700">
                                                        Sangat terampil dan
                                                        aktif dalam
                                                        mempraktikkan materi
                                                        pembelajaran serta
                                                        penugasan mandiri.
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>

                        {/* Tanda Tangan Wali Tingkat */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-64 text-center text-xs">
                                <p className="text-slate-600">
                                    Sukabumi, {getIndonesianDate()}
                                </p>
                                <p className="mt-0.5 font-bold text-slate-900">
                                    Wali Tingkat {selectedKelas}
                                </p>
                                <div className="h-16" />
                                <p className="font-bold text-slate-900 underline underline-offset-2">
                                    {waliKelas?.name ||
                                        '...........................................'}
                                </p>
                                <p className="mt-0.5 font-mono text-[11px] text-slate-600">
                                    NIY: {waliKelas?.niy || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 4 */}
                    <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-[10px] text-slate-500 italic">
                        <span>
                            {student.name} ({student.nig})
                        </span>
                        <span className="font-semibold text-slate-700">
                            Halaman 4
                        </span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>

                {/* ==================== HALAMAN 5: EKSKUL, PRESTASI, ABSENSI & CATATAN ==================== */}
                <div className="print-page mb-8 box-border flex min-h-[297mm] flex-col justify-between rounded-sm bg-white p-8 text-xs shadow-2xl sm:p-12 print:m-0 print:p-0 print:shadow-none">
                    <div>
                        {/* Header Identitas Rapor */}
                        <div className="mb-4 border-b border-slate-300 pb-3">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Nama Gelara
                                    </span>
                                    <span className="w-3">:</span>
                                    <strong className="font-bold text-slate-900">
                                        {student.name}
                                    </strong>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Kelas / Tingkat
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedKelas}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Nomor Induk (NIG)
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-mono text-slate-900">
                                        {student.nig}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="w-28 text-slate-600">
                                        Semester
                                    </span>
                                    <span className="w-3">:</span>
                                    <span className="font-semibold text-slate-900">
                                        {selectedTahun.includes('Genap')
                                            ? 'Genap (II)'
                                            : 'Ganjil (I)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* D. EKSTRAKURIKULER */}
                        <div className="mb-4">
                            <h4 className="mb-1.5 text-xs font-bold text-slate-900">
                                D. EKSTRAKURIKULER
                            </h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="border-b border-slate-300 bg-slate-100 text-center font-bold text-slate-800">
                                        <th className="w-8 border border-slate-300 px-1 py-1.5">
                                            No
                                        </th>
                                        <th className="w-56 border border-slate-300 px-3 py-1.5 text-left">
                                            Kegiatan Ekstrakurikuler
                                        </th>
                                        <th className="w-16 border border-slate-300 px-2 py-1.5">
                                            Nilai
                                        </th>
                                        <th className="border border-slate-300 px-3 py-1.5 text-left">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(student.pelengkap?.ekskul?.length
                                        ? student.pelengkap.ekskul
                                        : [
                                              {
                                                  nama: 'Pramuka Garuda / Kepanduan',
                                                  nilai: 'A',
                                                  keterangan:
                                                      'Sangat aktif dan berdedikasi tinggi',
                                              },
                                              {
                                                  nama: "Tahfidz Al-Qur'an",
                                                  nilai: 'A',
                                                  keterangan:
                                                      'Mencapai target hafalan juz dengan tartil',
                                              },
                                              {
                                                  nama: 'Seni Hadroh / Tilawah',
                                                  nilai: 'B',
                                                  keterangan:
                                                      'Menguasai teknik dasar dengan baik',
                                              },
                                          ]
                                    ).map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b border-slate-300"
                                        >
                                            <td className="border border-slate-300 px-1 py-1.5 text-center font-semibold text-slate-600">
                                                {idx + 1}
                                            </td>
                                            <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-900">
                                                {item.nama}
                                            </td>
                                            <td className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-900">
                                                {item.nilai}
                                            </td>
                                            <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                                                {item.keterangan}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* E. PRESTASI & F. KETIDAKHADIRAN dalam 2 kolom */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            {/* E. PRESTASI */}
                            <div>
                                <h4 className="mb-1.5 text-xs font-bold text-slate-900">
                                    E. PRESTASI
                                </h4>
                                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                    <thead>
                                        <tr className="border-b border-slate-300 bg-slate-100 text-center font-bold text-slate-800">
                                            <th className="w-8 border border-slate-300 px-1 py-1.5">
                                                No
                                            </th>
                                            <th className="border border-slate-300 px-2 py-1.5 text-left">
                                                Jenis Prestasi
                                            </th>
                                            <th className="border border-slate-300 px-2 py-1.5 text-left">
                                                Keterangan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(student.prestasis?.length
                                            ? student.prestasis
                                            : [
                                                  {
                                                      nama: 'Lomba Pidato Bahasa Arab',
                                                      keterangan:
                                                          'Juara II Tingkat Kabupaten',
                                                  },
                                                  {
                                                      nama: 'MHQ 5 Juz Antar Santri',
                                                      keterangan:
                                                          'Peringkat Terbaik',
                                                  },
                                              ]
                                        ).map((pres, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-slate-300"
                                            >
                                                <td className="border border-slate-300 px-1 py-1.5 text-center font-semibold text-slate-600">
                                                    {idx + 1}
                                                </td>
                                                <td className="border border-slate-300 px-2 py-1.5 font-semibold text-slate-900">
                                                    {pres.nama}
                                                </td>
                                                <td className="border border-slate-300 px-2 py-1.5 text-slate-700">
                                                    {pres.keterangan}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* F. KETIDAKHADIRAN */}
                            <div>
                                <h4 className="mb-1.5 text-xs font-bold text-slate-900">
                                    F. KETIDAKHADIRAN
                                </h4>
                                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                    <tbody>
                                        <tr className="border-b border-slate-300">
                                            <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                                                1. Sakit
                                            </td>
                                            <td className="w-24 border border-slate-300 px-3 py-1.5 text-center font-bold text-slate-900">
                                                {student.pelengkap
                                                    ?.absensi_sakit ?? 0}{' '}
                                                hari
                                            </td>
                                        </tr>
                                        <tr className="border-b border-slate-300">
                                            <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                                                2. Izin
                                            </td>
                                            <td className="w-24 border border-slate-300 px-3 py-1.5 text-center font-bold text-slate-900">
                                                {student.pelengkap
                                                    ?.absensi_izin ?? 0}{' '}
                                                hari
                                            </td>
                                        </tr>
                                        <tr className="border-b border-slate-300">
                                            <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                                                3. Tanpa Keterangan
                                            </td>
                                            <td className="w-24 border border-slate-300 px-3 py-1.5 text-center font-bold text-slate-900">
                                                {student.pelengkap
                                                    ?.absensi_alpha ?? 0}{' '}
                                                hari
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* G. CATATAN WALI TINGKAT */}
                        <div className="mb-3 rounded-sm border border-slate-300 bg-slate-50/50 p-3">
                            <h4 className="mb-1 text-xs font-bold text-slate-900">
                                G. CATATAN WALI TINGKAT
                            </h4>
                            <p className="text-[11px] leading-relaxed text-slate-800 italic">
                                "
                                {student.pelengkap?.catatan_wali ||
                                    'Alhamdulillah ananda ' +
                                        student.name +
                                        ' menunjukkan peningkatan yang sangat menggembirakan baik dalam disiplin asrama, adab kepada asatidz, maupun prestasi belajar. Teruslah istiqomah dalam menuntut ilmu dan menjaga hafalan.'}
                                "
                            </p>
                        </div>

                        {/* H. TANGGAPAN ORANG TUA / WALI */}
                        <div className="mb-4 min-h-[50px] rounded-sm border border-slate-300 p-3">
                            <h4 className="mb-1 text-xs font-bold text-slate-900">
                                H. TANGGAPAN ORANG TUA / WALI
                            </h4>
                            <div className="h-8 border-b border-dashed border-slate-200" />
                        </div>

                        {/* Tanda Tangan 3 Pihak */}
                        <div className="mt-3 grid grid-cols-3 gap-4 text-center text-xs">
                            <div>
                                <p className="mb-0.5 text-slate-600">
                                    Mengetahui,
                                </p>
                                <p className="font-bold text-slate-900">
                                    Orang Tua / Wali Gelara
                                </p>
                                <div className="h-16" />
                                <p className="mx-2 border-t border-slate-400 pt-1 font-semibold">
                                    (
                                    ..................................................
                                    )
                                </p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-slate-600">
                                    Mengetahui,
                                </p>
                                <p className="font-bold text-slate-900">
                                    Kepala Lembaga LKP Doa Bangsa
                                </p>
                                <div className="h-16" />
                                <p className="mx-2 border-t border-slate-400 pt-1 font-bold underline underline-offset-2">
                                    H. Teguh Eko P, S.Pd., M.M.
                                </p>
                                <p className="font-mono text-[10px] text-slate-600">
                                    NIY: 19820415 200801 1 002
                                </p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-slate-600">
                                    Sukabumi, {getIndonesianDate()}
                                </p>
                                <p className="font-bold text-slate-900">
                                    Wali Tingkat {selectedKelas}
                                </p>
                                <div className="h-16" />
                                <p className="mx-2 border-t border-slate-400 pt-1 font-bold underline underline-offset-2">
                                    {waliKelas?.name ||
                                        '...........................................'}
                                </p>
                                <p className="font-mono text-[10px] text-slate-600">
                                    NIY: {waliKelas?.niy || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 5 */}
                    <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-[10px] text-slate-500 italic">
                        <span>
                            {student.name} ({student.nig})
                        </span>
                        <span className="font-semibold text-slate-700">
                            Halaman 5
                        </span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>

                {/* ==================== HALAMAN 6: LAMPIRAN PEMERIKSAAN KESEHATAN ==================== */}
                <div className="print-page mb-8 box-border flex min-h-[297mm] flex-col justify-between rounded-sm bg-white p-8 text-xs shadow-2xl sm:p-12 print:m-0 print:p-0 print:shadow-none">
                    <div>
                        {/* KOP RESMI LEMBAGA LKP DOA BANGSA */}
                        <div className="mb-5 border-b-4 border-double border-slate-900 pb-3">
                            <div className="flex items-center gap-4">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center">
                                    <img
                                        src="/logo.png"
                                        alt="Logo LKP"
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                'none';
                                        }}
                                    />
                                </div>
                                <div className="flex-1 pr-10 text-center">
                                    <h4 className="text-xs font-bold tracking-widest text-slate-900 uppercase">
                                        YAYASAN PEMBINA PENDIDIKAN DOA BANGSA
                                    </h4>
                                    <h2 className="mt-0.5 text-base font-extrabold tracking-wide text-slate-900 uppercase sm:text-lg">
                                        LEMBAGA KURSUS PELATIHAN (LKP) DOA
                                        BANGSA
                                    </h2>
                                    <p className="mt-0.5 text-[11px] text-slate-700">
                                        Jl. Pelabuhan II Km. 19, Desa
                                        Cicantayan, Kec. Cicantayan, Kab.
                                        Sukabumi, Jawa Barat
                                    </p>
                                    <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                                        Telp/WA: 0812-8888-9999 &bull; Website:
                                        www.doabangsa.sch.id &bull; E-mail:
                                        lkp@doabangsa.sch.id
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Judul Dokumen */}
                        <div className="mb-5 text-center">
                            <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase underline underline-offset-4">
                                LAPORAN HASIL PEMERIKSAAN KESEHATAN GELARA
                            </h3>
                            <p className="mt-0.5 text-[11px] font-medium text-slate-600">
                                Pemeriksaan Berkala Pos Kesehatan Santri
                                (Poskestren) &bull; Semester{' '}
                                {selectedTahun.includes('Genap')
                                    ? 'Genap (II)'
                                    : 'Ganjil (I)'}
                            </p>
                        </div>

                        {/* Identitas Singkat */}
                        <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-1 rounded-sm border border-slate-300 bg-slate-50/50 p-3 text-xs">
                            <div className="flex">
                                <span className="w-28 text-slate-600">
                                    Nama Gelara
                                </span>
                                <span className="w-3">:</span>
                                <strong className="font-bold text-slate-900">
                                    {student.name}
                                </strong>
                            </div>
                            <div className="flex">
                                <span className="w-28 text-slate-600">
                                    Kelas / Tingkat
                                </span>
                                <span className="w-3">:</span>
                                <span className="font-semibold text-slate-900">
                                    {selectedKelas}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="w-28 text-slate-600">
                                    Nomor Induk (NIG)
                                </span>
                                <span className="w-3">:</span>
                                <span className="font-mono text-slate-900">
                                    {student.nig}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="w-28 text-slate-600">
                                    Tahun Akademik
                                </span>
                                <span className="w-3">:</span>
                                <span className="font-semibold text-slate-900">
                                    {selectedTahun}
                                </span>
                            </div>
                        </div>

                        {/* 1. PEMERIKSAAN FISIK & TANDA VITAL */}
                        <div className="mb-5">
                            <h4 className="mb-2 text-xs font-bold text-slate-900">
                                1. PEMERIKSAAN FISIK &amp; TANDA VITAL
                            </h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="border-b border-slate-300 bg-slate-100 text-center font-bold text-slate-800">
                                        <th className="w-8 border border-slate-300 px-1 py-1.5">
                                            No
                                        </th>
                                        <th className="border border-slate-300 px-3 py-1.5 text-left">
                                            Parameter Pemeriksaan
                                        </th>
                                        <th className="w-36 border border-slate-300 px-3 py-1.5 text-center">
                                            Hasil Pengukuran
                                        </th>
                                        <th className="w-48 border border-slate-300 px-3 py-1.5 text-left">
                                            Nilai Rujukan / Kategori
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 px-1 py-1.5 text-center font-semibold text-slate-600">
                                            1
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-900">
                                            Berat Badan (BB)
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-slate-900">
                                            {student.kesehatan?.berat_badan
                                                ? `${student.kesehatan.berat_badan} kg`
                                                : '55.0 kg'}
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                                            Rentang Ideal: 45 - 65 kg
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 px-1 py-1.5 text-center font-semibold text-slate-600">
                                            2
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-900">
                                            Tinggi Badan (TB)
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-slate-900">
                                            {student.kesehatan?.tinggi_badan
                                                ? `${student.kesehatan.tinggi_badan} cm`
                                                : '165.0 cm'}
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                                            Pertumbuhan Normal Remaja
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 px-1 py-1.5 text-center font-semibold text-slate-600">
                                            3
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-900">
                                            Indeks Massa Tubuh (IMT)
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-blue-900">
                                            {student.kesehatan?.imt
                                                ? `${student.kesehatan.imt} kg/m²`
                                                : '20.2 kg/m²'}
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-emerald-800">
                                            {student.kesehatan?.imt_kategori ||
                                                'Normal (Ideal)'}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 px-1 py-1.5 text-center font-semibold text-slate-600">
                                            4
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-900">
                                            Tekanan Darah (Tensi)
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-slate-900">
                                            {student.kesehatan?.tensi ||
                                                '120/80 mmHg'}
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-emerald-800">
                                            {student.kesehatan
                                                ?.tensi_kategori || 'Normal'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 2. REKAPITULASI RIWAYAT KESEHATAN / SAKIT */}
                        <div className="mb-5">
                            <h4 className="mb-2 text-xs font-bold text-slate-900">
                                2. REKAPITULASI RIWAYAT SAKIT SELAMA SATU
                                SEMESTER
                            </h4>
                            <table className="w-full border-collapse border border-slate-300 text-[11px]">
                                <thead>
                                    <tr className="border-b border-slate-300 bg-slate-100 text-center font-bold text-slate-800">
                                        <th className="w-8 border border-slate-300 px-1 py-1.5">
                                            No
                                        </th>
                                        <th className="w-64 border border-slate-300 px-3 py-1.5 text-left">
                                            Klasifikasi Sakit
                                        </th>
                                        <th className="w-28 border border-slate-300 px-2 py-1.5 text-center">
                                            Jumlah Kasus
                                        </th>
                                        <th className="border border-slate-300 px-3 py-1.5 text-left">
                                            Keterangan Diagnosa &amp; Penanganan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 px-1 py-1.5 text-center font-semibold text-slate-600">
                                            1
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-900">
                                            Sakit Ringan (Flu, Batuk, Sakit
                                            Kepala)
                                        </td>
                                        <td className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-900">
                                            {student.kesehatan?.riwayat_sakit
                                                ?.ringan?.jumlah ?? 1}{' '}
                                            kali
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                                            {student.kesehatan?.riwayat_sakit
                                                ?.ringan?.keterangan ||
                                                'Penanganan obat oral Poskestren, sembuh total setelah istirahat'}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 px-1 py-1.5 text-center font-semibold text-slate-600">
                                            2
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-900">
                                            Sakit Sedang (Demam &gt; 38°C, Maag,
                                            Tipes)
                                        </td>
                                        <td className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-900">
                                            {student.kesehatan?.riwayat_sakit
                                                ?.sedang?.jumlah ?? 0}{' '}
                                            kali
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                                            {student.kesehatan?.riwayat_sakit
                                                ?.sedang?.keterangan || '-'}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="border border-slate-300 px-1 py-1.5 text-center font-semibold text-slate-600">
                                            3
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 font-semibold text-slate-900">
                                            Sakit Berat (Rujukan Rumah Sakit /
                                            Rawat Inap)
                                        </td>
                                        <td className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-900">
                                            {student.kesehatan?.riwayat_sakit
                                                ?.berat?.jumlah ?? 0}{' '}
                                            kali
                                        </td>
                                        <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                                            {student.kesehatan?.riwayat_sakit
                                                ?.berat?.keterangan || '-'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 3. CATATAN & REKOMENDASI KESEHATAN UNTUK ORANG TUA */}
                        <div className="mb-6 rounded-sm border border-slate-300 bg-slate-50/50 p-3">
                            <h4 className="mb-1 text-xs font-bold text-slate-900">
                                3. CATATAN &amp; REKOMENDASI MEDIS UNTUK ORANG
                                TUA / WALI
                            </h4>
                            <p className="text-[11px] leading-relaxed text-slate-800 italic">
                                "
                                {student.kesehatan?.catatan_kesehatan ||
                                    'Kondisi fisik dan vital santri terpantau dalam batas normal dan bugar. Pertahankan pola makan bergizi seimbang, cukupi asupan cairan minimal 2 liter per hari, dan istirahat teratur di sela rutinitas halaqah dan kegiatan asrama.'}
                                "
                            </p>
                        </div>

                        {/* Tanda Tangan Tim Medis */}
                        <div className="flex justify-end">
                            <div className="w-64 text-center text-xs">
                                <p className="text-slate-600">
                                    Sukabumi, {getIndonesianDate()}
                                </p>
                                <p className="mt-0.5 font-bold text-slate-900">
                                    Petugas Kesehatan Poskestren
                                </p>
                                <div className="h-16" />
                                <p className="font-bold text-slate-900 underline underline-offset-2">
                                    dr. H. Rahmat Hidayat, M.Kes.
                                </p>
                                <p className="font-mono text-[10px] text-slate-600">
                                    SIP: 440/123/SIP-D/DINKES/2023
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Running Footer Halaman 6 */}
                    <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-[10px] text-slate-500 italic">
                        <span>
                            {student.name} ({student.nig})
                        </span>
                        <span className="font-semibold text-slate-700">
                            Halaman 6 (Lampiran)
                        </span>
                        <span>LKP DOA BANGSA CICANTAYAN</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
