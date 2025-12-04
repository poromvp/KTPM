const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",

    setupNodeEvents(on, config) {
      // No plugin needed for basic mochawesome
      return config;
    },

    // Video & Screenshot settings
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",

    // SIMPLE APPROACH: Use mochawesome directly
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/results",
      overwrite: false,
      html: false, // Generate HTML sau, không phải trong test
      json: true, // Chỉ generate JSON
      timestamp: "mmddyyyy_HHMMss",
    },

    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,

    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
