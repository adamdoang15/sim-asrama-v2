import React from 'react';
import { Calendar, Clock, MapPin, Camera, Pencil } from 'lucide-react';
import { KegiatanItem } from './types';

interface RekapGridViewProps {
    items: KegiatanItem[];
    onEdit: (item: KegiatanItem) => void;
}

export default function RekapGridView({ items, onEdit }: RekapGridViewProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {items.length > 0 ? (
                items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 hover:shadow-md transition-shadow group flex flex-col h-full relative overflow-hidden"
                    >
                        <div
                            className={`absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full ${item.dotColor} -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`}
                        ></div>

                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div
                                className={`shrink-0 rounded-lg px-2 py-1 text-center text-[10px] font-extrabold leading-tight ${item.catBadgeClass}`}
                            >
                                {item.category}
                            </div>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug mb-3">
                            {item.title}
                        </h3>

                        <div className="space-y-2 mb-4 flex-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <Calendar size={12} className="text-slate-400 shrink-0" />
                                <span>{item.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                <Clock size={12} className="text-slate-400 shrink-0" />
                                <span>{item.time}</span>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                                <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{item.location}</span>
                            </div>
                        </div>

                        <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
                            <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/80 text-blue-600 hover:bg-blue-100 transition-colors text-[11px] font-bold border border-blue-200/50">
                                <Camera size={12} />
                                <span>{item.photos} Foto</span>
                            </button>
                            <button
                                onClick={() => onEdit(item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                                title="Edit Laporan"
                            >
                                <Pencil size={14} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-12 text-center text-sm text-slate-400 bg-white rounded-2xl border border-slate-200/80 border-dashed">
                    Tidak ada agenda kegiatan pada kategori ini.
                </div>
            )}
        </div>
    );
}
