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

  test('user can create a new vacancy with full form interaction', async ({ page }) => {
    await page.goto('/dashboard/create');

    // Fill in job title
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toBeVisible();
    await titleInput.fill('Automated Test - Senior Frontend Developer');

    // Select job type radio
    await page.locator('input[name="job_type"][value="Full-Time"]').check();

    // Fill candidates needed
    await page.locator('input[name="candidates_needed"]').fill('2');

    // Fill expired_at date
    await page.locator('input[name="expired_at"]').fill('2026-12-31');

    // Select company_city (it's a select dropdown)
    await page.locator('select[name="company_city"]').selectOption({ index: 1 });

    // Fill description
    const descriptionInput = page.locator('textarea[name="description"]');
    await descriptionInput.clear();
    await descriptionInput.fill('This is an automated test job posting for a Senior Frontend Developer position.');

    // Fill salary range
    await page.locator('input[name="salary_min"]').fill('5000000');
    await page.locator('input[name="salary_max"]').fill('10000000');

    // Select experience
    await page.locator('input[name="experience_min"][value="1-3 tahun"]').check();

    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Wait for redirect to /dashboard after successful creation
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Lowongan Saya' })).toBeVisible();
  });
});

test.describe('Blackbox E2E User Journey', () => {
  test('complete user journey - browse, search, view details, and navigate', async ({ page }) => {
    // Step 1: Land on homepage
    await page.goto('/');
    await expect(page.locator('text=Temukan lowongan yang')).toBeVisible();

    // Step 2: Verify job listings are loaded
    await expect(page.locator('[href^="/vacancies/"]').first()).toBeVisible({ timeout: 10000 });
    const initialJobCount = await page.locator('[href^="/vacancies/"]').count();
    expect(initialJobCount).toBeGreaterThan(0);

    // Step 3: Interact with search
    const searchInput = page.locator('input[placeholder*="Pekerjaan apa yang sedang kamu cari"]');
    await searchInput.click();
    await searchInput.fill('Developer');
    await page.waitForTimeout(1000);

    // Step 4: Click on first search result
    const firstJob = page.locator('[href^="/vacancies/"]').first();
    await firstJob.click();

    // Step 5: Verify detail page loaded
    await page.waitForURL(/\/vacancies\/\d+/);
    await expect(page.locator('h1').first()).toBeVisible();

    // Step 6: Navigate back to listing
    const backButton = page.getByRole('link', { name: 'Kembali ke daftar lowongan' });
    await expect(backButton).toBeVisible();
    await backButton.click();
    await expect(page.locator('text=Daftar Pekerjaan Terbaru')).toBeVisible();
  });

  test('recruiter journey - view dashboard, navigate to create form', async ({ page }) => {
    // Step 1: Go to dashboard
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Lowongan Saya' })).toBeVisible();

    // Step 2: Click create button
    const createButton = page.locator('text=Buat lowongan').first();
    await expect(createButton).toBeVisible();
    await createButton.click();

    // Step 3: Verify form page loaded
    await page.waitForURL('/dashboard/create');
    await expect(page.locator('text=Buat lowongan pekerjaan')).toBeVisible();

    // Step 4: Verify all form sections are interactive
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toBeVisible();
    await titleInput.click();
    await expect(titleInput).toBeFocused();

    // Step 5: Go back to dashboard
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Lowongan Saya' })).toBeVisible();
  });
});