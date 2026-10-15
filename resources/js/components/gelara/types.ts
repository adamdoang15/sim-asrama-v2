export interface Student {
    id: number;
    nig: string;
    name: string;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    ttl?: string;
    angkatan: string;
    tahun_diterima: string;
    kelas?: string;
    nama_ayah?: string;
    pekerjaan_ayah?: string;
    nama_ibu?: string;
    pekerjaan_ibu?: string;
    domisili?: string;
    status_berkas?: string;
    foto?: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface StudentsPagination {
    data: Student[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
}
