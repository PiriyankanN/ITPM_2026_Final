import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BusRouteForm from "../../components/BusRouteForm";

async function fillValidRouteForm(user) {
  await user.type(screen.getByLabelText(/Route Name/i), "Campus Loop");
  await user.type(screen.getByLabelText(/Start Location/i), "North Gate");
  await user.type(screen.getByLabelText(/End Location/i), "Library");
  await user.type(screen.getByLabelText(/Main Stops/i), "Stop A, Stop B, Stop C");
  await user.type(screen.getByLabelText(/Nearby Landmark/i), "Clock Tower");
}

describe("BusRouteForm", () => {
  const submitRouteForm = () => {
    fireEvent.submit(screen.getByRole("button", { name: /Add Route/i }).closest("form"));
  };

  it("does not submit when route name is missing", async () => {
    const onSubmit = vi.fn();
    render(<BusRouteForm onSubmit={onSubmit} />);

    submitRouteForm();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not submit when start location is missing", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BusRouteForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Route Name/i), "Campus Loop");
    submitRouteForm();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not submit when end location is missing", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BusRouteForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Route Name/i), "Campus Loop");
    await user.type(screen.getByLabelText(/Start Location/i), "North Gate");
    submitRouteForm();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not submit when main stops are missing", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BusRouteForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Route Name/i), "Campus Loop");
    await user.type(screen.getByLabelText(/Start Location/i), "North Gate");
    await user.type(screen.getByLabelText(/End Location/i), "Library");
    submitRouteForm();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits parsed stops as an array", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BusRouteForm onSubmit={onSubmit} />);

    await fillValidRouteForm(user);
    submitRouteForm();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        mainStops: ["Stop A", "Stop B", "Stop C"]
      })
    );
  });

  it("trims whitespace around each stop", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BusRouteForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Route Name/i), "Campus Loop");
    await user.type(screen.getByLabelText(/Start Location/i), "North Gate");
    await user.type(screen.getByLabelText(/End Location/i), "Library");
    await user.type(screen.getByLabelText(/Main Stops/i), " Stop A ,  Stop B  , Stop C ");
    await user.type(screen.getByLabelText(/Nearby Landmark/i), "Clock Tower");
    submitRouteForm();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        mainStops: ["Stop A", "Stop B", "Stop C"]
      })
    );
  });

  it("filters empty stops from comma-separated input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BusRouteForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Route Name/i), "Campus Loop");
    await user.type(screen.getByLabelText(/Start Location/i), "North Gate");
    await user.type(screen.getByLabelText(/End Location/i), "Library");
    await user.type(screen.getByLabelText(/Main Stops/i), "Stop A, , Stop C,,");
    await user.type(screen.getByLabelText(/Nearby Landmark/i), "Clock Tower");
    submitRouteForm();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        mainStops: ["Stop A", "Stop C"]
      })
    );
  });

  it("resets the form after successful submit", async () => {
    const user = userEvent.setup();
    render(<BusRouteForm onSubmit={vi.fn()} />);

    await fillValidRouteForm(user);
    submitRouteForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/Route Name/i)).toHaveValue("");
      expect(screen.getByLabelText(/Main Stops/i)).toHaveValue("");
    });
  });

  it("submits after previously invalid state once required data is provided", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BusRouteForm onSubmit={onSubmit} />);

    submitRouteForm();
    await user.type(screen.getByLabelText(/Route Name/i), "Campus Loop");
    await user.type(screen.getByLabelText(/Start Location/i), "North Gate");
    await user.type(screen.getByLabelText(/End Location/i), "Library");
    await user.type(screen.getByLabelText(/Main Stops/i), "Stop A");
    await user.type(screen.getByLabelText(/Nearby Landmark/i), "Clock Tower");
    submitRouteForm();

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("passes the nearby landmark through unchanged", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BusRouteForm onSubmit={onSubmit} />);

    await fillValidRouteForm(user);
    submitRouteForm();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        nearbyLandmark: "Clock Tower"
      })
    );
  });
});