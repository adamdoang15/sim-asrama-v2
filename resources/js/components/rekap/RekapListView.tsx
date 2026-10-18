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
            <table className="w-full min-w-[980px] text-left text-xs whitespace-nowrap">
                <thead className="border-b border-slate-100 bg-[#f8fafc] text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    <tr>
                        <th className="w-[300px] px-5 py-3.5">
                            Nama Kegiatan &amp; Kategori
                        </th>
                        <th className="w-44 px-4 py-3.5">Waktu Pelaksanaan</th>
                        <th className="w-48 px-4 py-3.5">Tempat</th>
                        <th className="w-44 px-4 py-3.5">Peserta Gelara</th>
                        <th className="min-w-[240px] px-4 py-3.5">
                            Keterangan
                        </th>
                        <th className="w-32 px-5 py-3.5 text-center">
                            Dokumentasi &amp; Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr
                                key={item.id}
                                className="align-top transition-colors hover:bg-slate-50/50"
                            >
                                {/* Column 1: Kategori & Nama */}
                                <td className="px-5 py-4 whitespace-normal">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`flex w-20 shrink-0 flex-col justify-center rounded-lg px-2.5 py-2 text-center text-[10px] leading-tight font-extrabold ${item.catBadgeClass}`}
                                        >
                                            {item.catLines.map((line, idx) => (
                                                <span key={idx}>{line}</span>
                                            ))}
                                        </div>
                                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></div>
                                        <div className="flex-1">
                                            <h3 className="text-xs leading-snug font-extrabold text-slate-900 sm:text-sm">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 font-mono text-[10px] text-slate-400">
                                                Ref: {item.ref}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Column 2: Waktu Pelaksanaan */}
                                <td className="px-4 py-4">
                                    <div className="mb-1 text-xs font-bold text-slate-800">
                                        {item.date}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                        <Clock
                                            size={12}
                                            className="text-slate-400"
                                        />
                                        <span>{item.time}</span>
                                    </div>
                                </td>

                                {/* Column 3: Tempat */}
                                <td className="px-4 py-4 whitespace-normal">
                                    <div className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-600">
                                        <MapPin
                                            size={12}
                                            className="mt-0.5 shrink-0 text-slate-400"
                                        />
                                        <span className="line-clamp-2">
                                            {item.location}
                                        </span>
                                    </div>
                                </td>

                                {/* Column 4: Peserta Gelara */}
                                <td className="px-4 py-4">
                                    <div className="mb-0.5 text-xs font-bold text-slate-800">
                                        {item.participants}
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                        {item.participantSub}
                                    </div>
                                </td>

                                {/* Column 5: Keterangan */}
                                <td className="px-4 py-4 whitespace-normal">
                                    <p className="line-clamp-2 pr-2 text-xs leading-relaxed text-slate-600">
                                        {item.evaluation}
                                    </p>
                                </td>

                                {/* Column 6: Dokumentasi & Aksi */}
                                <td className="px-5 py-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <button className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/50 bg-blue-50/80 px-3 py-1 text-[11px] font-bold text-blue-600 transition-colors hover:bg-blue-100">
                                            <Camera size={12} />
                                            <span>{item.photos} Foto</span>
                                        </button>
                                        <div className="flex items-center gap-3 pt-0.5 text-slate-400">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="transition-colors hover:text-slate-700"
                                                title="Edit Laporan"
                                            >
                                                <Pencil
                                                    size={12}
                                                    className="text-slate-500"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-5 py-8 text-center text-xs text-slate-400"
                            >
                                Tidak ada agenda kegiatan pada kategori ini.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
