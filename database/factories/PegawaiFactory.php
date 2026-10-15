<?php

namespace Database\Factories;

use App\Models\Pegawai;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pegawai>
 */
class PegawaiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['Laki-laki', 'Perempuan']);

        return [
            'name' => fake()->name($gender === 'Laki-laki' ? 'male' : 'female'),
            'niy' => 'NIY-'.fake()->year().'-'.fake()->numerify('####'),
            'jenis_kelamin' => $gender,
            'ttl' => fake()->city().', '.fake()->date('d F Y'),
            'status_pegawai' => fake()->randomElement(['Pegawai Tetap Yayasan', 'Kontrak Kerja']),
            'jabatan' => fake()->randomElement(['Ketua LKP', 'Bendahara', 'Staf Kegelaraan', 'Ketua Bidang', 'Sekretaris', 'Humas']),
            'tahun_masuk' => fake()->year(),
            'foto' => 'Belum Ada Foto',
        ];
    }
}
