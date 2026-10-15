import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, User, GraduationCap, Building2, Camera } from 'lucide-react';
import { Student } from './types';

interface GelaraFormModalProps {
    isOpen: boolean;
    student: Student | null;
    onClose: () => void;
}

export default function GelaraFormModal({ isOpen, student, onClose }: GelaraFormModalProps) {
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        nig: '',
        name: '',
        jenis_kelamin: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
        ttl: '',
        angkatan: '',
        tahun_diterima: '',
        kelas: 'Kelas 10',
        nama_ayah: '',
        pekerjaan_ayah: '',
        nama_ibu: '',
        pekerjaan_ibu: '',
        domisili: '',
        status_berkas: 'Berkas Lengkap',
        foto: null as File | null,
        hapus_foto: false
    });

    useEffect(() => {
        if (!isOpen) return;

        clearErrors();
        if (student) {
            setData({
                nig: student.nig || '',
                name: student.name || '',
                jenis_kelamin: student.jenis_kelamin || 'Laki-laki',
                ttl: student.ttl || '',
                angkatan: student.angkatan || '',
                tahun_diterima: student.tahun_diterima || '',
                kelas: student.kelas || 'Kelas 10',
                domisili: student.domisili || '',
                nama_ayah: student.nama_ayah || '',
                pekerjaan_ayah: student.pekerjaan_ayah || '',
                nama_ibu: student.nama_ibu || '',
                pekerjaan_ibu: student.pekerjaan_ibu || '',
                status_berkas: student.status_berkas || 'Berkas Lengkap',
                foto: null,
                hapus_foto: false,
            });
        } else {
            reset();
        }
    }, [isOpen, student]);

    if (!isOpen) return null;

    const isEdit = Boolean(student);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit && student
            ? `/kesekretariatan/data-gelara/${student.id}/update`
            : '/kesekretariatan/data-gelara';

        post(url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/80">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            {isEdit ? 'Ubah Data Induk Gelara' : 'Tambah Data Gelara Baru'}
                        </h3>
                        <p className="text-xs text-gray-500">
                            Isi informasi formulir buku induk Gelara di bawah ini.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form id="gelara-form" onSubmit={handleSubmit} className="space-y-5">
                        {/* 1. Identitas Pribadi */}
                        <div className="rounded-xl border border-gray-200 p-4">
                            <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                                <User size={14} className="text-blue-600" />
                                <span>1. Identitas Pribadi</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        NIG (Nomor Induk Gelara) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.nig}
                                        onChange={(e) => setData('nig', e.target.value)}
                                        placeholder="001.20110409.1.2627.001"
                                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                    {errors.nig && <p className="mt-1 text-xs font-medium text-rose-600">{errors.nig}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Nama Lengkap *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama lengkap Gelara"
                                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                    {errors.name && <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Jenis Kelamin *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label
                                            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                                                data.jenis_kelamin === 'Laki-laki'
                                                    ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-xs'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="jenis_kelamin"
                                                value="Laki-laki"
                                                checked={data.jenis_kelamin === 'Laki-laki'}
                                                onChange={(e) => setData('jenis_kelamin', e.target.value as 'Laki-laki')}
                                                className="sr-only"
                                            />
                                            <span>♂ Laki-laki (Putra)</span>
                                        </label>

                                        <label
                                            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                                                data.jenis_kelamin === 'Perempuan'
                                                    ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="jenis_kelamin"
                                                value="Perempuan"
                                                checked={data.jenis_kelamin === 'Perempuan'}
                                                onChange={(e) => setData('jenis_kelamin', e.target.value as 'Perempuan')}
                                                className="sr-only"
                                            />
                                            <span>♀ Perempuan (Putri)</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tempat & Tanggal Lahir *
                                    </label>
                                    <textarea
                                        rows={2}
                                        required
                                        value={data.ttl}
                                        onChange={(e) => setData('ttl', e.target.value)}
                                        placeholder="Contoh: Bandung, 12 Mei 2010"
                                        className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Domisili / Alamat
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.domisili}
                                        onChange={(e) => setData('domisili', e.target.value)}
                                        placeholder="Jl. Sukajadi No. 12, Kota Bandung..."
                                        className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Angkatan & Akademik */}
                        <div className="rounded-xl border border-gray-200 p-4">
                            <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                                <GraduationCap size={14} className="text-blue-600" />
                                <span>2. Angkatan & Akademik</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Kelas *
                                    </label>
                                    <select
                                        value={data.kelas}
                                        onChange={(e) => setData('kelas', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                                    >
                                        <option value="Kelas 10">Kelas 10</option>
                                        <option value="Kelas 11">Kelas 11</option>
                                        <option value="Kelas 12">Kelas 12</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Angkatan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.angkatan}
                                        onChange={(e) => setData('angkatan', e.target.value)}
                                        placeholder="19"
                                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tahun Masuk *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.tahun_diterima}
                                        onChange={(e) => setData('tahun_diterima', e.target.value)}
                                        placeholder="2026"
                                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Orang Tua */}
                        <div className="rounded-xl border border-gray-200 p-4">
                            <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                                <Building2 size={14} className="text-blue-600" />
                                <span>3. Orang Tua / Wali</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Ayah</label>
                                    <input
                                        type="text"
                                        value={data.nama_ayah}
                                        onChange={(e) => setData('nama_ayah', e.target.value)}
                                        placeholder="Nama ayah"
                                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Pekerjaan Ayah</label>
                                    <input
                                        type="text"
                                        value={data.pekerjaan_ayah}
                                        onChange={(e) => setData('pekerjaan_ayah', e.target.value)}
                                        placeholder="Pekerjaan ayah"
                                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Ibu</label>
                                    <input
                                        type="text"
                                        value={data.nama_ibu}
                                        onChange={(e) => setData('nama_ibu', e.target.value)}
                                        placeholder="Nama ibu"
                                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Pekerjaan Ibu</label>
                                    <input
                                        type="text"
                                        value={data.pekerjaan_ibu}
                                        onChange={(e) => setData('pekerjaan_ibu', e.target.value)}
                                        placeholder="Pekerjaan ibu"
                                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. Lampiran Pas Foto */}
                        <div className="rounded-xl border border-gray-200 p-4">
                            <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold uppercase tracking-wider text-gray-600">
                                <Camera size={14} className="text-blue-600" />
                                <span>4. Pas Foto (2:3)</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                {data.foto ? (
                                    <div className="relative inline-block rounded-xl border border-gray-200 p-1.5 shadow-xs">
                                        <img
                                            src={URL.createObjectURL(data.foto)}
                                            alt="Pratinjau Foto"
                                            className="h-28 w-20 rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setData('foto', null)}
                                            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm hover:bg-rose-700"
                                            title="Batal pilih foto"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex-1 w-full">
                                        {isEdit && (
                                            <label className="flex items-center gap-2 mb-2 text-xs font-semibold text-rose-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.hapus_foto}
                                                    onChange={(e) => setData('hapus_foto', e.target.checked)}
                                                    className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                                                />
                                                <span>Hapus pas foto saat ini</span>
                                            </label>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData('foto', e.target.files ? e.target.files[0] : null)}
                                            className="w-full rounded-xl border border-dashed border-gray-300 p-3 text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-blue-600 hover:file:bg-blue-100 cursor-pointer"
                                        />
                                        <p className="mt-1.5 text-xs text-gray-400">
                                            Format JPG, PNG, atau WebP. Maks 5MB. Sistem otomatis menyesuaikan ke rasio 2:3.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 bg-gray-50/80 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="gelara-form"
                        disabled={processing}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Gelara'}
                    </button>
                </div>
            </div>
        </div>
    );
}
