<?php

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\Auth;

test('unauthenticated guest is redirected to login page when accessing dashboard', function () {
    Auth::logout();

    $response = $this->get('/dashboard');

    $response->assertRedirect('/login');
});

test('login page can be rendered', function () {
    Auth::logout();

    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('user can authenticate using valid demo accounts from seeder', function () {
    $this->seed(UserSeeder::class);
    Auth::logout();

    $response = $this->post('/login', [
        'email' => 'cicantayan@doabangsa.sch.id',
        'password' => 'password',
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticated();
});

test('user cannot authenticate with invalid password', function () {
    $this->seed(UserSeeder::class);
    Auth::logout();

    $response = $this->post('/login', [
        'email' => 'cicantayan@doabangsa.sch.id',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('authenticated user can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $response->assertRedirect('/login');
    $this->assertGuest();
});

test('yayasan account is restricted from performing mutations (view only)', function () {
    $yayasanUser = User::factory()->create([
        'lembaga' => 'Yayasan',
        'role' => 'viewer',
    ]);

    $response = $this->actingAs($yayasanUser)->post('/sarpras/inventaris', [
        'nama_aset' => 'Meja Rapat',
        'kategori' => 'Mebel',
        'lembaga' => 'Yayasan',
        'ruangan' => 'Ruang Utama',
        'kondisi' => 'Baik',
        'jumlah' => 1,
    ]);

    $response->assertSessionHas('error');
    $this->assertDatabaseMissing('asets', [
        'nama_aset' => 'Meja Rapat',
    ]);
});

test('active institution account can perform mutations normally', function () {
    $institutionUser = User::factory()->create([
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'role' => 'admin',
    ]);

    $response = $this->actingAs($institutionUser)->post('/sarpras/inventaris', [
        'nama_aset' => 'Laptop Lab Cicantayan',
        'kategori' => 'Elektronik',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'ruangan' => 'Lab Komputer',
        'lokasi' => 'Gedung A',
        'satuan' => 'Unit',
        'kondisi' => 'Baik',
        'jumlah' => 2,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('asets', [
        'nama_aset' => 'Laptop Lab Cicantayan',
    ]);
});
