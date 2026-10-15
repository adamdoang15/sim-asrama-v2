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

export default function EditLaporanModal({ item, rawKegiatan, onClose }: EditLaporanModalProps) {
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
                            setData('photo', new File([blob], file.name, { type: 'image/jpeg' }));
                        }
                    },
                    'image/jpeg',
                    0.8
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
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Edit Laporan</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{item.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleEditSubmit} className="p-5 flex flex-col gap-5">
                    {Object.keys(errors).length > 0 && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs">
                            Gagal menyimpan: {Object.values(errors).join(', ')}
                        </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Keterangan / Evaluasi</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            placeholder="Tuliskan hasil evaluasi kegiatan..."
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-400 focus:outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Dokumentasi</label>
                        {data.photo ? (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group/preview">
                                <img
                                    src={URL.createObjectURL(data.photo)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setData('photo', null);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-colors z-10"
                                    title="Batal upload"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : item.existing_photo_path && !data.delete_photo ? (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group/preview">
                                <img
                                    src={`/storage/${item.existing_photo_path}`}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setData('delete_photo', true);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-colors z-10"
                                    title="Hapus foto ini"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="w-full border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                                    <Camera size={18} />
                                </div>
                                <span className="text-xs font-medium text-slate-500 text-center max-w-[200px] truncate">
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

                    <div className="flex items-center justify-end gap-3 mt-2 pt-5 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={14} />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Laporan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
