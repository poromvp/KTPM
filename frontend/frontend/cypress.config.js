const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Đảm bảo React của bạn đang chạy ở port 3000
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
