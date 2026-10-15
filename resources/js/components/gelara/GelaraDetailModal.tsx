import React from 'react';
import { X, CheckCircle2, XCircle, Printer, Edit2, MapPin } from 'lucide-react';
import { Student } from './types';

interface GelaraDetailModalProps {
    student: Student | null;
    onClose: () => void;
    onEdit: (student: Student) => void;
}

export default function GelaraDetailModal({ student, onClose, onEdit }: GelaraDetailModalProps) {
    if (!student) return null;

    const isLengkap = student.status_berkas === 'Berkas Lengkap';
    const isPutra = student.jenis_kelamin === 'Laki-laki';
    const hasPhoto = student.foto && student.foto !== 'Belum Ada Foto';

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 z-10">
                {/* Header Strip */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/80">
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                            {student.nig}
                        </span>
                        <span className="text-xs font-medium text-gray-500">Profil Arsip Gelara</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 custom-scrollbar space-y-5">
                    {/* Top Identity Card */}
                    <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                        <div className="shrink-0">
                            {hasPhoto ? (
                                <img
                                    src={`/storage/gelara/${student.foto}`}
                                    alt={student.name}
                                    className="h-28 w-20 rounded-xl object-cover border border-gray-200 shadow-sm"
                                />
                            ) : (
                                <div className="flex h-28 w-20 items-center justify-center rounded-xl border border-gray-200 bg-white text-2xl font-bold text-gray-400 shadow-xs">
                                    {student.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="inline-block rounded-full bg-gray-200/80 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                                {student.kelas || 'Kelas 10'} • Angkatan {student.angkatan} • Masuk {student.tahun_diterima}
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 leading-snug">
                                {student.name}
                            </h2>
                            <div className="text-xs font-medium text-gray-500">
                                {isPutra ? '♂ Gelara Putra' : '♀ Gelara Putri'}
                            </div>
                            <div className="pt-1">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${isLengkap
                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                                        : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                                        }`}
                                >
                                    {isLengkap ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                    <span>{student.status_berkas || 'Berkas Terdaftar'}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Information Sections */}
                    <div className="space-y-4">
                        {/* Data Kelahiran & Domisili */}
                        <div className="rounded-xl border border-gray-100 p-4 space-y-2 text-xs">
                            <div className="text-xs font-bold text-gray-900">
                                Kelahiran & Domisili
                            </div>
                            <div>
                                <span className="text-gray-400 block text-[11px]">Tempat, Tanggal Lahir</span>
                                <span className="font-semibold text-gray-800">{student.ttl || '-'}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block text-[11px]">Alamat Domisili</span>
                                <div className="flex items-start gap-1 font-medium text-gray-700 mt-0.5">
                                    <MapPin size={13} className="shrink-0 mt-0.5 text-gray-400" />
                                    <span>{student.domisili || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Data Orang Tua */}
                        <div className="rounded-xl border border-gray-100 p-4 text-xs">
                            <div className="text-xs font-bold text-gray-900 mb-2">
                                Identitas Orang Tua / Wali
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-gray-50 p-2.5">
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase">Ayah</span>
                                    <div className="font-bold text-gray-800 mt-0.5 truncate">{student.nama_ayah || '-'}</div>
                                    <div className="text-xs text-gray-500 mt-0.5 truncate">{student.pekerjaan_ayah || '-'}</div>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-2.5">
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase">Ibu</span>
                                    <div className="font-bold text-gray-800 mt-0.5 truncate">{student.nama_ibu || '-'}</div>
                                    <div className="text-xs text-gray-500 mt-0.5 truncate">{student.pekerjaan_ibu || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-6 py-4">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                        <Printer size={14} />
                        <span>Cetak Lembar</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onEdit(student);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                    >
                        <Edit2 size={13} />
                        <span>Edit Data Ini</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
