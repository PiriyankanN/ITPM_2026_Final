import { describe, expect, it } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../unit testing/testServer";
import { renderApp } from "./integrationTestUtils";

describe("frontend integration workflows", () => {
  it("logs a user in, loads dashboard recommendations, and logs out through the navbar", async () => {
    server.use(
      http.post("http://localhost:5000/api/auth/login", () =>
        HttpResponse.json({
          name: "Sam Student",
          email: "sam@test.com",
          role: "user",
          token: "auth-token"
        })
      ),
      http.get("http://localhost:5000/api/rooms/recommendations", ({ request }) => {
        expect(request.headers.get("authorization")).toBe("Bearer auth-token");

        return HttpResponse.json([
          {
            _id: "room-1",
            title: "North Hall",
            location: "Campus Road",
            locationName: "North Campus",
            description: "Quiet room near the library.",
            price: 18000,
            roomType: "Single",
            isAvailable: true,
            images: ["https://example.com/room-1.jpg"]
          }
        ]);
      })
    );

    const user = userEvent.setup();
    renderApp("/login");

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: "sam@test.com" }
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "secret123" }
    });
    await user.click(screen.getByRole("button", { name: /^Login$/i }));

    expect(await screen.findByText(/Hi, Sam/i)).toBeInTheDocument();
    expect(screen.getByText("Smart Match Recommendations")).toBeInTheDocument();
    expect(screen.getByText("North Hall")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Profile/i })).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBe("auth-token");

    await user.click(screen.getByRole("button", { name: /Logout/i }));

    expect(await screen.findByRole("heading", { name: /Welcome Back/i })).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("loads the profile form, saves updates, and shows the refreshed profile page", async () => {
    let profileFetchCount = 0;

    server.use(
      http.get("http://localhost:5000/api/users/profile", ({ request }) => {
        expect(request.headers.get("authorization")).toBe("Bearer saved-token");
        profileFetchCount += 1;

        if (profileFetchCount === 1) {
          return HttpResponse.json({
            name: "Sam Student",
            email: "sam@test.com",
            role: "user",
            phone: "0771234567",
            profileImage: "",
            address: "Old address",
            createdAt: "2026-01-15T00:00:00.000Z",
            preferences: {
              budget: 18000,
              location: "Old Town",
              roomType: "Shared"
            }
          });
        }

        return HttpResponse.json({
          name: "Sam Updated",
          email: "sam.updated@test.com",
          role: "user",
          phone: "0777654321",
          profileImage: "",
          address: "42 Palm Avenue",
          createdAt: "2026-01-15T00:00:00.000Z",
          preferences: {
            budget: 24000,
            location: "Near Campus",
            roomType: "Apartment"
          }
        });
      }),
      http.put("http://localhost:5000/api/users/profile", async ({ request }) => {
        expect(request.headers.get("authorization")).toBe("Bearer saved-token");

        const body = await request.json();
        expect(body).toMatchObject({
          name: "Sam Updated",
          email: "sam.updated@test.com",
          phone: "0777654321",
          address: "42 Palm Avenue",
          budget: "24000",
          preferredLocation: "Near Campus",
          preferredRoomType: "Apartment",
          preferences: {
            budget: 24000,
            location: "Near Campus",
            roomType: "Apartment"
          }
        });

        return HttpResponse.json({
          name: "Sam Updated",
          email: "sam.updated@test.com",
          role: "user",
          token: "saved-token",
          phone: "0777654321",
          address: "42 Palm Avenue",
          preferences: {
            budget: 24000,
            location: "Near Campus",
            roomType: "Apartment"
          }
        });
      })
    );

    const user = userEvent.setup();
    renderApp("/profile/edit", {
      user: {
        name: "Sam Student",
        email: "sam@test.com",
        role: "user",
        token: "saved-token"
      },
      token: "saved-token"
    });

    expect(await screen.findByDisplayValue("Sam Student")).toBeInTheDocument();

    const fullNameInput = screen.getByDisplayValue("Sam Student");
    const emailInput = screen.getByDisplayValue("sam@test.com");
    const phoneInput = screen.getByDisplayValue("0771234567");
    const addressInput = screen.getByDisplayValue("Old address");
    const budgetInput = screen.getByDisplayValue("18000");
    const locationInput = screen.getByDisplayValue("Old Town");
    const roomTypeSelect = screen.getByDisplayValue("Shared");

    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Sam Updated");
    await user.clear(emailInput);
    await user.type(emailInput, "sam.updated@test.com");
    await user.clear(phoneInput);
    await user.type(phoneInput, "0777654321");
    await user.clear(addressInput);
    await user.type(addressInput, "42 Palm Avenue");
    await user.clear(budgetInput);
    await user.type(budgetInput, "24000");
    await user.clear(locationInput);
    await user.type(locationInput, "Near Campus");
    await user.selectOptions(roomTypeSelect, "Apartment");
    await user.click(screen.getByRole("button", { name: /Save Account Changes/i }));

    expect(await screen.findByRole("heading", { name: "Sam Updated" })).toBeInTheDocument();
    expect(screen.getAllByText("sam.updated@test.com")).toHaveLength(2);
    expect(screen.getByText("42 Palm Avenue")).toBeInTheDocument();
    expect(screen.getByText("Rs. 24,000")).toBeInTheDocument();
    expect(screen.getByText("Apartment")).toBeInTheDocument();

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("user"))).toMatchObject({
        name: "Sam Updated",
        email: "sam.updated@test.com",
        phone: "0777654321"
      });
    });
  });

  it("moves from room details into a prefilled inquiry submission workflow", async () => {
    server.use(
      http.get("http://localhost:5000/api/rooms/room-1", () =>
        HttpResponse.json({
          _id: "room-1",
          title: "North Hall",
          location: "Campus Road",
          locationName: "North Campus",
          description: "Quiet room near the library.",
          price: 18000,
          roomType: "Single",
          isAvailable: true,
          googleMapsLink: "https://maps.example.com/north-hall",
          contactNumber: "0771234567",
          images: ["https://example.com/room-1.jpg"]
        })
      ),
      http.get("http://localhost:5000/api/rooms", () =>
        HttpResponse.json([{ _id: "room-1", title: "North Hall" }])
      ),
      http.post("http://localhost:5000/api/inquiries", async ({ request }) => {
        expect(request.headers.get("authorization")).toBe("Bearer room-token");

        const body = await request.json();
        expect(body).toMatchObject({
          subject: "Accommodation Inquiry: North Hall",
          roomId: "room-1"
        });
        expect(body.message).toContain("viewing");

        return HttpResponse.json({ referenceNumber: "REF-ROOM-1" });
      })
    );

    const user = userEvent.setup();
    renderApp("/rooms/room-1", {
      user: {
        name: "Room Hunter",
        email: "hunter@test.com",
        role: "user",
        token: "room-token"
      },
      token: "room-token"
    });

    expect(await screen.findByRole("heading", { name: "North Hall" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Send Official Inquiry/i }));

    expect(await screen.findByDisplayValue("Accommodation Inquiry: North Hall")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByText("Current Room Link Active")).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText(/Please provide specifics/i),
      "I would like to schedule a viewing and confirm whether the room is still available this week."
    );
    await user.click(screen.getByRole("button", { name: /Confirm & Submit/i }));

    expect(await screen.findByText("Ticket Confirmed!")).toBeInTheDocument();
    expect(screen.getByText("REF-ROOM-1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Track Status/i })).toHaveAttribute("href", "/my-inquiries");
  });
});