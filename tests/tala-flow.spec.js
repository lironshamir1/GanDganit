import { test, expect } from '@playwright/test';

test.describe('TALA Tool — Full Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/tala.html');
  });

  test('page loads with correct title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/תל"א/);
    await expect(page.locator('.pw-title')).toHaveText('בניית מטרות ויעדים');
    await expect(page.locator('.pw-feedback-banner')).toBeVisible();
  });

  test('step 1 — select age and domains', async ({ page }) => {
    // Select age 4
    await page.click('.pw-age-btn:nth-child(2)');
    await expect(page.locator('.pw-age-btn.selected')).toHaveText('4');

    // Select cognitive domain
    await page.click('.pw-domain-chip:first-child');
    await expect(page.locator('.pw-domain-chip.selected')).toHaveCount(1);

    // Domain card appears with milestones
    await expect(page.locator('.pw-card')).toHaveCount(1);
    await expect(page.locator('.pw-milestones')).toBeVisible();

    // Continue button is disabled until notes are written
    await expect(page.locator('#btn-next-step')).toBeDisabled();
  });

  test('step 1 — write notes enables continue button', async ({ page }) => {
    // Select age and domain
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');

    // Write in strengths textarea
    const textarea = page.locator('.pw-textarea').first();
    await textarea.fill('מזהה 3 צבעים, סופר עד 5');

    // Button should now be enabled
    await expect(page.locator('#btn-next-step')).toBeEnabled();
  });

  test('step 1 — multiple domains can be selected', async ({ page }) => {
    await page.click('.pw-age-btn:nth-child(2)');

    // Select cognitive and motor
    await page.click('.pw-domain-chip:nth-child(1)');
    await page.click('.pw-domain-chip:nth-child(4)');
    await expect(page.locator('.pw-domain-chip.selected')).toHaveCount(2);
    await expect(page.locator('.pw-card')).toHaveCount(2);
  });

  test('step 2 — smart recommendations based on notes', async ({ page }) => {
    // Set up: age 4, cognitive domain
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');

    // Write notes about colors and counting (should trigger cognitive goal recommendations)
    const strengthsTextarea = page.locator('.pw-textarea').first();
    await strengthsTextarea.fill('מזהה 2 צבעים בסיסיים');

    const toStrengthenTextarea = page.locator('.pw-textarea').nth(1);
    await toStrengthenTextarea.fill('קשב נמוך, קושי בריכוז למשימות, לא מצליח להשלים פאזל');

    // Navigate to goals step
    await page.click('#btn-next-step');

    // Should see recommended section
    await expect(page.locator('.pw-sugg-section-label')).toBeVisible();
    await expect(page.locator('.pw-sugg-chip.recommended')).toHaveCount.greaterThan
    const recommendedChips = page.locator('.pw-sugg-chip.recommended');
    const count = await recommendedChips.count();
    expect(count).toBeGreaterThan(0);
  });

  test('step 2 — add goal shows refinement before objectives', async ({ page }) => {
    // Set up: age 4, cognitive domain, write notes
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');
    await page.locator('.pw-textarea').first().fill('מזהה 3 צבעים');

    // Go to goals step
    await page.click('#btn-next-step');

    // Click first suggestion to add a goal
    await page.locator('.pw-sugg-chip').first().click();

    // Goal card should appear
    await expect(page.locator('.pw-goal-card')).toHaveCount(1);

    // Refinement textarea should be visible
    await expect(page.locator('.pw-refinement')).toBeVisible();
    await expect(page.locator('.pw-refinement-label')).toHaveText('הערות לדיוק המטרה');

    // Chat section should be visible
    await expect(page.locator('.pw-chat')).toBeVisible();
    await expect(page.locator('.pw-chat-header')).toHaveText('שיח לדיוק המטרה');

    // Initial chat message from assistant should be present
    await expect(page.locator('.pw-chat-msg.assistant')).toHaveCount(1);

    // Confirm button should be visible
    await expect(page.locator('.pw-btn-confirm')).toBeVisible();

    // Objectives should NOT be visible yet
    await expect(page.locator('.pw-obj-list')).toHaveCount(0);
  });

  test('step 2 — confirm goal reveals objectives', async ({ page }) => {
    // Set up and navigate to goals
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');
    await page.locator('.pw-textarea').first().fill('מזהה 3 צבעים');
    await page.click('#btn-next-step');

    // Add a goal
    await page.locator('.pw-sugg-chip').first().click();

    // Objectives not visible
    await expect(page.locator('.pw-obj-list')).toHaveCount(0);

    // Click confirm
    await page.click('.pw-btn-confirm');

    // Now objectives should be visible
    await expect(page.locator('.pw-obj-list')).toHaveCount(1);
    await expect(page.locator('.pw-obj-item')).toHaveCount.greaterThan
    const objItems = page.locator('.pw-obj-item');
    const objCount = await objItems.count();
    expect(objCount).toBeGreaterThan(0);

    // Confirm button should be gone, edit link should appear
    await expect(page.locator('.pw-btn-confirm')).toHaveCount(0);
    await expect(page.locator('.pw-edit-goal-link')).toBeVisible();
  });

  test('step 2 — edit goal hides objectives again', async ({ page }) => {
    // Set up, navigate, add goal, confirm
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');
    await page.locator('.pw-textarea').first().fill('מזהה 3 צבעים');
    await page.click('#btn-next-step');
    await page.locator('.pw-sugg-chip').first().click();
    await page.click('.pw-btn-confirm');

    // Objectives visible
    await expect(page.locator('.pw-obj-list')).toHaveCount(1);

    // Click edit
    await page.click('.pw-edit-goal-link');

    // Objectives hidden again
    await expect(page.locator('.pw-obj-list')).toHaveCount(0);
    await expect(page.locator('.pw-btn-confirm')).toBeVisible();
  });

  test('step 2 — refinement notes persist', async ({ page }) => {
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');
    await page.locator('.pw-textarea').first().fill('מזהה 3 צבעים');
    await page.click('#btn-next-step');
    await page.locator('.pw-sugg-chip').first().click();

    // Write refinement note
    await page.locator('.pw-refinement-textarea').fill('הילד מזהה רק אדום וכחול, צריך להגיע ל-6 צבעים');

    // Confirm goal
    await page.click('.pw-btn-confirm');

    // Reopen goal
    await page.click('.pw-edit-goal-link');

    // Refinement notes should still be there
    await expect(page.locator('.pw-refinement-textarea')).toHaveValue('הילד מזהה רק אדום וכחול, צריך להגיע ל-6 צבעים');
  });

  test('step 2 — chat UI has input and send button', async ({ page }) => {
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');
    await page.locator('.pw-textarea').first().fill('מזהה 3 צבעים');
    await page.click('#btn-next-step');
    await page.locator('.pw-sugg-chip').first().click();

    // Chat input and send button
    await expect(page.locator('.pw-chat-input')).toBeVisible();
    await expect(page.locator('.pw-chat-send')).toBeVisible();

    // Type a message
    await page.locator('.pw-chat-input').fill('האם המטרה מתאימה לילד בן 4?');

    // Send button should be clickable
    await expect(page.locator('.pw-chat-send')).toBeEnabled();
  });

  test('step 2 — objective checkboxes toggle selection', async ({ page }) => {
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');
    await page.locator('.pw-textarea').first().fill('מזהה 3 צבעים');
    await page.click('#btn-next-step');
    await page.locator('.pw-sugg-chip').first().click();
    await page.click('.pw-btn-confirm');

    // All objectives selected by default
    const checkboxes = page.locator('.pw-obj-checkbox');
    const total = await checkboxes.count();
    expect(total).toBeGreaterThan(0);

    // Uncheck first objective
    await checkboxes.first().uncheck();
    await expect(page.locator('.pw-obj-item.unselected')).toHaveCount(1);
  });

  test('step 3 — preview shows selected goals', async ({ page }) => {
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');
    await page.locator('.pw-textarea').first().fill('מזהה 3 צבעים');
    await page.click('#btn-next-step');
    await page.locator('.pw-sugg-chip').first().click();
    await page.click('.pw-btn-confirm');

    // Navigate to preview
    const previewBtn = page.locator('.pw-btn-primary').last();
    await previewBtn.click();

    // Preview should show the goal
    await expect(page.locator('.pv-goal')).toHaveCount(1);
    await expect(page.locator('.pv-obj-table')).toBeVisible();

    // Export buttons visible
    await expect(page.locator('button:has-text("העתק טקסט")')).toBeVisible();
    await expect(page.locator('button:has-text("הורד Word")')).toBeVisible();
  });

  test('step navigation — progress bar allows navigation', async ({ page }) => {
    // Complete step 1
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child');
    await page.locator('.pw-textarea').first().fill('מזהה 3 צבעים');
    await page.click('#btn-next-step');

    // Should be on step 2
    await expect(page.locator('.pw-sugg-chip').first()).toBeVisible();

    // Click step 1 in progress bar to go back
    await page.locator('.pw-progress-step').first().click();

    // Should be back on step 1
    await expect(page.locator('.pw-domain-picker')).toBeVisible();

    // Notes should persist
    await expect(page.locator('.pw-textarea').first()).toHaveValue('מזהה 3 צבעים');
  });

  test('full flow — end to end', async ({ page }) => {
    // Step 1: Assessment
    await page.click('.pw-age-btn:nth-child(2)');
    await page.click('.pw-domain-chip:first-child'); // cognitive
    await page.locator('.pw-textarea').first().fill('מזהה 2 צבעים, סופר עד 3');
    await page.locator('.pw-textarea').nth(1).fill('קשב נמוך, קושי במיון וזיהוי צורות');

    // Move to step 2
    await page.click('#btn-next-step');

    // Step 2: Goal selection — should see recommendations
    const recommended = page.locator('.pw-sugg-chip.recommended');
    const recCount = await recommended.count();
    expect(recCount).toBeGreaterThan(0);

    // Pick first recommended goal
    await recommended.first().click();

    // Goal card visible with chat
    await expect(page.locator('.pw-goal-card')).toHaveCount(1);
    await expect(page.locator('.pw-chat')).toBeVisible();

    // Write refinement note
    await page.locator('.pw-refinement-textarea').fill('להתמקד בזיהוי צורות בסיסיות');

    // Confirm goal
    await page.click('.pw-btn-confirm');

    // Objectives visible
    const objectives = page.locator('.pw-obj-item');
    expect(await objectives.count()).toBeGreaterThan(0);

    // Uncheck last 2 objectives to keep 4
    const totalObj = await objectives.count();
    if (totalObj > 4) {
      for (let i = totalObj - 1; i >= 4; i--) {
        await page.locator('.pw-obj-checkbox').nth(i).uncheck();
      }
    }

    // Move to step 3: Preview
    await page.locator('.pw-btn-primary').last().click();

    // Preview visible with table
    await expect(page.locator('.pv-goal')).toHaveCount(1);
    await expect(page.locator('.pv-obj-table tbody tr')).toHaveCount(4);

    // Back to editing works
    await page.click('button:has-text("חזרה לעריכה")');
    await expect(page.locator('.pw-goal-card')).toHaveCount(1);
  });
});
