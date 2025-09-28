// Verifies Sidebar widget behavior:
//  clicking Profile / Notifications / Settings opens the correct PopUp
//  clicking Folder routes to /main
//  clicking LogOut calls onLogout and routes to /login (disables backstep without relogin)

// mock react-router-dom's useNavigate to assert what it was called with, without using functionality


import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "../Sidebar";

// mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
// mock NavLink too
jest.mock("react-router-dom", () => ({
  NavLink: ({ children, ...rest }) => <a {...rest}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockReset();
});

describe("Sidebar", () => {
  test("Profile opens the Profile PopUp", async () => {
    const user = userEvent.setup();
    render(<Sidebar onLogout={jest.fn()} />);

    // find the Profile img and click its wrapping button
    const img = screen.getByRole("img", { name: /profile/i });
    const btn = img.closest("button") ?? screen.getByRole("button", { name: /profile/i });

    await user.click(btn);

    // PopUp should render with title "Profile"
    expect(screen.getByText(/^profile$/i)).toBeInTheDocument();
    expect(screen.getByText(/view and edit your profile information here/i)).toBeInTheDocument();

  });

  test("Notifications opens the Notifications PopUp", async () => {
    const user = userEvent.setup();
    render(<Sidebar onLogout={jest.fn()} />);

    const img = screen.getByRole("img", { name: /notifications?/i });
    const btn = img.closest("button") ?? screen.getByRole("button", { name: /notifications?/i });

    await user.click(btn);

    expect(screen.getByText(/^notifications$/i)).toBeInTheDocument();
    expect(screen.getByText(/check your latest notifications/i)).toBeInTheDocument();
  });

  test("Settings opens the Settings PopUp", async () => {
    const user = userEvent.setup();
    render(<Sidebar onLogout={jest.fn()} />);

    const img = screen.getByRole("img", { name: /settings/i });
    const btn = img.closest("button") ?? screen.getByRole("button", { name: /settings/i });

    await user.click(btn);

    expect(screen.getByText(/^settings$/i)).toBeInTheDocument();
    expect(screen.getByText(/change your application settings here/i)).toBeInTheDocument();
  });

  test("Folder navigates to /main", async () => {
    const user = userEvent.setup();
    render(<Sidebar onLogout={jest.fn()} />);

    const img = screen.getByRole("img", { name: /folder/i });
    const btn = img.closest("button") ?? screen.getByRole("button", { name: /folder/i });

    await user.click(btn);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/main");
  });

  test("LogOut calls onLogout and navigates to /login (disables backstep without relogin)", async () => {
    const user = userEvent.setup();
    const onLogout = jest.fn();
    render(<Sidebar onLogout={onLogout} />);

    const img = screen.getByRole("img", { name: /logout/i });
    const btn = img.closest("button") ?? screen.getByRole("button", { name: /logout/i });

    await user.click(btn);

    // onLogout should be called
    expect(onLogout).toHaveBeenCalledTimes(1);

    // navigate("/login", { replace: true }) should be called
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });
});
