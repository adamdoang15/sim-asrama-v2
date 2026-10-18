import React from 'react';
import { useForm } from '@inertiajs/react';
import kegelaraan from '@/routes/kegelaraan';
import { X, Save, Camera } from 'lucide-react';
import { KegiatanItem } from './types';

interface EditLaporanModalProps {
    item: KegiatanItem;
    rawKegiatan?: any;
    onClose: () => void;
}

export default function EditLaporanModal({
    item,
    rawKegiatan,
    onClose,
}: EditLaporanModalProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: rawKegiatan?.title || item.title,
        description: rawKegiatan?.description ?? item.evaluation ?? '',
        start_date: rawKegiatan?.start_date || '',
        end_date: rawKegiatan?.end_date || '',
        type: rawKegiatan?.type || item.category,
        location: rawKegiatan?.location ?? item.location ?? '',
        is_completed: rawKegiatan?.is_completed ?? false,
        photo: null as File | null,
        delete_photo: false,
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const MAX_SIZE = 1200;

                if (width > height && width > MAX_SIZE) {
                    height = Math.round(height * (MAX_SIZE / width));
                    width = MAX_SIZE;
                } else if (height > MAX_SIZE) {
                    width = Math.round(width * (MAX_SIZE / height));
                    height = MAX_SIZE;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            setData(
                                'photo',
                                new File([blob], file.name, {
                                    type: 'image/jpeg',
                                }),
                            );
                        }
                    },
                    'image/jpeg',
                    0.8,
                );
            };
        };
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(kegelaraan.kalender.update.url(item.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            <div className="animate-in fade-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
                    <div>
                        <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                            Edit Laporan
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {item.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                </div>
                <form
                    onSubmit={handleEditSubmit}
                    className="flex flex-col gap-5 p-5"
                >
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600">
                            Gagal menyimpan: {Object.values(errors).join(', ')}
                        </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">
                            Keterangan / Evaluasi
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={4}
                            placeholder="Tuliskan hasil evaluasi kegiatan..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:outline-none"
                        ></textarea>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">
                            Dokumentasi
                        </label>
                        {data.photo ? (
                            <div className="group/preview relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                <img
                                    src={URL.createObjectURL(data.photo)}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setData('photo', null);
                                    }}
                                    className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1.5 text-white shadow-sm transition-colors hover:bg-red-600"
                                    title="Batal upload"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : item.existing_photo_path && !data.delete_photo ? (
                            <div className="group/preview relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                <img
                                    src={`/storage/${item.existing_photo_path}`}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setData('delete_photo', true);
                                    }}
                                    className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1.5 text-white shadow-sm transition-colors hover:bg-red-600"
                                    title="Hapus foto ini"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 transition-colors hover:bg-slate-100">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs transition-all group-hover:scale-110 group-hover:text-blue-500">
                                    <Camera size={18} />
                                </div>
                                <span className="max-w-[200px] truncate text-center text-xs font-medium text-slate-500">
                                    Klik untuk upload foto (opsional)
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        )}
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save size={14} />
                            <span>
                                {processing ? 'Menyimpan...' : 'Simpan Laporan'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
