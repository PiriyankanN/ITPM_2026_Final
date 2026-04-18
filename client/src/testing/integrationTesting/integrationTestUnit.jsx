import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";

export function renderApp(initialRoute = "/", { user, token } = {}) {
  localStorage.clear();

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  if (token) {
    localStorage.setItem("token", token);
  }

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
}