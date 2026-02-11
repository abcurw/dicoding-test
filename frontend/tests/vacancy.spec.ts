import { test, expect } from '@playwright/test';

test.describe('Vacancy List Page', () => {
  test('user opens the vacancies list page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Temukan lowongan yang')).toBeVisible();
    await expect(page.locator('text=Daftar Pekerjaan Terbaru')).toBeVisible();
    await expect(page.locator('[href^="/vacancies/"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Dicoding Indonesia').first()).toBeVisible();
  });

  test('user searches a job by title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[href^="/vacancies/"]').first()).toBeVisible({ timeout: 10000 });
    const searchInput = page.locator('input[placeholder*="Pekerjaan apa yang sedang kamu cari"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Developer');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Hasil Pencarian')).toBeVisible();
    const jobCards = page.locator('[href^="/vacancies/"]');
    const count = await jobCards.count();
    expect(count).toBeGreaterThan(0);
    await expect(page.locator('text=Developer').first()).toBeVisible();
  });

  test('user views vacancy details', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[href^="/vacancies/"]').first()).toBeVisible({ timeout: 10000 });
    const firstVacancy = page.locator('[href^="/vacancies/"]').first();
    await firstVacancy.click();
    await page.waitForURL(/\/vacancies\/\d+/);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('.text-blue-600').first()).toBeVisible();
    await expect(page.locator('text=Job Description').or(page.locator('text=Deskripsi Pekerjaan'))).toBeVisible();
    await expect(page.locator('text=Informasi Tambahan')).toBeVisible();
    await expect(page.locator('text=Kembali ke daftar lowongan')).toBeVisible();
  });
});

test.describe('Dashboard Page', () => {
  test('recruiter can view dashboard with vacancy list', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Lowongan Saya' })).toBeVisible();
    await expect(page.locator('text=Buat lowongan').first()).toBeVisible();
    await expect(page.locator('text=Edit').first()).toBeVisible({ timeout: 10000 });
  });

  test('recruiter can navigate to create vacancy page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('text=Buat lowongan').first().click();
    await page.waitForURL('/dashboard/create');
    await expect(page.locator('text=Buat lowongan pekerjaan')).toBeVisible();
    await expect(page.locator('input[name="title"]')).toBeVisible();
  });
});

test.describe('Create Vacancy Page', () => {
  test('form displays all required fields', async ({ page }) => {
    await page.goto('/dashboard/create');
    await expect(page.getByText('Judul lowongan', { exact: false })).toBeVisible();
    await expect(page.getByText('Tipe pekerjaan', { exact: false })).toBeVisible();
    await expect(page.getByText('Kandidat yang dibutuhkan', { exact: false })).toBeVisible();
    await expect(page.getByText('Aktif hingga', { exact: false })).toBeVisible();
    await expect(page.locator('label:has-text("Lokasi")')).toBeVisible();
    await expect(page.locator('label:has-text("Deskripsi")')).toBeVisible();
  });
});