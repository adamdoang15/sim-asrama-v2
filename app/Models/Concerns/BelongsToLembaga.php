<?php

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait BelongsToLembaga
{
    public const DEFAULT_LEMBAGA = 'LKP Doa Bangsa Cicantayan';

    public const YAYASAN = 'Yayasan';

    /**
     * Boot the trait to auto-assign lembaga when creating models.
     */
    public static function bootBelongsToLembaga(): void
    {
        static::creating(function (Model $model) {
            if (empty($model->getAttribute('lembaga'))) {
                $user = Auth::user();
                $model->setAttribute('lembaga', static::resolveLembagaForUser($user instanceof User ? $user : null));
            }
        });
    }

    /**
     * Resolve the institution name for a user or fall back to default.
     */
    public static function resolveLembagaForUser(?User $user = null, ?string $requestedLembaga = null): string
    {
        if (! empty($requestedLembaga)) {
            return $requestedLembaga;
        }

        if ($user && $user->lembaga !== self::YAYASAN && ! empty($user->lembaga)) {
            return $user->lembaga;
        }

        return self::DEFAULT_LEMBAGA;
    }

    /**
     * Scope query to the institution for the given user and optional explicit filter.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeForUser(Builder $query, ?User $user = null, ?string $selectedLembaga = null): Builder
    {
        if (! empty($selectedLembaga)) {
            return $query->where($this->getTable().'.lembaga', $selectedLembaga);
        }

        if ($user === null && Auth::check()) {
            $user = Auth::user();
        }

        if ($user instanceof User && $user->lembaga !== self::YAYASAN && ! empty($user->lembaga)) {
            return $query->where(function (Builder $q) use ($user) {
                $column = $this->getTable().'.lembaga';
                $q->where($column, $user->lembaga)->orWhereNull($column);
            });
        }

        return $query;
    }

    /**
     * Scope query directly to an institution name.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeForLembaga(Builder $query, ?string $lembaga): Builder
    {
        if (! empty($lembaga)) {
            return $query->where($this->getTable().'.lembaga', $lembaga);
        }

        return $query;
    }
}
