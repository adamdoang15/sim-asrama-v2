import React, { useMemo } from 'react';
import { FileSpreadsheet, Printer } from 'lucide-react';
import { ClassLedger } from '../types';

interface LedgerPrintModalProps {
    isOpen: boolean;
    classLedger: ClassLedger;
    selectedKelas: string;
    selectedTahun: string;
    waliKelas?: { name: string; niy: string | null } | null;
    onClose: () => void;
}

export default function LedgerPrintModal({
    isOpen,
    classLedger,
    selectedKelas,
    selectedTahun,
    waliKelas,
    onClose,
}: LedgerPrintModalProps) {
    if (!isOpen) return null;

    const classOverallAvg = useMemo(() => {
        const validAvgs = classLedger.students.map((s) => s.avg).filter((v) => v > 0);
        return validAvgs.length > 0
            ? Math.round((validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length) * 10) / 10
            : 0;
    }, [classLedger.students]);

    const classAvgTotal = useMemo(() => {
        const validTotals = classLedger.students.map((s) => s.total).filter((v) => v > 0);
        return validTotals.length > 0
            ? Math.round((validTotals.reduce((a, b) => a + b, 0) / validTotals.length) * 10) / 10
            : 0;
    }, [classLedger.students]);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start print:p-0 print:bg-white print:static">
            {/* Control Bar (Hidden on print) */}
            <div className="no-print w-full max-w-[297mm] mb-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-4 sticky top-4 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            Pratinjau Ledger Kelas (A4 Landscape)
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Kelas {selectedKelas} &bull; {selectedTahun} &bull; {classLedger.students.length} Santri
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
                        <span>Cetak Ledger</span>
                    </button>
                </div>
            </div>

            {/* Lembar Ledger Dokumen (Target Cetak A4 Landscape) */}
            <div
                id="print-area"
                className="w-full max-w-[297mm] min-h-[210mm] bg-white text-slate-900 p-6 sm:p-8 shadow-2xl rounded-sm print:shadow-none print:p-0 print:max-w-none print:w-full text-xs font-sans"
            >
                {/* Header Ledger */}
                <div className="text-center mb-5">
                    <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                        REKAPITULASI LEDGER NILAI AKADEMIK KELAS
                    </h1>
                    <p className="text-xs font-medium text-slate-600 mt-1">
                        KELAS: <span className="font-bold text-slate-800">{selectedKelas.toUpperCase()}</span> &nbsp;•&nbsp; TAHUN AKADEMIK: <span className="font-bold text-slate-800">{selectedTahun.toUpperCase()}</span>
                    </p>
                    <div className="mt-3 border-b-2 border-slate-800" />
                </div>

                {/* Tabel Matriks Ledger */}
                <table className="w-full border-collapse border border-slate-300 text-[11px] mb-6">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-300 text-center font-semibold text-slate-700">
                            <th className="border border-slate-300 py-2 px-1 w-8">No</th>
                            <th className="border border-slate-300 py-2 px-2 w-24">NIG</th>
                            <th className="border border-slate-300 py-2 px-3 text-left min-w-[140px]">Nama Santri</th>
                            {classLedger.mapels.map((mapel) => (
                                <th key={mapel} className="border border-slate-300 py-2 px-1 min-w-[70px]">
                                    {mapel}
                                </th>
                            ))}
                            <th className="border border-slate-300 py-2 px-2 w-14 bg-slate-100">Total</th>
                            <th className="border border-slate-300 py-2 px-2 w-14 bg-slate-100">Rerata</th>
                            <th className="border border-slate-300 py-2 px-2 w-12 bg-slate-100">Predikat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classLedger.students.length === 0 ? (
                            <tr>
                                <td colSpan={classLedger.mapels.length + 6} className="py-8 text-center text-slate-400">
                                    Tidak ada data santri pada kelas ini.
                                </td>
                            </tr>
                        ) : (
                            classLedger.students.map((student, idx) => (
                                <tr key={student.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                                    <td className="border border-slate-300 py-1.5 px-1 text-center font-medium text-slate-600">{idx + 1}</td>
                                    <td className="border border-slate-300 py-1.5 px-2 text-center text-slate-600 font-mono text-[10px]">{student.nig}</td>
                                    <td className="border border-slate-300 py-1.5 px-3 font-medium text-slate-900">{student.name}</td>
                                    {classLedger.mapels.map((mapel) => {
                                        const score = student.scores[mapel];
                                        const na = score?.nilai_akhir ?? 0;
                                        return (
                                            <td key={mapel} className="border border-slate-300 py-1.5 px-1 text-center text-slate-700">
                                                {na > 0 ? na.toFixed(1) : '-'}
                                            </td>
                                        );
                                    })}
                                    <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-slate-900 bg-slate-50">
                                        {student.total > 0 ? student.total.toFixed(1) : '-'}
                                    </td>
                                    <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-blue-900 bg-slate-50">
                                        {student.avg > 0 ? student.avg.toFixed(1) : '-'}
                                    </td>
                                    <td className="border border-slate-300 py-1.5 px-2 text-center font-bold bg-slate-50">
                                        {student.predikat}
                                    </td>
                                </tr>
                            ))
                        )}
                        {/* Rerata Kelas */}
                        <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-400">
                            <td colSpan={3} className="border border-slate-300 py-2 px-3 text-right text-slate-700">
                                RATA-RATA KELAS
                            </td>
                            {classLedger.mapels.map((mapel) => {
                                const validScores = classLedger.students
                                    .map((s) => s.scores[mapel]?.nilai_akhir ?? 0)
                                    .filter((v) => v > 0);
                                const mapelAvg =
                                    validScores.length > 0
                                        ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10
                                        : 0;
                                return (
                                    <td key={mapel} className="border border-slate-300 py-2 px-1 text-center font-extrabold text-slate-900">
                                        {mapelAvg > 0 ? mapelAvg.toFixed(1) : '-'}
                                    </td>
                                );
                            })}
                            <td className="border border-slate-300 py-2 px-2 text-center font-extrabold bg-slate-100">
                                {classAvgTotal > 0 ? classAvgTotal.toFixed(1) : '-'}
                            </td>
                            <td className="border border-slate-300 py-2 px-2 text-center font-extrabold text-blue-950 bg-blue-50/50">
                                {classOverallAvg > 0 ? classOverallAvg.toFixed(1) : '-'}
                            </td>
                            <td className="border border-slate-300 py-2 px-2 text-center font-extrabold bg-slate-100">
                                {classOverallAvg >= 85 ? 'A' : classOverallAvg >= 75 ? 'B' : classOverallAvg >= 65 ? 'C' : classOverallAvg > 0 ? 'D' : '-'}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Tanda Tangan Ledger: Wali Kelas */}
                <div className="mt-8 flex justify-end gap-16 text-center text-xs">
                    <div>
                        <p className="text-slate-600 mb-0.5">Wali Kelas {selectedKelas}</p>
                        <p className="font-semibold text-slate-900">LKP Doa Bangsa Cicantayan</p>
                        <div className="h-16" />
                        <p className="border-t border-slate-700 pt-1 font-semibold min-w-[180px] text-slate-900">
                            ( {waliKelas?.name || '................................'} )
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5 font-medium">
                            NIY: {waliKelas?.niy || '-'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
