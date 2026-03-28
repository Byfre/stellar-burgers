import { defineConfig } from 'cypress';

const TEST_URL = 'http://localhost:4000';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: TEST_URL
  }
});
