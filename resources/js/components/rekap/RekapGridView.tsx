import React from 'react';
import { Calendar, Clock, MapPin, Camera, Pencil } from 'lucide-react';
import { KegiatanItem } from './types';

interface RekapGridViewProps {
    items: KegiatanItem[];
    onEdit: (item: KegiatanItem) => void;
}

export default function RekapGridView({ items, onEdit }: RekapGridViewProps) {
    return (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.length > 0 ? (
                items.map((item) => (
                    <div
                        key={item.id}
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md"
                    >
                        <div
                            className={`absolute top-0 right-0 h-16 w-16 rounded-bl-full opacity-10 ${item.dotColor} -mt-8 -mr-8 transition-transform duration-500 group-hover:scale-150`}
                        ></div>

                        <div className="mb-4 flex items-start justify-between gap-3">
                            <div
                                className={`shrink-0 rounded-lg px-2 py-1 text-center text-[10px] leading-tight font-extrabold ${item.catBadgeClass}`}
                            >
                                {item.category}
                            </div>
                        </div>

                        <h3 className="mb-3 text-sm leading-snug font-extrabold text-slate-900">
                            {item.title}
                        </h3>

                        <div className="mb-4 flex-1 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <Calendar
                                    size={12}
                                    className="shrink-0 text-slate-400"
                                />
                                <span>{item.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <Clock
                                    size={12}
                                    className="shrink-0 text-slate-400"
                                />
                                <span>{item.time}</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs font-medium text-slate-500">
                                <MapPin
                                    size={12}
                                    className="mt-0.5 shrink-0 text-slate-400"
                                />
                                <span className="line-clamp-2">
                                    {item.location}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                            <button className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/50 bg-blue-50/80 px-3 py-1 text-[11px] font-bold text-blue-600 transition-colors hover:bg-blue-100">
                                <Camera size={12} />
                                <span>{item.photos} Foto</span>
                            </button>
                            <button
                                onClick={() => onEdit(item)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                                title="Edit Laporan"
                            >
                                <Pencil size={14} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-200/80 bg-white py-12 text-center text-sm text-slate-400">
                    Tidak ada agenda kegiatan pada kategori ini.
                </div>
            )}
        </div>
    );
}
