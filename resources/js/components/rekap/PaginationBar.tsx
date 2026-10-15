import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalItems: number;
    perPage: number;
    setPerPage: (perPage: number) => void;
    className?: string;
}

export default function PaginationBar({
    currentPage,
    setCurrentPage,
    totalItems,
    perPage,
    setPerPage,
    className = '',
}: PaginationBarProps) {
    const totalPages = Math.ceil(totalItems / perPage) || 1;

    const getVisiblePages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, '...', totalPages];
        if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage, '...', totalPages];
    };

    return (
        <div className={`p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 ${className}`}>
            <div className="font-medium">
                Menampilkan <b className="text-slate-800">{totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, totalItems)}</b> dari <b className="text-slate-800">{totalItems}</b> total agenda kegiatan
                <span className="mx-2">•</span>
                Tampilkan
                <select
                    value={perPage}
                    onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="mx-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-blue-400"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
                per halaman
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                    <ChevronLeft size={14} />
                </button>

                {getVisiblePages().map((page, idx) =>
                    page === '...' ? (
                        <span key={`dots-${idx}`} className="w-6 text-center text-slate-400 font-bold">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page as number)}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold transition-colors ${
                                currentPage === page
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
