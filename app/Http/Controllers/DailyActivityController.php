<?php

namespace App\Http\Controllers;

use App\Domain\ActivityTracking;
use App\Models\DailyActivity;
use App\Models\Gelara;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyActivityController extends Controller
{
    public const ACTIVITIES = ActivityTracking::ACTIVITY_ITEMS;

    public function index(Request $request): Response
    {
        $date = $request->get('date', now()->toDateString());
        $currentDate = Carbon::parse($date);
        $currentDate->locale('id');

        $month = $request->get('month', $currentDate->format('Y-m'));
        $carbonMonth = Carbon::parse($month.'-01');
        $carbonMonth->locale('id');

        $startOfMonth = $carbonMonth->copy()->startOfMonth();
        $endOfMonth = $carbonMonth->copy()->endOfMonth();

        $availableWeeks = ActivityTracking::sliceWeeks($carbonMonth);
        $requestedWeek = $request->has('week') ? (int) $request->get('week') : null;
        $activeWeek = ActivityTracking::resolveActiveWeek($availableWeeks, $requestedWeek, $currentDate, $carbonMonth);

        $selectedWeek = $activeWeek['selected_week'];
        $weekLabel = $activeWeek['week_label'];
        $monthLabel = strtolower($carbonMonth->translatedFormat('F Y'));

        $user = $request->user();
        $gelaras = Gelara::forUser($user)->get();
        $activities = DailyActivity::forUser($user)->where('date', $date)->get()->keyBy('gelara_id');

        // Query all activities in current month for accurate accumulation
        $monthlyActivities = DailyActivity::whereBetween('date', [
            $startOfMonth->toDateString(),
            $endOfMonth->toDateString(),
        ])->get()->groupBy('gelara_id');

        $rekapData = ActivityTracking::compileRekap(
            $gelaras,
            $monthlyActivities,
            $activeWeek['start_of_week'],
            $activeWeek['end_of_week']
        );

        // Aggregated trend data per date in selected month
        $monthRecordsByDate = DailyActivity::whereBetween('date', [
            $startOfMonth->toDateString(),
            $endOfMonth->toDateString(),
        ])->get()->groupBy(fn ($item) => Carbon::parse($item->date)->toDateString());

        $trendData = ActivityTracking::compileDailyTrends($carbonMonth, $monthRecordsByDate);

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

    public function store(Request $request): RedirectResponse
    {
        $lembaga = DailyActivity::resolveLembagaForUser($request->user(), $request->input('lembaga'));

        if ($request->has('bulk_data')) {
            ActivityTracking::recordBulkAttendance(
                $request->bulk_data,
                $request->date,
                $lembaga
            );

            return redirect()->back();
        }

        $request->validate([
            'date' => 'required|date',
            'gelara_id' => 'required|exists:gelaras,id',
            'activities' => 'array',
        ]);

        ActivityTracking::recordAttendance(
            (int) $request->gelara_id,
            $request->date,
            $request->activities ?? [],
            $lembaga
        );

        return redirect()->back();
    }
}
