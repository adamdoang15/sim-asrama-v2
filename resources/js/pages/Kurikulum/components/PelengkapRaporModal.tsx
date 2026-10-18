import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    FileText,
    Award,
    ClipboardList,
    Users,
    Plus,
    Trash2,
    X,
    Loader2,
    CheckCircle2,
} from 'lucide-react';
import { LedgerStudent, PelengkapData } from '../types';

interface PelengkapRaporModalProps {
    student: LedgerStudent | null;
    selectedKelas: string;
    selectedTahun: string;
    onClose: () => void;
}

export default function PelengkapRaporModal({
    student,
    selectedKelas,
    selectedTahun,
    onClose,
}: PelengkapRaporModalProps) {
    const [pelengkapForm, setPelengkapForm] = useState<PelengkapData>({
        sikap_spiritual_predikat: 'A',
        sikap_spiritual_deskripsi: '',
        sikap_sosial_predikat: 'A',
        sikap_sosial_deskripsi: '',
        ekskul: [
            {
                nama: 'Pramuka Garuda / Kepanduan',
                nilai: 'A',
                keterangan: 'Sangat aktif dan berdedikasi tinggi',
            },
            {
                nama: "Tahfidz Al-Qur'an",
                nilai: 'A',
                keterangan: 'Mencapai target hafalan juz dengan tartil',
            },
        ],
        absensi_sakit: 0,
        absensi_izin: 0,
        absensi_alpha: 0,
        catatan_wali: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (student) {
            setPelengkapForm({
                sikap_spiritual_predikat:
                    student.pelengkap?.sikap_spiritual_predikat || 'A',
                sikap_spiritual_deskripsi:
                    student.pelengkap?.sikap_spiritual_deskripsi || '',
                sikap_sosial_predikat:
                    student.pelengkap?.sikap_sosial_predikat || 'A',
                sikap_sosial_deskripsi:
                    student.pelengkap?.sikap_sosial_deskripsi || '',
                ekskul: student.pelengkap?.ekskul?.length
                    ? student.pelengkap.ekskul
                    : [
                          {
                              nama: 'Pramuka Garuda / Kepanduan',
                              nilai: 'A',
                              keterangan: 'Sangat aktif dan berdedikasi tinggi',
                          },
                          {
                              nama: "Tahfidz Al-Qur'an",
                              nilai: 'A',
                              keterangan:
                                  'Mencapai target hafalan juz dengan tartil',
                          },
                      ],
                absensi_sakit: student.pelengkap?.absensi_sakit ?? 0,
                absensi_izin: student.pelengkap?.absensi_izin ?? 0,
                absensi_alpha: student.pelengkap?.absensi_alpha ?? 0,
                catatan_wali: student.pelengkap?.catatan_wali || '',
            });
        }
    }, [student]);

    if (!student) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post(
            '/kurikulum/nilai-akademik/pelengkap',
            {
                gelara_id: student.id,
                tahun_akademik: selectedTahun,
                kelas: selectedKelas,
                ...pelengkapForm,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    onClose();
                },
                onError: () => setIsSaving(false),
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs sm:p-6">
            <div className="animate-in fade-in zoom-in w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl duration-200">
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                                Input Pelengkap Rapor
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                                {student.name} ({student.nig}) &bull; Kelas{' '}
                                {selectedKelas}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    className="max-h-[75vh] space-y-6 overflow-y-auto p-5 sm:p-6"
                >
                    {/* 1. Capaian Sikap */}
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase">
                            <Award className="h-4 w-4 text-indigo-600" />
                            Penilaian Sikap Spiritual &amp; Sosial
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Spiritual */}
                            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/40 p-3.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-800">
                                        Sikap Spiritual
                                    </label>
                                    <select
                                        value={
                                            pelengkapForm.sikap_spiritual_predikat
                                        }
                                        onChange={(e) =>
                                            setPelengkapForm({
                                                ...pelengkapForm,
                                                sikap_spiritual_predikat:
                                                    e.target.value,
                                            })
                                        }
                                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold"
                                    >
                                        <option value="A">
                                            A (Sangat Baik)
                                        </option>
                                        <option value="B">B (Baik)</option>
                                        <option value="C">C (Cukup)</option>
                                        <option value="D">D (Kurang)</option>
                                    </select>
                                </div>
                                <textarea
                                    rows={3}
                                    value={
                                        pelengkapForm.sikap_spiritual_deskripsi
                                    }
                                    onChange={(e) =>
                                        setPelengkapForm({
                                            ...pelengkapForm,
                                            sikap_spiritual_deskripsi:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Deskripsi sikap spiritual (misal: rajin beribadah, istiqomah tadarus)..."
                                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Sosial */}
                            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/40 p-3.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-800">
                                        Sikap Sosial
                                    </label>
                                    <select
                                        value={
                                            pelengkapForm.sikap_sosial_predikat
                                        }
                                        onChange={(e) =>
                                            setPelengkapForm({
                                                ...pelengkapForm,
                                                sikap_sosial_predikat:
                                                    e.target.value,
                                            })
                                        }
                                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold"
                                    >
                                        <option value="A">
                                            A (Sangat Baik)
                                        </option>
                                        <option value="B">B (Baik)</option>
                                        <option value="C">C (Cukup)</option>
                                        <option value="D">D (Kurang)</option>
                                    </select>
                                </div>
                                <textarea
                                    rows={3}
                                    value={pelengkapForm.sikap_sosial_deskripsi}
                                    onChange={(e) =>
                                        setPelengkapForm({
                                            ...pelengkapForm,
                                            sikap_sosial_deskripsi:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Deskripsi sikap sosial (misal: santun, gotong royong, disiplin)..."
                                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Ekstrakurikuler */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase">
                                <ClipboardList className="h-4 w-4 text-indigo-600" />
                                Kegiatan Ekstrakurikuler
                            </h4>
                            <button
                                type="button"
                                onClick={() => {
                                    setPelengkapForm({
                                        ...pelengkapForm,
                                        ekskul: [
                                            ...pelengkapForm.ekskul,
                                            {
                                                nama: '',
                                                nilai: 'A',
                                                keterangan: '',
                                            },
                                        ],
                                    });
                                }}
                                className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                <Plus className="h-3.5 w-3.5" /> Tambah Kegiatan
                            </button>
                        </div>

                        <div className="space-y-2">
                            {pelengkapForm.ekskul.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="text"
                                        placeholder="Nama Kegiatan (misal: Pramuka, Tahfidz)"
                                        value={item.nama}
                                        onChange={(e) => {
                                            const updated = [
                                                ...pelengkapForm.ekskul,
                                            ];
                                            updated[idx].nama = e.target.value;
                                            setPelengkapForm({
                                                ...pelengkapForm,
                                                ekskul: updated,
                                            });
                                        }}
                                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs"
                                    />
                                    <select
                                        value={item.nilai}
                                        onChange={(e) => {
                                            const updated = [
                                                ...pelengkapForm.ekskul,
                                            ];
                                            updated[idx].nilai = e.target.value;
                                            setPelengkapForm({
                                                ...pelengkapForm,
                                                ekskul: updated,
                                            });
                                        }}
                                        className="w-20 rounded-lg border border-slate-300 px-2 py-2 text-xs"
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Keterangan (misal: Sangat Aktif)"
                                        value={item.keterangan}
                                        onChange={(e) => {
                                            const updated = [
                                                ...pelengkapForm.ekskul,
                                            ];
                                            updated[idx].keterangan =
                                                e.target.value;
                                            setPelengkapForm({
                                                ...pelengkapForm,
                                                ekskul: updated,
                                            });
                                        }}
                                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs"
                                    />
                                    {pelengkapForm.ekskul.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated =
                                                    pelengkapForm.ekskul.filter(
                                                        (_, i) => i !== idx,
                                                    );
                                                setPelengkapForm({
                                                    ...pelengkapForm,
                                                    ekskul: updated,
                                                });
                                            }}
                                            className="cursor-pointer rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Ketidakhadiran */}
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700 uppercase">
                            <Users className="h-4 w-4 text-indigo-600" />
                            Rekapitulasi Ketidakhadiran (Hari)
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-3">
                                <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                                    Sakit
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={pelengkapForm.absensi_sakit}
                                    onChange={(e) =>
                                        setPelengkapForm({
                                            ...pelengkapForm,
                                            absensi_sakit: Number(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                                />
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-3">
                                <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                                    Izin
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={pelengkapForm.absensi_izin}
                                    onChange={(e) =>
                                        setPelengkapForm({
                                            ...pelengkapForm,
                                            absensi_izin: Number(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                                />
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-3">
                                <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                                    Tanpa Keterangan
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={pelengkapForm.absensi_alpha}
                                    onChange={(e) =>
                                        setPelengkapForm({
                                            ...pelengkapForm,
                                            absensi_alpha: Number(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. Catatan Wali Kelas */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                            Catatan Evaluasi Wali Tingkat
                        </h4>
                        <textarea
                            rows={3}
                            value={pelengkapForm.catatan_wali}
                            onChange={(e) =>
                                setPelengkapForm({
                                    ...pelengkapForm,
                                    catatan_wali: e.target.value,
                                })
                            }
                            placeholder="Catatan motivasi, evaluasi, dan pesan untuk perkembangan ananda..."
                            className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Footer Modal Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Simpan Data Pelengkap</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
