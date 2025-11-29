// cypress/e2e/product.cy.js

import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";

describe("Product Management Tests", () => {
  const productPage = new ProductPage();
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
    loginPage.login("test@example.com", "test123");
    cy.url().should("include", "/products");
  });

  describe("UI Display", () => {
    it("should display main page elements", () => {
      productPage.verifyPageTitleVisible();
      productPage.verifySearchInputVisible();
      productPage.verifyAddButtonVisible();
    });

    it("should open add product form", () => {
      productPage.clickAddButton();
      productPage.verifyFormModalVisible();
      productPage.verifyFormTitle("Thêm Sản Phẩm Mới");
    });
  });

  describe("Add Product - Validation", () => {
    beforeEach(() => {
      productPage.clickAddButton();
    });

    // Name validation
    it("should validate name - empty", () => {
      productPage.fillPrice("1000000");
      productPage.fillQuantity("10");
      productPage.clickSubmit();
      productPage.verifyNameErrorText("Tên sản phẩm là bắt buộc");
    });

    it("should validate name - too short (< 2 chars)", () => {
      productPage.fillName("a");
      productPage.clickSubmit();
      productPage.verifyNameErrorText("Tên sản phẩm phải có ít nhất 2 ký tự");
    });

    it("should validate name - too long (> 100 chars)", () => {
      productPage.fillName("a".repeat(101));
      productPage.clickSubmit();
      productPage.verifyNameErrorText(
        "Tên sản phẩm không được vượt quá 100 ký tự"
      );
    });

    // Category validation
    it("should validate category - not selected", () => {
      productPage.fillName("iPhone 15");
      productPage.fillPrice("1000000");
      productPage.fillQuantity("10");
      productPage.clickSubmit();
      productPage.verifyCategoryErrorText("Danh mục là bắt buộc");
    });

    // Price validation
    it("should validate price - empty", () => {
      productPage.fillName("iPhone 15");
      productPage.selectCategory("iphone");
      productPage.clickSubmit();
      productPage.verifyPriceErrorText("Giá là bắt buộc");
    });

    it("should validate price - negative", () => {
      productPage.fillName("iPhone 15");
      productPage.selectCategory("iphone");
      productPage.fillPrice("-100");
      productPage.clickSubmit();
      productPage.verifyPriceErrorText("Giá không được là số âm");
    });

    it("should validate price - exceeds 1 billion", () => {
      productPage.fillName("iPhone 15");
      productPage.selectCategory("iphone");
      productPage.fillPrice("1000000001");
      productPage.clickSubmit();
      productPage.verifyPriceErrorText("Giá không được vượt quá 1 tỷ");
    });

    // Quantity validation
    it("should validate quantity - empty", () => {
      productPage.fillName("iPhone 15");
      productPage.selectCategory("iphone");
      productPage.fillPrice("1000000");
      productPage.clickSubmit();
      productPage.verifyQuantityErrorText("Số lượng là bắt buộc");
    });

    it("should validate quantity - negative", () => {
      productPage.fillName("iPhone 15");
      productPage.selectCategory("iphone");
      productPage.fillPrice("1000000");
      productPage.fillQuantity("-5");
      productPage.clickSubmit();
      productPage.verifyQuantityErrorText("Số lượng không được là số âm");
    });

    it("should validate quantity - decimal number", () => {
      productPage.fillName("iPhone 15");
      productPage.selectCategory("iphone");
      productPage.fillPrice("1000000");
      productPage.fillQuantity("10.5");
      productPage.clickSubmit();
      productPage.verifyQuantityErrorText("Số lượng phải là số nguyên");
    });

    it("should validate quantity - exceeds 1 million", () => {
      productPage.fillName("iPhone 15");
      productPage.selectCategory("iphone");
      productPage.fillPrice("1000000");
      productPage.fillQuantity("1000001");
      productPage.clickSubmit();
      productPage.verifyQuantityErrorText(
        "Số lượng không được vượt quá 1 triệu"
      );
    });

    it("should clear error when user types", () => {
      productPage.clickSubmit();
      productPage.verifyNameErrorVisible();
      productPage.nameInput.type("i");
      productPage.verifyNameErrorNotExist();
    });
  });

  describe("Add Product - Success", () => {
    it("should create product successfully", () => {
      const timestamp = Date.now();
      const productName = `Test Product ${timestamp}`;

      productPage.clickAddButton();
      productPage.setupAlertStub();

      productPage.submitProductForm({
        name: productName,
        category: "iphone",
        description: "Test description",
        price: "25000000",
        quantity: "50",
      });

      productPage.verifyAlertCalled("Thêm sản phẩm thành công!");
      productPage.verifyFormModalNotVisible();
      productPage.verifyProductExists(productName);
    });

    it("should accept valid boundary values", () => {
      const timestamp = Date.now();
      productPage.clickAddButton();
      productPage.setupAlertStub();

      productPage.submitProductForm({
        name: `aa`,
        category: "iphone",
        price: "1000000000", // exactly 1 billion
        quantity: "0", // zero is valid
      });

      productPage.verifyAlertCalled("Thêm sản phẩm thành công!");
    });
  });

  describe("Edit Product", () => {
    let testProductName;

    beforeEach(() => {
      const timestamp = Date.now();
      testProductName = `Edit ${timestamp}`;

      productPage.clickAddButton();
      productPage.submitProductForm({
        name: testProductName,
        category: "iphone",
        price: "10000000",
        quantity: "100",
      });
      cy.wait(1000);
    });

    it("should open edit form with correct data", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.verifyFormTitle("Sửa Sản Phẩm");
      productPage.verifyNameInputValue(testProductName);
      productPage.verifyPriceInputValue("10000000");
    });

    // Validation khi edit - Name
    it("should validate name when editing - empty", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.nameInput.clear();
      productPage.clickSubmit();
      productPage.verifyNameErrorText("Tên sản phẩm là bắt buộc");
    });

    it("should validate name when editing - too short", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.fillName("a");
      productPage.clickSubmit();
      productPage.verifyNameErrorText("Tên sản phẩm phải có ít nhất 2 ký tự");
    });

    it("should validate name when editing - too long", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.fillName("a".repeat(101));
      productPage.clickSubmit();
      productPage.verifyNameErrorText(
        "Tên sản phẩm không được vượt quá 100 ký tự"
      );
    });

    // Validation khi edit - Category
    it("should validate category when editing - not selected", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.categorySelect.select("");
      productPage.clickSubmit();
      productPage.verifyCategoryErrorText("Danh mục là bắt buộc");
    });

    // Validation khi edit - Price
    it("should validate price when editing - empty", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.priceInput.clear();
      productPage.clickSubmit();
      productPage.verifyPriceErrorText("Giá là bắt buộc");
    });

    it("should validate price when editing - negative", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.fillPrice("-5000");
      productPage.clickSubmit();
      productPage.verifyPriceErrorText("Giá không được là số âm");
    });

    it("should validate price when editing - exceeds 1 billion", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.fillPrice("1000000001");
      productPage.clickSubmit();
      productPage.verifyPriceErrorText("Giá không được vượt quá 1 tỷ");
    });

    // Validation khi edit - Quantity
    it("should validate quantity when editing - empty", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.quantityInput.clear();
      productPage.clickSubmit();
      productPage.verifyQuantityErrorText("Số lượng là bắt buộc");
    });

    it("should validate quantity when editing - negative", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.fillQuantity("-10");
      productPage.clickSubmit();
      productPage.verifyQuantityErrorText("Số lượng không được là số âm");
    });

    it("should validate quantity when editing - decimal", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.fillQuantity("15.5");
      productPage.clickSubmit();
      productPage.verifyQuantityErrorText("Số lượng phải là số nguyên");
    });

    it("should validate quantity when editing - exceeds limit", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.fillQuantity("1000001");
      productPage.clickSubmit();
      productPage.verifyQuantityErrorText(
        "Số lượng không được vượt quá 1 triệu"
      );
    });

    // Clear error when typing
    it("should clear error when user types in edit form", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.nameInput.clear();
      productPage.clickSubmit();
      productPage.verifyNameErrorVisible();

      productPage.nameInput.type("i");
      productPage.verifyNameErrorNotExist();
    });

    // Update successfully
    it("should update product successfully with valid data", () => {
      cy.contains(".product-card h3", testProductName)
        .closest(".product-card")
        .find(".btn-edit")
        .click();

      productPage.fillPrice("15000000");
      productPage.fillQuantity("75");

      cy.window().then((win) => {
        cy.stub(win, "alert").as("updateAlert");
      });

      productPage.clickSubmit();

      cy.get("@updateAlert").should(
        "have.been.calledWith",
        "Cập nhật sản phẩm thành công!"
      );

      cy.wait(500);
      productPage.verifyProductPrice(testProductName, "15.000.000");
      productPage.verifyProductQuantity(testProductName, "75");
    });
  });

  describe("Delete Product", () => {
    it("should delete product after confirmation", () => {
      const timestamp = Date.now();
      const productName = `Delete ${timestamp}`;

      productPage.clickAddButton();
      productPage.submitProductForm({
        name: productName,
        category: "ipad",
        price: "20000000",
        quantity: "30",
      });
      cy.wait(1000);

      cy.window().then((win) => {
        cy.stub(win, "confirm").returns(true);
        cy.stub(win, "alert").as("deleteAlert");
      });

      cy.contains(".product-card h3", productName)
        .closest(".product-card")
        .find(".btn-delete")
        .click();

      cy.get("@deleteAlert").should(
        "have.been.calledWith",
        "Xóa sản phẩm thành công!"
      );
      productPage.verifyProductCardNotExist(productName);
    });

    it("should NOT delete when user cancels", () => {
      const timestamp = Date.now();
      const productName = `Keep ${timestamp}`;

      productPage.clickAddButton();
      productPage.submitProductForm({
        name: productName,
        category: "ipad",
        price: "20000000",
        quantity: "30",
      });
      cy.wait(1000);

      cy.window().then((win) => {
        cy.stub(win, "confirm").returns(false);
      });

      cy.contains(".product-card h3", productName)
        .closest(".product-card")
        .find(".btn-delete")
        .click();

      productPage.verifyProductExists(productName);
    });
  });

  describe("Search Products", () => {
    it("should filter products by search term", () => {
      productPage.searchProduct("iPhone");
      cy.contains(".product-card", "iPhone").should("be.visible");
    });

    it("should show empty state when no results", () => {
      productPage.searchProduct("XYZ12345NonExistent");
      productPage.verifyEmptyStateVisible();
    });

    it("should search case-insensitively", () => {
      productPage.searchProduct("iphone");
      cy.get(".product-card").should("have.length.at.least", 1);
    });
  });

  describe("Product Status Badge", () => {
    it("should show 'Hết hàng' when quantity < 10", () => {
      const timestamp = Date.now();
      const productName = `Low ${timestamp}`;

      productPage.clickAddButton();
      productPage.setupAlertStub();
      productPage.submitProductForm({
        name: productName,
        category: "airpod",
        price: "5000000",
        quantity: "5",
      });

      productPage.verifyProductStatus(productName, "Hết hàng");
    });

    it("should show 'Còn hàng' when quantity >= 10", () => {
      const timestamp = Date.now();
      const productName = `Stock ${timestamp}`;

      productPage.clickAddButton();
      productPage.setupAlertStub();
      productPage.submitProductForm({
        name: productName,
        category: "iphone",
        price: "10000000",
        quantity: "15",
      });

      productPage.verifyProductStatus(productName, "Còn hàng");
    });
  });

  describe("Logout", () => {
    it("should logout successfully", () => {
      productPage.clickLogout();
      cy.url().should("include", "/");
      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.be.null;
      });
    });
  });
});
