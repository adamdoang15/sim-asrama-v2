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
            { nama: 'Pramuka Garuda / Kepanduan', nilai: 'A', keterangan: 'Sangat aktif dan berdedikasi tinggi' },
            { nama: 'Tahfidz Al-Qur\'an', nilai: 'A', keterangan: 'Mencapai target hafalan juz dengan tartil' },
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
                sikap_spiritual_predikat: student.pelengkap?.sikap_spiritual_predikat || 'A',
                sikap_spiritual_deskripsi: student.pelengkap?.sikap_spiritual_deskripsi || '',
                sikap_sosial_predikat: student.pelengkap?.sikap_sosial_predikat || 'A',
                sikap_sosial_deskripsi: student.pelengkap?.sikap_sosial_deskripsi || '',
                ekskul: student.pelengkap?.ekskul?.length ? student.pelengkap.ekskul : [
                    { nama: 'Pramuka Garuda / Kepanduan', nilai: 'A', keterangan: 'Sangat aktif dan berdedikasi tinggi' },
                    { nama: 'Tahfidz Al-Qur\'an', nilai: 'A', keterangan: 'Mencapai target hafalan juz dengan tartil' },
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
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header Modal */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                Input Pelengkap Rapor
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {student.name} ({student.nig}) &bull; Kelas {selectedKelas}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    {/* 1. Capaian Sikap */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <Award className="w-4 h-4 text-indigo-600" />
                            Penilaian Sikap Spiritual &amp; Sosial
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Spiritual */}
                            <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/40 space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-800">Sikap Spiritual</label>
                                    <select
                                        value={pelengkapForm.sikap_spiritual_predikat}
                                        onChange={(e) =>
                                            setPelengkapForm({
                                                ...pelengkapForm,
                                                sikap_spiritual_predikat: e.target.value,
                                            })
                                        }
                                        className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                                    >
                                        <option value="A">A (Sangat Baik)</option>
                                        <option value="B">B (Baik)</option>
                                        <option value="C">C (Cukup)</option>
                                        <option value="D">D (Kurang)</option>
                                    </select>
                                </div>
                                <textarea
                                    rows={3}
                                    value={pelengkapForm.sikap_spiritual_deskripsi}
                                    onChange={(e) =>
                                        setPelengkapForm({
                                            ...pelengkapForm,
                                            sikap_spiritual_deskripsi: e.target.value,
                                        })
                                    }
                                    placeholder="Deskripsi sikap spiritual (misal: rajin beribadah, istiqomah tadarus)..."
                                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Sosial */}
                            <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/40 space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-800">Sikap Sosial</label>
                                    <select
                                        value={pelengkapForm.sikap_sosial_predikat}
                                        onChange={(e) =>
                                            setPelengkapForm({
                                                ...pelengkapForm,
                                                sikap_sosial_predikat: e.target.value,
                                            })
                                        }
                                        className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                                    >
                                        <option value="A">A (Sangat Baik)</option>
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
                                            sikap_sosial_deskripsi: e.target.value,
                                        })
                                    }
                                    placeholder="Deskripsi sikap sosial (misal: santun, gotong royong, disiplin)..."
                                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Ekstrakurikuler */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-indigo-600" />
                                Kegiatan Ekstrakurikuler
                            </h4>
                            <button
                                type="button"
                                onClick={() => {
                                    setPelengkapForm({
                                        ...pelengkapForm,
                                        ekskul: [...pelengkapForm.ekskul, { nama: '', nilai: 'A', keterangan: '' }],
                                    });
                                }}
                                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah Kegiatan
                            </button>
                        </div>

                        <div className="space-y-2">
                            {pelengkapForm.ekskul.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nama Kegiatan (misal: Pramuka, Tahfidz)"
                                        value={item.nama}
                                        onChange={(e) => {
                                            const updated = [...pelengkapForm.ekskul];
                                            updated[idx].nama = e.target.value;
                                            setPelengkapForm({ ...pelengkapForm, ekskul: updated });
                                        }}
                                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300"
                                    />
                                    <select
                                        value={item.nilai}
                                        onChange={(e) => {
                                            const updated = [...pelengkapForm.ekskul];
                                            updated[idx].nilai = e.target.value;
                                            setPelengkapForm({ ...pelengkapForm, ekskul: updated });
                                        }}
                                        className="w-20 text-xs px-2 py-2 rounded-lg border border-slate-300"
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
                                            const updated = [...pelengkapForm.ekskul];
                                            updated[idx].keterangan = e.target.value;
                                            setPelengkapForm({ ...pelengkapForm, ekskul: updated });
                                        }}
                                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300"
                                    />
                                    {pelengkapForm.ekskul.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = pelengkapForm.ekskul.filter((_, i) => i !== idx);
                                                setPelengkapForm({ ...pelengkapForm, ekskul: updated });
                                            }}
                                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Ketidakhadiran */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600" />
                            Rekapitulasi Ketidakhadiran (Hari)
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/40">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sakit</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={pelengkapForm.absensi_sakit}
                                    onChange={(e) =>
                                        setPelengkapForm({
                                            ...pelengkapForm,
                                            absensi_sakit: Number(e.target.value),
                                        })
                                    }
                                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 font-bold"
                                />
                            </div>
                            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/40">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Izin</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={pelengkapForm.absensi_izin}
                                    onChange={(e) =>
                                        setPelengkapForm({
                                            ...pelengkapForm,
                                            absensi_izin: Number(e.target.value),
                                        })
                                    }
                                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 font-bold"
                                />
                            </div>
                            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/40">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tanpa Keterangan</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={pelengkapForm.absensi_alpha}
                                    onChange={(e) =>
                                        setPelengkapForm({
                                            ...pelengkapForm,
                                            absensi_alpha: Number(e.target.value),
                                        })
                                    }
                                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. Catatan Wali Kelas */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
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
                            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Footer Modal Buttons */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
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
