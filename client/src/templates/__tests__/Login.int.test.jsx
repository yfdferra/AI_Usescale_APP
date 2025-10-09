// Integration test for the Login page

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";  // instead of useNavigate, we use MemoryRouter that keeps history track in memory to mock
import Login from "../Login";

// mock fetch for /login
beforeEach(() => {
  global.fetch = jest.fn(async (url, options) => {  // dynamic mock (fetch) that checks username/password input
    // extract form data from body
    const formData = Object.fromEntries(options.body.entries());

    if (formData.username === "admin" && formData.password === "admin") {
      return {
        json: async () => ({
          logged_in: true,
          user_id: "admin",
          user_type: "admin",
        }),
      };
    }

    // if there's no match: login failed (only testing admin/admin for now)
    return {
      json: async () => ({ logged_in: false }),
    };
  });
});
afterEach(() => {
  jest.resetAllMocks();
});

test("successful login navigates to /main and calls onLogin", async () => {
  const user = userEvent.setup();  // simulate real user clicks and typing 
  const mockOnLogin = jest.fn();  // mock callback for the onLogin

  // mock fetch response
  fetch.mockResolvedValueOnce({
    json: async () => ({ logged_in: true, user_id: "admin", user_type: "admin" })
  });

  render(  // render Login page with a mock router setup
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login onLogin={mockOnLogin} />} />  {/* Simulate starting from /login */}
        <Route path="/main" element={<div>Main Page</div>} />
      </Routes>
    </MemoryRouter>
  );

  await user.type(screen.getByPlaceholderText(/username/i), "admin");  // fill in username and password and click next
  await user.type(screen.getByPlaceholderText(/password/i), "admin");
  await user.click(screen.getByRole("button", { name: /next/i }));  

  // check if onLogin was called with correct values
  await waitFor(() =>
    expect(mockOnLogin).toHaveBeenCalledWith("admin", "admin")
  );

  // check if navigation worked
  expect(await screen.findByText(/Main Page/i)).toBeInTheDocument();
});

test("failed login shows alert", async () => {
  const user = userEvent.setup();
  window.alert = jest.fn();

  render(
    <MemoryRouter>
      <Login onLogin={jest.fn()} />
    </MemoryRouter>
  );

  await user.type(screen.getByPlaceholderText(/username/i), "GlennQuagmire");
  await user.type(screen.getByPlaceholderText(/password/i), "GiggityGiggity");
  await user.click(screen.getByRole("button", { name: /next/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith("Incorrect Username/Password");
  });
});
