export interface KegiatanItem {
    id: number;
    category: string;
    catLines: string[];
    catBadgeClass: string;
    dotColor: string;
    title: string;
    ref: string;
    date: string;
    time: string;
    location: string;
    participants: string;
    participantSub: string;
    evaluation: string;
    photos: number;
    tabGroup: string;
    existing_photo_path?: string | null;
    period: string;
    monthStr: string;
    timestamp: number;
}
