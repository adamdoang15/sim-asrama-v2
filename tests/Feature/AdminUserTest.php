<?php

use App\Models\User;

test('super admin can view user management page with list of users', function () {
    $superAdmin = User::factory()->create([
        'name' => 'Super Admin Test',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'role' => 'administrasi',
    ]);

    $response = $this->actingAs($superAdmin)->get('/admin/users');

    $response->assertStatus(200);
});

test('regular staff role is forbidden from accessing user management', function () {
    $staff = User::factory()->create([
        'name' => 'Staf Sarpras',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'role' => 'sarpras',
    ]);

    $response = $this->actingAs($staff)->get('/admin/users');

    $response->assertRedirect('/dashboard');
    $response->assertSessionHas('error');
});

test('yayasan viewer is forbidden from accessing user management', function () {
    $yayasan = User::factory()->create([
        'name' => 'Pengawas Yayasan',
        'lembaga' => 'Yayasan',
        'role' => 'viewer',
    ]);

    $response = $this->actingAs($yayasan)->get('/admin/users');

    $response->assertRedirect('/dashboard');
    $response->assertSessionHas('error');
});

test('super admin can create new user', function () {
    $superAdmin = User::factory()->create([
        'role' => 'administrasi',
    ]);

    $response = $this->actingAs($superAdmin)->post('/admin/users', [
        'name' => 'Guru Baru Banjarbaru',
        'email' => 'gurubaru@doabangsa.sch.id',
        'password' => 'password123',
        'lembaga' => 'LKP Doa Bangsa Banjarbaru',
        'role' => 'kurikulum',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'email' => 'gurubaru@doabangsa.sch.id',
        'lembaga' => 'LKP Doa Bangsa Banjarbaru',
        'role' => 'kurikulum',
    ]);
});

test('super admin can update existing user', function () {
    $superAdmin = User::factory()->create([
        'role' => 'administrasi',
    ]);

    $targetUser = User::factory()->create([
        'name' => 'Staf Lama',
        'email' => 'staflama@doabangsa.sch.id',
        'lembaga' => 'Ponpes Doa Bangsa',
        'role' => 'kesehatan',
    ]);

    $response = $this->actingAs($superAdmin)->put("/admin/users/{$targetUser->id}", [
        'name' => 'Staf Diperbarui',
        'email' => 'staflama@doabangsa.sch.id',
        'lembaga' => 'Ponpes Doa Bangsa',
        'role' => 'kesekretariatan',
    ]);

    $response->assertRedirect();
    $targetUser->refresh();
    expect($targetUser->name)->toBe('Staf Diperbarui');
    expect($targetUser->role)->toBe('kesekretariatan');
});

test('super admin can delete other user', function () {
    $superAdmin = User::factory()->create([
        'role' => 'administrasi',
    ]);

    $targetUser = User::factory()->create([
        'email' => 'userhapus@doabangsa.sch.id',
    ]);

    $response = $this->actingAs($superAdmin)->delete("/admin/users/{$targetUser->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('users', [
        'id' => $targetUser->id,
    ]);
});

test('super admin cannot delete self active account', function () {
    $superAdmin = User::factory()->create([
        'role' => 'administrasi',
    ]);

    $response = $this->actingAs($superAdmin)->delete("/admin/users/{$superAdmin->id}");

    $response->assertSessionHas('error');
    $this->assertDatabaseHas('users', [
        'id' => $superAdmin->id,
    ]);
});
