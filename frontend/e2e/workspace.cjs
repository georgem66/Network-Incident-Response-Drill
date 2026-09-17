// UI-only fixture validation, not live API/database verification.
const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const scenarios = [
  { _id: 'email-triage', title: 'Suspicious inbox activity', description: 'Review synthetic mail evidence, classify the incident and document containment decisions.', severity: 'high', difficultyLevel: 'beginner', category: 'social_engineering', estimatedCompletionTime: 20, learningObjectives: ['Classify evidence', 'Document containment'] },
  { _id: 'service-outage', title: 'Unexpected service interruption', description: 'Build a timeline from sample service logs and prioritize recovery actions.', severity: 'medium', difficultyLevel: 'intermediate', category: 'web_application_attack', estimatedCompletionTime: 35, learningObjectives: ['Build a timeline', 'Prioritize recovery'] },
];
(async () => {
  const phase = process.env.PHASE || 'after';
  const output = process.env.SHOTS || '/tmp/incident-redesign';
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const [device, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.route('http://localhost:3001/api/**', route => {
        const path = new URL(route.request().url()).pathname;
        let body;
        if (path === '/api/auth/me') body = { user: { id: 1, username: 'analyst', firstName: 'Alex', role: 'student' } };
        else if (path === '/api/scenarios') body = { scenarios };
        else if (path === '/api/incidents') body = { attempts: [] };
        else if (path === '/api/scores/user') body = { stats: { scenariosCompleted: 4, bestScore: 92, averageScore: 78, totalTime: 5400 } };
        else body = {};
        return route.fulfill({ json: body });
      });
      await page.addInitScript(() => localStorage.setItem('token', 'ui-fixture-not-a-real-token'));
      await page.goto('http://127.0.0.1:4390');
      await page.getByText(phase === 'before' ? 'Available Scenarios' : 'Your next investigation', { exact: true }).waitFor();
      await page.screenshot({ path: `${output}/${phase}-${device}-dashboard.png`, fullPage: true });
      if (phase !== 'before') assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Dashboard overflows');
      await page.getByRole('button', { name: phase === 'before' ? 'View All Scenarios' : 'Browse scenarios', exact: true }).click();
      await page.getByText('Showing 2 of 2 scenarios').waitFor();
      await page.screenshot({ path: `${output}/${phase}-${device}-scenarios.png`, fullPage: true });
      await page.getByLabel('Search scenarios...').fill('inbox');
      await page.getByText('Showing 1 of 2 scenarios').waitFor();
      if (phase !== 'before') assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Scenarios overflow');
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`${device}: dashboard + scenarios + search PASS (fixture API)`);
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
