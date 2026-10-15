export interface StudentGrade {
    id: number;
    name: string;
    nig: string;
    kamar?: string;
    kelas?: string;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    uts: number;
    uas: number;
    nilai_akhir: number;
    mutu?: number;
    predikat: string;
    deskripsi: string;
}

export interface GelaraOption {
    id: number;
    name: string;
    nig: string;
}

export interface DistributionItem {
    grade: string;
    range: string;
    count: number;
    percentage: number;
    color: string;
    barColor: string;
}

export interface LedgerStudentScore {
    nilai_akhir: number;
    predikat: string;
    kkm: number;
    deskripsi: string;
    keterampilan_nilai?: number;
    keterampilan_predikat?: string;
    keterampilan_deskripsi?: string;
}

export interface PelengkapData {
    sikap_spiritual_predikat: string;
    sikap_spiritual_deskripsi: string;
    sikap_sosial_predikat: string;
    sikap_sosial_deskripsi: string;
    ekskul: Array<{ nama: string; nilai: string; keterangan: string }>;
    absensi_sakit: number;
    absensi_izin: number;
    absensi_alpha: number;
    catatan_wali: string;
}

export interface KesehatanData {
    berat_badan: number | null;
    tinggi_badan: number | null;
    imt: number | null;
    imt_kategori: string | null;
    tensi: string | null;
    tensi_kategori: string | null;
    riwayat_sakit: {
        ringan?: { jumlah: number; keterangan: string };
        sedang?: { jumlah: number; keterangan: string };
        berat?: { jumlah: number; keterangan: string };
    };
    catatan_kesehatan: string | null;
}

export interface LedgerStudent {
    id: number;
    name: string;
    nig: string;
    kelas?: string;
    ttl?: string;
    jenis_kelamin?: string;
    agama?: string;
    domisili?: string;
    nama_ayah?: string;
    pekerjaan_ayah?: string;
    nama_ibu?: string;
    pekerjaan_ibu?: string;
    tahun_diterima?: string;
    foto?: string | null;
    scores: Record<string, LedgerStudentScore>;
    total: number;
    avg: number;
    predikat: string;
    is_complete: boolean;
    filled_count: number;
    total_count: number;
    pelengkap?: PelengkapData;
    kesehatan?: KesehatanData;
    prestasis?: Array<{ nama: string; keterangan: string }>;
}

export interface ClassLedger {
    mapels: string[];
    students: LedgerStudent[];
}

export interface NilaiAkademikProps {
    initialFilters?: {
        tahun_akademik: string;
        kelas: string;
        mata_pelajaran: string;
        search?: string;
    };
    options?: {
        tahun_akademik: string[];
        kelas: string[];
        mata_pelajaran: string[];
    };
    kkm?: number;
    students?: StudentGrade[];
    allGelaras?: GelaraOption[];
    totalStudents?: number;
    gradedCount?: number;
    currentPage?: number;
    distribution?: DistributionItem[];
    subjectKds?: string[];
    classLedger?: ClassLedger;
    waliKelas?: { name: string; niy: string | null } | null;
}
