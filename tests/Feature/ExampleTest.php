<?php

test('returns a successful response', function () {
    $response = $this->get('/dashboard');

    $response->assertOk();
});
