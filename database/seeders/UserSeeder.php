<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        $users = [
            // 1. Akun Super Lembaga (Administrasi) & Yayasan (Viewer)
            [
                'name' => 'Admin Cicantayan',
                'email' => 'cicantayan@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'LKP Doa Bangsa Cicantayan',
                'role' => 'administrasi',
            ],
            [
                'name' => 'Admin Banjarbaru',
                'email' => 'banjarbaru@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'LKP Doa Bangsa Banjarbaru',
                'role' => 'administrasi',
            ],
            [
                'name' => 'Admin Ponpes',
                'email' => 'ponpes@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'Ponpes Doa Bangsa',
                'role' => 'administrasi',
            ],
            [
                'name' => 'Pengawas Yayasan',
                'email' => 'yayasan@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'Yayasan',
                'role' => 'viewer',
            ],

            // 2. Akun Divisi / Role (Contoh di LKP Cicantayan)
            [
                'name' => 'Staf Kesekretariatan',
                'email' => 'sekretariat@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'LKP Doa Bangsa Cicantayan',
                'role' => 'kesekretariatan',
            ],
            [
                'name' => 'Staf Kegelaraan',
                'email' => 'kegelaraan@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'LKP Doa Bangsa Cicantayan',
                'role' => 'kegelaraan',
            ],
            [
                'name' => 'Staf Kurikulum',
                'email' => 'kurikulum@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'LKP Doa Bangsa Cicantayan',
                'role' => 'kurikulum',
            ],
            [
                'name' => 'Staf Kesehatan',
                'email' => 'kesehatan@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'LKP Doa Bangsa Cicantayan',
                'role' => 'kesehatan',
            ],
            [
                'name' => 'Staf Sarpras',
                'email' => 'sarpras@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'LKP Doa Bangsa Cicantayan',
                'role' => 'sarpras',
            ],
            [
                'name' => 'Staf Keuangan',
                'email' => 'keuangan@doabangsa.sch.id',
                'password' => $password,
                'lembaga' => 'LKP Doa Bangsa Cicantayan',
                'role' => 'keuangan',
            ],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(['email' => $data['email']], $data);
        }
    }
}
