import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    
    // Test configuration
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    env: {
      // Test environment variables
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    
    setupNodeEvents(on, config) {
      // Node event listeners
      
      // Task for database setup/teardown if needed
      on('task', {
        'db:seed': () => {
          // Seed test data
          return null;
        },
        'db:cleanup': () => {
          // Clean up test data
          return null;
        },
      });
      
      // Code coverage setup (if using @cypress/code-coverage)
      // require('@cypress/code-coverage/task')(on, config);
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});