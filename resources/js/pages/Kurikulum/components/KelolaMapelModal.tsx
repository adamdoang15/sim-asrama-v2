import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { X, Trash2 } from 'lucide-react';

interface KelolaMapelModalProps {
    isOpen: boolean;
    selectedKelas: string;
    initialMapels: string[];
    onClose: () => void;
}

export default function KelolaMapelModal({
    isOpen,
    selectedKelas,
    initialMapels,
    onClose,
}: KelolaMapelModalProps) {
    const [classMapels, setClassMapels] = useState<string[]>(initialMapels);
    const [newMapelInput, setNewMapelInput] = useState('');

    useEffect(() => {
        setClassMapels(initialMapels);
    }, [initialMapels, isOpen]);

    if (!isOpen) return null;

    const handleAddMapel = () => {
        const trimmed = newMapelInput.trim();
        if (trimmed && !classMapels.includes(trimmed)) {
            setClassMapels([...classMapels, trimmed]);
            setNewMapelInput('');
        }
    };

    const handleSave = () => {
        if (classMapels.length === 0) return;
        router.post(
            '/kurikulum/nilai-akademik/mapel',
            {
                kelas: selectedKelas,
                mapels: classMapels,
            },
            {
                preserveScroll: true,
                onSuccess: () => onClose(),
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Kelola Mata Pelajaran</h3>
                        <p className="text-xs text-slate-500">
                            Khusus kelas: <strong className="text-slate-800">{selectedKelas}</strong>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Input Tambah Mapel */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMapelInput}
                        onChange={(e) => setNewMapelInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddMapel();
                            }
                        }}
                        placeholder="Ketik mapel baru (misal: Biologi)..."
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddMapel}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                    >
                        Tambah
                    </button>
                </div>

                {/* List Mapel & Tombol Hapus */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {classMapels.map((m, idx) => (
                        <div
                            key={m}
                            className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl text-xs font-medium text-slate-800"
                        >
                            <span>{idx + 1}. {m}</span>
                            <button
                                type="button"
                                onClick={() => setClassMapels(classMapels.filter((item) => item !== m))}
                                title="Hapus mapel dari kelas ini"
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Actions: Batal & Simpan */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={classMapels.length === 0}
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}
