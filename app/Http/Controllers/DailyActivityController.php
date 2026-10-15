<?php

namespace App\Http\Controllers;

use App\Models\DailyActivity;
use App\Models\Gelara;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyActivityController extends Controller
{
    const ACTIVITIES = [
        'bangun tidur', 'mandi pagi', 'sholat subuh', 'TC', 'piket', 'berangkat sekolah',
        'sholat dzuhur', 'sholat ashar', 'sholat maghrib', 'sholat isya', 'KBM',
        'Apel malam', 'pengumpulan hp', 'mandi sore', 'pulang sekolah', 'olahraga',
        'nonton bareng', 'zoom viconnas', 'pengajian', 'koordinasi bulanan', 'opsih',
    ];

    public function index(Request $request)
    {
        $date = $request->get('date', now()->toDateString());
        $currentDate = Carbon::parse($date)->locale('id');

        $month = $request->get('month', $currentDate->format('Y-m'));
        $carbonMonth = Carbon::parse($month.'-01')->locale('id');

        $startOfMonth = $carbonMonth->copy()->startOfMonth();
        $endOfMonth = $carbonMonth->copy()->endOfMonth();

        // Available weeks in selected month
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
        $availableWeeks = array_values($availableWeeks);

        if ($request->has('week')) {
            $selectedWeek = (int) $request->get('week');
        } elseif ($month === $currentDate->format('Y-m')) {
            $selectedWeek = $currentDate->weekOfMonth;
        } else {
            $selectedWeek = 1;
        }

        $selectedWeekData = collect($availableWeeks)->firstWhere('week', $selectedWeek) ?? ($availableWeeks[0] ?? null);
        if ($selectedWeekData) {
            $selectedWeek = $selectedWeekData['week'];
            $startOfWeek = Carbon::parse($selectedWeekData['start'])->startOfDay();
            $endOfWeek = Carbon::parse($selectedWeekData['end'])->endOfDay();
            $weekLabel = 'minggu '.$selectedWeekData['week'].' ('.strtolower($selectedWeekData['start_label']).' - '.strtolower($selectedWeekData['end_label']).' '.$carbonMonth->year.')';
        } else {
            $startOfWeek = $carbonMonth->copy()->startOfMonth();
            $endOfWeek = $carbonMonth->copy()->endOfMonth();
            $weekLabel = 'minggu 1';
        }

        $monthLabel = strtolower($carbonMonth->translatedFormat('F Y'));

        $user = $request->user();
        $gelaraQuery = Gelara::query();
        if ($user && $user->lembaga !== 'Yayasan') {
            $gelaraQuery->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }
        $gelaras = $gelaraQuery->get();
        $activities = DailyActivity::where('date', $date)->get()->keyBy('gelara_id');

        // Query all activities in current month for accurate accumulation
        $monthlyActivities = DailyActivity::whereBetween('date', [
            $startOfMonth->toDateString(),
            $endOfMonth->toDateString(),
        ])->get()->groupBy('gelara_id');

        $rekapData = [];
        foreach ($gelaras as $g) {
            $records = $monthlyActivities->get($g->id, collect());

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
                    if (! in_array($status, ['H', 'I', 'S', 'A'])) {
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

        // Aggregated trend data per date in selected month
        $monthRecordsByDate = DailyActivity::whereBetween('date', [
            $startOfMonth->toDateString(),
            $endOfMonth->toDateString(),
        ])->get()->groupBy(fn ($item) => Carbon::parse($item->date)->toDateString());

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

        return Inertia::render('Kegelaraan/DailyActivity', [
            'date' => $date,
            'gelaras' => $gelaras,
            'activitiesData' => $activities,
            'activityList' => self::ACTIVITIES,
            'rekapData' => $rekapData,
            'trendData' => $trendData,
            'weekLabel' => $weekLabel,
            'monthLabel' => $monthLabel,
            'selectedMonth' => $month,
            'selectedWeek' => $selectedWeek,
            'availableWeeks' => $availableWeeks,
            'initialTab' => $request->get('tab', 'Lembar Kerja Presensi'),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $lembaga = $request->input('lembaga') ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

        if ($request->has('bulk_data')) {
            foreach ($request->bulk_data as $data) {
                DailyActivity::updateOrCreate(
                    ['gelara_id' => $data['gelara_id'], 'date' => $request->date],
                    ['activities' => $data['activities'] ?? [], 'lembaga' => $lembaga]
                );
            }

            return redirect()->back();
        }

        $request->validate([
            'date' => 'required|date',
            'gelara_id' => 'required|exists:gelaras,id',
            'activities' => 'array',
        ]);

        DailyActivity::updateOrCreate(
            ['gelara_id' => $request->gelara_id, 'date' => $request->date],
            ['activities' => $request->activities ?? [], 'lembaga' => $lembaga]
        );

        return redirect()->back();
    }
}
