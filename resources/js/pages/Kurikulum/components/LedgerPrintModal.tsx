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
        const validAvgs = classLedger.students
            .map((s) => s.avg)
            .filter((v) => v > 0);
        return validAvgs.length > 0
            ? Math.round(
                  (validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length) *
                      10,
              ) / 10
            : 0;
    }, [classLedger.students]);

    const classAvgTotal = useMemo(() => {
        const validTotals = classLedger.students
            .map((s) => s.total)
            .filter((v) => v > 0);
        return validTotals.length > 0
            ? Math.round(
                  (validTotals.reduce((a, b) => a + b, 0) /
                      validTotals.length) *
                      10,
              ) / 10
            : 0;
    }, [classLedger.students]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs sm:p-6 print:static print:bg-white print:p-0">
            {/* Control Bar (Hidden on print) */}
            <div className="no-print sticky top-4 z-10 mb-4 flex w-full max-w-[297mm] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                        <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm leading-tight font-bold text-slate-900">
                            Pratinjau Ledger Kelas (A4 Landscape)
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Kelas {selectedKelas} &bull; {selectedTahun} &bull;{' '}
                            {classLedger.students.length} Santri
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
                        <span>Cetak Ledger</span>
                    </button>
                </div>
            </div>

            {/* Lembar Ledger Dokumen (Target Cetak A4 Landscape) */}
            <div
                id="print-area"
                className="min-h-[210mm] w-full max-w-[297mm] rounded-sm bg-white p-6 font-sans text-xs text-slate-900 shadow-2xl sm:p-8 print:w-full print:max-w-none print:p-0 print:shadow-none"
            >
                {/* Header Ledger */}
                <div className="mb-5 text-center">
                    <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                        REKAPITULASI LEDGER NILAI AKADEMIK KELAS
                    </h1>
                    <p className="mt-1 text-xs font-medium text-slate-600">
                        KELAS:{' '}
                        <span className="font-bold text-slate-800">
                            {selectedKelas.toUpperCase()}
                        </span>{' '}
                        &nbsp;•&nbsp; TAHUN AKADEMIK:{' '}
                        <span className="font-bold text-slate-800">
                            {selectedTahun.toUpperCase()}
                        </span>
                    </p>
                    <div className="mt-3 border-b-2 border-slate-800" />
                </div>

                {/* Tabel Matriks Ledger */}
                <table className="mb-6 w-full border-collapse border border-slate-300 text-[11px]">
                    <thead>
                        <tr className="border-b border-slate-300 bg-slate-50 text-center font-semibold text-slate-700">
                            <th className="w-8 border border-slate-300 px-1 py-2">
                                No
                            </th>
                            <th className="w-24 border border-slate-300 px-2 py-2">
                                NIG
                            </th>
                            <th className="min-w-[140px] border border-slate-300 px-3 py-2 text-left">
                                Nama Santri
                            </th>
                            {classLedger.mapels.map((mapel) => (
                                <th
                                    key={mapel}
                                    className="min-w-[70px] border border-slate-300 px-1 py-2"
                                >
                                    {mapel}
                                </th>
                            ))}
                            <th className="w-14 border border-slate-300 bg-slate-100 px-2 py-2">
                                Total
                            </th>
                            <th className="w-14 border border-slate-300 bg-slate-100 px-2 py-2">
                                Rerata
                            </th>
                            <th className="w-12 border border-slate-300 bg-slate-100 px-2 py-2">
                                Predikat
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {classLedger.students.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={classLedger.mapels.length + 6}
                                    className="py-8 text-center text-slate-400"
                                >
                                    Tidak ada data santri pada kelas ini.
                                </td>
                            </tr>
                        ) : (
                            classLedger.students.map((student, idx) => (
                                <tr
                                    key={student.id}
                                    className="border-b border-slate-200 hover:bg-slate-50/50"
                                >
                                    <td className="border border-slate-300 px-1 py-1.5 text-center font-medium text-slate-600">
                                        {idx + 1}
                                    </td>
                                    <td className="border border-slate-300 px-2 py-1.5 text-center font-mono text-[10px] text-slate-600">
                                        {student.nig}
                                    </td>
                                    <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-900">
                                        {student.name}
                                    </td>
                                    {classLedger.mapels.map((mapel) => {
                                        const score = student.scores[mapel];
                                        const na = score?.nilai_akhir ?? 0;
                                        return (
                                            <td
                                                key={mapel}
                                                className="border border-slate-300 px-1 py-1.5 text-center text-slate-700"
                                            >
                                                {na > 0 ? na.toFixed(1) : '-'}
                                            </td>
                                        );
                                    })}
                                    <td className="border border-slate-300 bg-slate-50 px-2 py-1.5 text-center font-bold text-slate-900">
                                        {student.total > 0
                                            ? student.total.toFixed(1)
                                            : '-'}
                                    </td>
                                    <td className="border border-slate-300 bg-slate-50 px-2 py-1.5 text-center font-bold text-blue-900">
                                        {student.avg > 0
                                            ? student.avg.toFixed(1)
                                            : '-'}
                                    </td>
                                    <td className="border border-slate-300 bg-slate-50 px-2 py-1.5 text-center font-bold">
                                        {student.predikat}
                                    </td>
                                </tr>
                            ))
                        )}
                        {/* Rerata Kelas */}
                        <tr className="border-t-2 border-slate-400 bg-slate-100/80 font-bold">
                            <td
                                colSpan={3}
                                className="border border-slate-300 px-3 py-2 text-right text-slate-700"
                            >
                                RATA-RATA KELAS
                            </td>
                            {classLedger.mapels.map((mapel) => {
                                const validScores = classLedger.students
                                    .map(
                                        (s) =>
                                            s.scores[mapel]?.nilai_akhir ?? 0,
                                    )
                                    .filter((v) => v > 0);
                                const mapelAvg =
                                    validScores.length > 0
                                        ? Math.round(
                                              (validScores.reduce(
                                                  (a, b) => a + b,
                                                  0,
                                              ) /
                                                  validScores.length) *
                                                  10,
                                          ) / 10
                                        : 0;
                                return (
                                    <td
                                        key={mapel}
                                        className="border border-slate-300 px-1 py-2 text-center font-extrabold text-slate-900"
                                    >
                                        {mapelAvg > 0
                                            ? mapelAvg.toFixed(1)
                                            : '-'}
                                    </td>
                                );
                            })}
                            <td className="border border-slate-300 bg-slate-100 px-2 py-2 text-center font-extrabold">
                                {classAvgTotal > 0
                                    ? classAvgTotal.toFixed(1)
                                    : '-'}
                            </td>
                            <td className="border border-slate-300 bg-blue-50/50 px-2 py-2 text-center font-extrabold text-blue-950">
                                {classOverallAvg > 0
                                    ? classOverallAvg.toFixed(1)
                                    : '-'}
                            </td>
                            <td className="border border-slate-300 bg-slate-100 px-2 py-2 text-center font-extrabold">
                                {classOverallAvg >= 85
                                    ? 'A'
                                    : classOverallAvg >= 75
                                      ? 'B'
                                      : classOverallAvg >= 65
                                        ? 'C'
                                        : classOverallAvg > 0
                                          ? 'D'
                                          : '-'}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Tanda Tangan Ledger: Wali Kelas */}
                <div className="mt-8 flex justify-end gap-16 text-center text-xs">
                    <div>
                        <p className="mb-0.5 text-slate-600">
                            Wali Kelas {selectedKelas}
                        </p>
                        <p className="font-semibold text-slate-900">
                            LKP Doa Bangsa Cicantayan
                        </p>
                        <div className="h-16" />
                        <p className="min-w-[180px] border-t border-slate-700 pt-1 font-semibold text-slate-900">
                            ({' '}
                            {waliKelas?.name ||
                                '................................'}{' '}
                            )
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                            NIY: {waliKelas?.niy || '-'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
