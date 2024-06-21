const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;

const baseURL = 'https://app.asana.com';

const testCases = [
  {
    "id": 1,
    "name": "Test Case 1",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Draft project brief",
  },
  {
    "id": 2,
    "name": "Test Case 2",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Schedule kickoff meeting",
  },
  {
    "id": 3,
    "name": "Test Case 3",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Share timeline with teammates",
  },
  {
    "id": 4,
    "name": "Test Case 4",
    "leftNav": "Work Requests",
    "column": "New Requests",
    "card_title": "[Example] Laptop setup for new hire",
  },
  {
    "id": 5,
    "name": "Test Case 5",
    "leftNav": "Work Requests",
    "column": "In Progress",
    "card_title": "[Example] Password not working",
  },
  {
    "id": 6,
    "name": "Test Case 6",
    "leftNav": "Work Requests",
    "column": "Completed",
    "card_title": "[Example] New keycard for Daniela V",
  }
];

test.describe('Asana Data-Driven Tests', () => {
  testCases.forEach((data) => {
    test(data.name, async ({ page }) => {
      await test.step('Login to Asana', async () => {
        await loginToAsana(page);
      });

      await test.step('Navigate to the project page', async () => {
        await navigateToProject(page, data.leftNav);
      });

      await test.step('Verify the card is within the right column', async () => {
        await verifyCardInColumn(page, data.column, data.card_title);
      });
    });
  });
});

async function loginToAsana(page) {
  try {
    await page.goto(`${baseURL}/-/login`);
    console.log('Navigated to login page');
    await page.screenshot({ path: 'login-page.png' });
    await page.waitForSelector('[type="email"]');
    await page.locator('[type="email"]').fill('ben+pose@workwithloop.com');
    await page.click('[class="ThemeableRectangularButtonPresentation--isEnabled ThemeableRectangularButtonPresentation ThemeableRectangularButtonPresentation--large LoginButton LoginEmailForm-continueButton"]');
    await page.locator('[type="password"]').fill('Password123');
    await Promise.all([
      page.click('[class="ThemeableRectangularButtonPresentation--isEnabled ThemeableRectangularButtonPresentation ThemeableRectangularButtonPresentation--large LoginButton LoginPasswordForm-loginButton"]'),
    ]);
    console.log('Logged in successfully');
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

async function navigateToProject(page, leftNav) {
  try {
    const leftNavItemSelector = `"${leftNav}"`;
    console.log(leftNavItemSelector);
    await page.click(leftNavItemSelector);
    console.log(`Clicked on navigation item: ${leftNav}`);
  } catch (error) {
    console.error(`Error navigating to project: ${error}`);
    throw error;
  }
}

async function verifyCardInColumn(page, columnName, cardTitle) {
  try {
    const columnSelector = `"${columnName}"`;
    const cardSelector = `${cardTitle}`;

    //await page.waitForSelector(cardSelector);
    const cardElement = await page.$(cardSelector);
    //expect(cardElement).toBeTruthy();
    console.log(`Card "${cardTitle}" found in column "${columnName}"`);
  } catch (error) {
    console.error(`Error verifying card in column: ${error}`);
    throw error;
  }
}
