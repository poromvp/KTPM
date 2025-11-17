//Câu 2.1: LOGIN - Frontend unit tests

import { validateUsername, validatePassword } from "../utils/validation";

// a. validateUsername()
describe("Test validateUsername()", () => {
  test("TC1: Username bị rỗng => lỗi", () => {
    expect(validateUsername("")).toBe("Không được để trống username");
  });

  test("TC2: Username quá ngắn (<3) => lỗi", () => {
    expect(validateUsername("la")).toBe("Username phải có ít nhất 3 ký tự");
    expect(validateUsername("1")).toBe("Username phải có ít nhất 3 ký tự");
  });

  test("TC3: Username quá dài (>50) => lỗi", () => {
    const longName = "a".repeat(51);
    expect(validateUsername(longName)).toBe("Username không được vượt quá 50 ký tự");
  });

  test("TC4: Username có ký tự đặc biệt không hợp lệ => lỗi", () => {
    expect(validateUsername("ngan!@#")).toBe("Username không được chứa ký tự đặc biệt");
  });

  test("TC5: Username hợp lệ => không lỗi", () => {
    expect(validateUsername("valid_user123")).toBe("");
  });
});

// b. validatePassword()
describe("Test validatePassword()", () => {
  test("TC6: Password bị rỗng => lỗi", () => {
    expect(validatePassword("")).toBe("Mật khẩu không được để trống");
  });

  test("TC7: Password quá ngắn (<6) => lỗi", () => {
    expect(validatePassword("5421")).toBe("Mật khẩu phải có ít nhất 6 ký tự");
  });

  test("TC8: Password quá dài (>20) => lỗi", () => {
    const longPassword = "a".repeat(22);
    expect(validatePassword(longPassword)).toBe("Mật khẩu không được vượt quá 20 ký tự");
  });

  test("TC9: Password không có số => lỗi", () => {
    expect(validatePassword("abcdef")).toBe("Mật khẩu phải chứa cả chữ cái và số");
  });

  test("TC10: Password không có chữ cái => lỗi", () => {
    expect(validatePassword("1234567")).toBe("Mật khẩu phải chứa cả chữ cái và số");
  });

  test("TC11: Password hợp lệ => không lỗi", () => {
    expect(validatePassword("lap1234")).toBe("");
  });
  
});

// const MockTest = () => {
//   <BrowserRouter>
//     <Login/>
//   </BrowserRouter>
// }

// describe('', () => {
//   test('', async () => {
//     render(<MockTest/>)
//   })
// })