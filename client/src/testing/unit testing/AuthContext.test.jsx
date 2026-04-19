import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { AuthContext, AuthProvider } from "../../context/AuthContext";

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function ContextConsumer() {
  const { user, login, logout, updateUser } = React.useContext(AuthContext);

  return (
    <div>
      <div data-testid="user-name">{user?.name ?? "anonymous"}</div>
      <div data-testid="user-role">{user?.role ?? "none"}</div>
      <button
        onClick={() =>
          login({ name: "Sam", email: "sam@test.com", role: "user", token: "user-token" })
        }
      >
        login-user
      </button>
      <button
        onClick={() =>
          login({ name: "Admin", email: "admin@test.com", role: "admin", token: "admin-token" })
        }
      >
        login-admin
      </button>
      <button onClick={() => updateUser({ name: "Updated", phone: "0771234567" })}>
        update-user
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function renderAuthProvider() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <ContextConsumer />
        <LocationDisplay />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("AuthContext", () => {
  it("starts anonymous when storage is empty", () => {
    renderAuthProvider();

    expect(screen.getByTestId("user-name")).toHaveTextContent("anonymous");
    expect(screen.getByTestId("location")).toHaveTextContent("/");
  });

  it("restores user from localStorage when both user and token exist", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Stored", role: "user" }));
    localStorage.setItem("token", "stored-token");

    renderAuthProvider();

    expect(screen.getByTestId("user-name")).toHaveTextContent("Stored");
    expect(screen.getByTestId("user-role")).toHaveTextContent("user");
  });

  it("cleans stale user when token is missing", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Stale" }));

    renderAuthProvider();

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("cleans stale token when user payload is missing", () => {
    localStorage.setItem("token", "orphaned-token");

    renderAuthProvider();

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("removes corrupted user JSON safely", () => {
    localStorage.setItem("user", "{bad json");
    localStorage.setItem("token", "token");

    renderAuthProvider();

    expect(screen.getByTestId("user-name")).toHaveTextContent("anonymous");
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("login stores user and token for normal users", async () => {
    const user = userEvent.setup();
    renderAuthProvider();

    await user.click(screen.getByText("login-user"));

    expect(localStorage.getItem("token")).toBe("user-token");
    expect(JSON.parse(localStorage.getItem("user"))).toMatchObject({ name: "Sam", role: "user" });
    expect(screen.getByTestId("user-name")).toHaveTextContent("Sam");
  });

  it("login navigates normal users to /app", async () => {
    const user = userEvent.setup();
    renderAuthProvider();

    await user.click(screen.getByText("login-user"));

    expect(screen.getByTestId("location")).toHaveTextContent("/app");
  });

  it("login navigates admins to /admin", async () => {
    const user = userEvent.setup();
    renderAuthProvider();

    await user.click(screen.getByText("login-admin"));

    expect(screen.getByTestId("location")).toHaveTextContent("/admin");
    expect(screen.getByTestId("user-role")).toHaveTextContent("admin");
  });

  it("updateUser merges fields into the existing user and storage", async () => {
    const user = userEvent.setup();
    renderAuthProvider();

    await user.click(screen.getByText("login-user"));
    await user.click(screen.getByText("update-user"));

    expect(screen.getByTestId("user-name")).toHaveTextContent("Updated");
    expect(JSON.parse(localStorage.getItem("user"))).toMatchObject({
      name: "Updated",
      role: "user",
      phone: "0771234567"
    });
  });

  it("logout clears auth state and navigates to /login", async () => {
    const user = userEvent.setup();
    renderAuthProvider();

    await user.click(screen.getByText("login-user"));
    await user.click(screen.getByText("logout"));

    expect(screen.getByTestId("user-name")).toHaveTextContent("anonymous");
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByTestId("location")).toHaveTextContent("/login");
  });
});