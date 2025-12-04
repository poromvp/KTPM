const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);

      return config;
    },

    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,

    videosFolder: "cypress/videos",
    screenshotsFolder: "cypress/screenshots",

    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      reportDir: "cypress/results",
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      reportPageTitle: "Cypress Login Tests",
      embeddedScreenshots: true,
      inlineAssets: true,
    },

    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,

    viewportWidth: 1280,
    viewportHeight: 720,

    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
