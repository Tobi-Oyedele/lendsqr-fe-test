import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("negative: disables submit when invalid and shows errors on blur", async () => {
    const user = userEvent.setup();
    renderLogin();

    const loginBtn = screen.getByRole("button", { name: /log in/i });
    expect(loginBtn).toBeDisabled();

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Trigger onBlur for email
    await user.click(emailInput);
    await user.tab(); // moves focus away -> blur

    expect(screen.getByText("Email is required")).toBeInTheDocument();

    // Trigger onBlur for password
    await user.click(passwordInput);
    await user.tab();

    expect(screen.getByText("Password is required")).toBeInTheDocument();

    // No session created
    expect(localStorage.getItem("auth_session")).toBeNull();
  });

  it("negative: rejects invalid email format", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText("Email"), "admin@");
    await user.type(screen.getByPlaceholderText("Password"), "Aa1!aaaa");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(localStorage.getItem("auth_session")).toBeNull();
  });

  it("negative: rejects weak password", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText("Email"), "admin@gmail.com");
    await user.type(screen.getByPlaceholderText("Password"), "password");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      screen.getByText(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      )
    ).toBeInTheDocument();

    expect(localStorage.getItem("auth_session")).toBeNull();
  });

  it("positive: logs in with valid credentials, stores session, and navigates to dashboard", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText("Email"), "admin@gmail.com");
    await user.type(screen.getByPlaceholderText("Password"), "Aa1!aaaa");

    await user.click(screen.getByRole("button", { name: /log in/i }));

    // because you have a 400ms delay in onSubmit, wait for navigation
    expect(await screen.findByText("Dashboard Page")).toBeInTheDocument();

    const sessionRaw = localStorage.getItem("auth_session");
    expect(sessionRaw).not.toBeNull();

    const session = JSON.parse(sessionRaw as string);
    expect(session.email).toBe("admin@gmail.com");
    expect(session.token).toBe("mock-token");
    expect(typeof session.createdAt).toBe("number");
  });

  it("positive: toggles password visibility", async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("positive: shows inline helper text when clicking forgot password", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(
      screen.getByRole("button", { name: /forgot password\?/i })
    );

    expect(
      screen.getByText("Password recovery is not available in this assessment.")
    ).toBeInTheDocument();
  });
});
