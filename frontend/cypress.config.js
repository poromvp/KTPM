// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Đảm bảo React của bạn đang chạy ở port 3000
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,

    // Retry failed tests
    retries: {
      runMode: 2, // Retry 2 lần khi chạy CI
      openMode: 0, // Không retry khi chạy local
    },

    // Reporter configuration cho HTML reports
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/results",
      overwrite: false,
      html: false,
      json: true,
      timestamp: "mmddyyyy_HHMMss",
      charts: true,
      reportPageTitle: "Cypress Test Report",
      embeddedScreenshots: true,
      inlineAssets: true,
    },

    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Clear reports before test run
      on("before:run", () => {
        const fs = require("fs");
        const path = require("path");
        const reportsDir = path.join(__dirname, "cypress/results");

        if (fs.existsSync(reportsDir)) {
          fs.rmSync(reportsDir, { recursive: true, force: true });
        }
        fs.mkdirSync(reportsDir, { recursive: true });
      });

      return config;
    },
  },

  env: {
    // Có thể thêm environment variables ở đây
    apiUrl: "http://localhost:3000/api",
  },
});
