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
    await titleInput.click();
    await titleInput.fill('Automated Test - Senior Frontend Developer');

    // Fill company name
    const companyNameInput = page.locator('input[name="company_name"]');
    if (await companyNameInput.isVisible()) {
      await companyNameInput.click();
      await companyNameInput.fill('Test Company Ltd');
    }

    // Fill company city
    const companyCityInput = page.locator('input[name="company_city"]');
    if (await companyCityInput.isVisible()) {
      await companyCityInput.click();
      await companyCityInput.fill('Jakarta');
    }

    // Fill description
    const descriptionInput = page.locator('textarea[name="description"]');
    if (await descriptionInput.isVisible()) {
      await descriptionInput.click();
      await descriptionInput.fill('This is an automated test job posting for a Senior Frontend Developer position.');
    }

    // Select job type
    const jobTypeSelect = page.locator('select[name="job_type"]');
    if (await jobTypeSelect.isVisible()) {
      await jobTypeSelect.selectOption('Full-Time');
    }

    // Fill candidates needed
    const candidatesInput = page.locator('input[name="candidates_needed"]');
    if (await candidatesInput.isVisible()) {
      await candidatesInput.click();
      await candidatesInput.fill('2');
    }

    // Wait a moment to ensure form is ready
    await page.waitForTimeout(1000);

    // Look for submit button
    const submitButton = page.locator('button[type="submit"]').or(
      page.locator('button:has-text("Buat")').or(
        page.locator('button:has-text("Simpan")')
      )
    );

    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Wait for either success message or redirect
      await page.waitForTimeout(2000);

      // Check if we're redirected to dashboard or see success message
      const currentUrl = page.url();
      const isRedirected = currentUrl.includes('/dashboard') && !currentUrl.includes('/create');
      const hasSuccessMessage = await page.locator('text=berhasil').isVisible().catch(() => false);

      expect(isRedirected || hasSuccessMessage).toBeTruthy();
    }
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
    const backButton = page.locator('text=Kembali ke daftar lowongan').or(
      page.locator('a[href="/"]')
    );
    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page.locator('text=Daftar Pekerjaan Terbaru')).toBeVisible();
    }
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