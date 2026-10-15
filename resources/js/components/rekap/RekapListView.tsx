import React from 'react';
import { Clock, MapPin, Camera, Pencil } from 'lucide-react';
import { KegiatanItem } from './types';

interface RekapListViewProps {
    items: KegiatanItem[];
    onEdit: (item: KegiatanItem) => void;
}

export default function RekapListView({ items, onEdit }: RekapListViewProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap min-w-[980px]">
                <thead className="bg-[#f8fafc] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                        <th className="px-5 py-3.5 w-[300px]">Nama Kegiatan &amp; Kategori</th>
                        <th className="px-4 py-3.5 w-44">Waktu Pelaksanaan</th>
                        <th className="px-4 py-3.5 w-48">Tempat</th>
                        <th className="px-4 py-3.5 w-44">Peserta Gelara</th>
                        <th className="px-4 py-3.5 min-w-[240px]">Keterangan</th>
                        <th className="px-5 py-3.5 w-32 text-center">Dokumentasi &amp; Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors align-top">
                                {/* Column 1: Kategori & Nama */}
                                <td className="px-5 py-4 whitespace-normal">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`shrink-0 rounded-lg px-2.5 py-2 text-center text-[10px] font-extrabold leading-tight w-20 flex flex-col justify-center ${item.catBadgeClass}`}
                                        >
                                            {item.catLines.map((line, idx) => (
                                                <span key={idx}>{line}</span>
                                            ))}
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></div>
                                        <div className="flex-1">
                                            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                                                {item.title}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-mono mt-1">
                                                Ref: {item.ref}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Column 2: Waktu Pelaksanaan */}
                                <td className="px-4 py-4">
                                    <div className="font-bold text-slate-800 text-xs mb-1">
                                        {item.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                        <Clock size={12} className="text-slate-400" />
                                        <span>{item.time}</span>
                                    </div>
                                </td>

                                {/* Column 3: Tempat */}
                                <td className="px-4 py-4 whitespace-normal">
                                    <div className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
                                        <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{item.location}</span>
                                    </div>
                                </td>

                                {/* Column 4: Peserta Gelara */}
                                <td className="px-4 py-4">
                                    <div className="font-bold text-slate-800 text-xs mb-0.5">
                                        {item.participants}
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                        {item.participantSub}
                                    </div>
                                </td>

                                {/* Column 5: Keterangan */}
                                <td className="px-4 py-4 whitespace-normal">
                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 pr-2">
                                        {item.evaluation}
                                    </p>
                                </td>

                                {/* Column 6: Dokumentasi & Aksi */}
                                <td className="px-5 py-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/80 text-blue-600 hover:bg-blue-100 transition-colors text-[11px] font-bold border border-blue-200/50">
                                            <Camera size={12} />
                                            <span>{item.photos} Foto</span>
                                        </button>
                                        <div className="flex items-center gap-3 text-slate-400 pt-0.5">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="hover:text-slate-700 transition-colors"
                                                title="Edit Laporan"
                                            >
                                                <Pencil size={12} className="text-slate-500" />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-400">
                                Tidak ada agenda kegiatan pada kategori ini.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
