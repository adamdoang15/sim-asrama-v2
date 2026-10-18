<?php

namespace App\Domain;

use App\Models\DailyActivity;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ActivityTracking
{
    public const STATUSES = ['H', 'I', 'S', 'A'];

    public const ACTIVITY_ITEMS = [
        'bangun tidur', 'mandi pagi', 'sholat subuh', 'TC', 'piket', 'berangkat sekolah',
        'sholat dzuhur', 'sholat ashar', 'sholat maghrib', 'sholat isya', 'KBM',
        'Apel malam', 'pengumpulan hp', 'mandi sore', 'pulang sekolah', 'olahraga',
        'nonton bareng', 'zoom viconnas', 'pengajian', 'koordinasi bulanan', 'opsih',
    ];

    /**
     * Membagi hari-hari dalam suatu bulan kalender menjadi kelompok rentang pekanan.
     *
     * @return array<int, array{week: int, start: string, end: string, start_label: string, end_label: string}>
     */
    public static function sliceWeeks(Carbon $carbonMonth): array
    {
        $availableWeeks = [];

        for ($d = 1; $d <= $carbonMonth->daysInMonth; $d++) {
            $cDay = Carbon::create($carbonMonth->year, $carbonMonth->month, $d)->locale('id');
            $wNum = $cDay->weekOfMonth;

            if (! isset($availableWeeks[$wNum])) {
                $availableWeeks[$wNum] = [
                    'week' => $wNum,
                    'start' => $cDay->toDateString(),
                    'end' => $cDay->toDateString(),
                    'start_label' => $cDay->translatedFormat('d M'),
                    'end_label' => $cDay->translatedFormat('d M'),
                ];
            } else {
                $availableWeeks[$wNum]['end'] = $cDay->toDateString();
                $availableWeeks[$wNum]['end_label'] = $cDay->translatedFormat('d M');
            }
        }

        return array_values($availableWeeks);
    }

    /**
     * Menentukan pekan aktif yang terpilih beserta batas tanggal dan labelnya.
     *
     * @param  array<int, array{week: int, start: string, end: string, start_label: string, end_label: string}>  $availableWeeks
     * @return array{selected_week: int, start_of_week: Carbon, end_of_week: Carbon, week_label: string}
     */
    public static function resolveActiveWeek(
        array $availableWeeks,
        ?int $requestedWeek,
        Carbon $currentDate,
        Carbon $carbonMonth
    ): array {
        if ($requestedWeek !== null) {
            $selectedWeek = $requestedWeek;
        } elseif ($carbonMonth->format('Y-m') === $currentDate->format('Y-m')) {
            $selectedWeek = $currentDate->weekOfMonth;
        } else {
            $selectedWeek = 1;
        }

        $selectedWeekData = collect($availableWeeks)->firstWhere('week', $selectedWeek) ?? ($availableWeeks[0] ?? null);

        if ($selectedWeekData) {
            $resolvedWeek = (int) $selectedWeekData['week'];
            $startOfWeek = Carbon::parse($selectedWeekData['start'])->startOfDay();
            $endOfWeek = Carbon::parse($selectedWeekData['end'])->endOfDay();
            $weekLabel = 'minggu '.$resolvedWeek.' ('.strtolower($selectedWeekData['start_label']).' - '.strtolower($selectedWeekData['end_label']).' '.$carbonMonth->year.')';
        } else {
            $resolvedWeek = 1;
            $startOfWeek = $carbonMonth->copy()->startOfMonth();
            $endOfWeek = $carbonMonth->copy()->endOfMonth();
            $weekLabel = 'minggu 1';
        }

        return [
            'selected_week' => $resolvedWeek,
            'start_of_week' => $startOfWeek,
            'end_of_week' => $endOfWeek,
            'week_label' => $weekLabel,
        ];
    }

    /**
     * Menghitung akumulasi statistik presensi (mingguan dan bulanan) per Gelara.
     *
     * @param  Collection<int, mixed>  $gelaras
     * @param  Collection<int, Collection<int, DailyActivity>>  $monthlyActivitiesGrouped
     * @return array<int, array<string, mixed>>
     */
    public static function compileRekap(
        Collection $gelaras,
        Collection $monthlyActivitiesGrouped,
        Carbon $startOfWeek,
        Carbon $endOfWeek
    ): array {
        $rekapData = [];

        foreach ($gelaras as $g) {
            $records = $monthlyActivitiesGrouped->get($g->id, collect());

            $hadirWeek = 0;
            $izinWeek = 0;
            $sakitWeek = 0;
            $alfaWeek = 0;

            $hadirMonth = 0;
            $izinMonth = 0;
            $sakitMonth = 0;
            $alfaMonth = 0;

            foreach ($records as $record) {
                $recDate = Carbon::parse($record->date);
                $isThisWeek = $recDate->betweenIncluded($startOfWeek, $endOfWeek);
                $acts = is_array($record->activities) ? $record->activities : [];

                foreach ($acts as $act) {
                    $status = is_array($act) ? ($act['status'] ?? '') : $act;
                    if (! in_array($status, self::STATUSES, true)) {
                        continue;
                    }

                    if ($status === 'H') {
                        $hadirMonth++;
                        if ($isThisWeek) {
                            $hadirWeek++;
                        }
                    } elseif ($status === 'I') {
                        $izinMonth++;
                        if ($isThisWeek) {
                            $izinWeek++;
                        }
                    } elseif ($status === 'S') {
                        $sakitMonth++;
                        if ($isThisWeek) {
                            $sakitWeek++;
                        }
                    } elseif ($status === 'A') {
                        $alfaMonth++;
                        if ($isThisWeek) {
                            $alfaWeek++;
                        }
                    }
                }
            }

            $totalWeek = $hadirWeek + $izinWeek + $sakitWeek + $alfaWeek;
            $totalMonth = $hadirMonth + $izinMonth + $sakitMonth + $alfaMonth;

            $rekapData[$g->id] = [
                'total_minggu' => $totalWeek,
                'total_bulan' => $totalMonth,
                'progress_mingguan' => $totalWeek > 0 ? round(($hadirWeek / $totalWeek) * 100, 1) : null,
                'progress_bulanan' => $totalMonth > 0 ? round(($hadirMonth / $totalMonth) * 100, 1) : null,
                'a_minggu' => $alfaWeek,
                'a_bulan' => $alfaMonth,
                'hadir_minggu' => $hadirWeek,
                'izin_minggu' => $izinWeek,
                'sakit_minggu' => $sakitWeek,
                'hadir_bulan' => $hadirMonth,
                'izin_bulan' => $izinMonth,
                'sakit_bulan' => $sakitMonth,
            ];
        }

        return $rekapData;
    }

    /**
     * Mengompilasi data deret waktu tren harian untuk grafik bulan terpilih.
     *
     * @param  Collection<string, Collection<int, DailyActivity>>  $monthRecordsByDate
     * @return array<int, array<string, mixed>>
     */
    public static function compileDailyTrends(Carbon $carbonMonth, Collection $monthRecordsByDate): array
    {
        $trendData = [];

        for ($d = 1; $d <= $carbonMonth->daysInMonth; $d++) {
            $cDay = Carbon::create($carbonMonth->year, $carbonMonth->month, $d)->locale('id');
            $dateStr = $cDay->toDateString();

            $dayRecords = $monthRecordsByDate->get($dateStr, collect());
            $h = 0;
            $i = 0;
            $s = 0;
            $a = 0;

            foreach ($dayRecords as $record) {
                $acts = (array) $record->activities;
                foreach ($acts as $act) {
                    $st = is_array($act) ? ($act['status'] ?? '') : $act;
                    if ($st === 'H') {
                        $h++;
                    } elseif ($st === 'I') {
                        $i++;
                    } elseif ($st === 'S') {
                        $s++;
                    } elseif ($st === 'A') {
                        $a++;
                    }
                }
            }

            $total = $h + $i + $s + $a;
            if ($total > 0) {
                $trendData[] = [
                    'date' => $dateStr,
                    'day' => $d,
                    'label' => $cDay->translatedFormat('d M'),
                    'total' => $total,
                    'hadir' => round(($h / $total) * 100, 1),
                    'izin' => round(($i / $total) * 100, 1),
                    'sakit' => round(($s / $total) * 100, 1),
                    'alfa' => round(($a / $total) * 100, 1),
                    'count_hadir' => $h,
                    'count_izin' => $i,
                    'count_sakit' => $s,
                    'count_alfa' => $a,
                ];
            }
        }

        return $trendData;
    }

    /**
     * Mencatat presensi harian untuk satu orang santri (Gelara).
     */
    public static function recordAttendance(int $gelaraId, string $date, array $activities, string $lembaga): DailyActivity
    {
        return DailyActivity::updateOrCreate(
            ['gelara_id' => $gelaraId, 'date' => $date],
            ['activities' => $activities, 'lembaga' => $lembaga]
        );
    }

    /**
     * Mencatat presensi harian santri secara massal (bulk).
     *
     * @param  array<int, array{gelara_id: int, activities?: array}>  $bulkData
     */
    public static function recordBulkAttendance(array $bulkData, string $date, string $lembaga): void
    {
        foreach ($bulkData as $data) {
            self::recordAttendance(
                (int) $data['gelara_id'],
                $date,
                $data['activities'] ?? [],
                $lembaga
            );
        }
    }
}
