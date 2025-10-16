// __tests__/App.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import App from "../App";
import PlayerForm from "../components/PlayerForm";
import PlayerList from "../components/PlayerList";
import Header from "../components/Header";

jest.mock("axios");

const mockPlayers = [
  { id: 1, playerName: "Messi", country: "Argentina", position: "Forward", age: 35, goals: 700 },
  { id: 2, playerName: "Ronaldo", country: "Portugal", position: "Forward", age: 37, goals: 750 },
  { id: 3, playerName: "Modric", country: "Croatia", position: "Midfielder", age: 36, goals: 120 },
];

// ----------------- HEADER TESTS -----------------
describe("Header Component", () => {
  test("renders title", () => {
    render(<Header />);
    expect(screen.getByText("FIFA World Cup Team Management")).toBeInTheDocument();
  });

  test("renders tagline", () => {
    render(<Header />);
    expect(screen.getByText("Add • Filter • Sort • Manage players effortlessly")).toBeInTheDocument();
  });
});

// ----------------- PLAYER FORM TESTS -----------------
describe("PlayerForm Component", () => {
  test("renders add player form", () => {
    render(<PlayerForm onAdd={jest.fn()} setError={jest.fn()} />);
    expect(screen.getByText("Add Player")).toBeInTheDocument();
  });

  test("submits new player successfully", async () => {
    axios.post.mockResolvedValue({ data: { id: 4 } });
    const onAddMock = jest.fn();

    render(<PlayerForm onAdd={onAddMock} setError={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("Player name"), { target: { value: "Neymar", name: "playerName" } });
    fireEvent.change(screen.getByPlaceholderText("Country"), { target: { value: "Brazil", name: "country" } });
    fireEvent.change(screen.getByPlaceholderText("Age"), { target: { value: "30", name: "age" } });
    fireEvent.change(screen.getByPlaceholderText("Goals"), { target: { value: "400", name: "goals" } });

    fireEvent.click(screen.getByText("Add Player"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(onAddMock).toHaveBeenCalled();
    });
  });

  test("handles API error on add", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));
    const setErrorMock = jest.fn();
    render(<PlayerForm onAdd={jest.fn()} setError={setErrorMock} />);

    fireEvent.change(screen.getByPlaceholderText("Player name"), { target: { value: "Neymar", name: "playerName" } });
    fireEvent.click(screen.getByText("Add Player"));

    await waitFor(() => expect(setErrorMock).toHaveBeenCalled());
  });

  test("loads player data for editing", async () => {
    axios.get.mockResolvedValue({ data: mockPlayers[0] });
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<PlayerForm onAdd={jest.fn()} setError={jest.fn()} editId="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("Messi"));
    expect(screen.getByDisplayValue("Messi")).toBeInTheDocument();
    expect(screen.getByText("Update Player")).toBeInTheDocument();
  });

  test("updates player successfully", async () => {
    axios.get.mockResolvedValue({ data: mockPlayers[0] });
    axios.put.mockResolvedValue({ data: { ...mockPlayers[0], goals: 705 } });
    const onAddMock = jest.fn();

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<PlayerForm onAdd={onAddMock} setError={jest.fn()} editId="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("Messi"));

    fireEvent.change(screen.getByDisplayValue("700"), { target: { value: "705", name: "goals" } });
    fireEvent.click(screen.getByText("Update Player"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      expect(onAddMock).toHaveBeenCalled();
    });
  });

  test("handles API error on update", async () => {
    axios.get.mockResolvedValue({ data: mockPlayers[0] });
    axios.put.mockRejectedValue(new Error("Update failed"));
    const setErrorMock = jest.fn();

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<PlayerForm onAdd={jest.fn()} setError={setErrorMock} editId="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("Messi"));

    fireEvent.change(screen.getByDisplayValue("700"), { target: { value: "705", name: "goals" } });
    fireEvent.click(screen.getByText("Update Player"));

    await waitFor(() => expect(setErrorMock).toHaveBeenCalled());
  });

  test("form validation: empty fields", async () => {
    const setErrorMock = jest.fn();
    render(<PlayerForm onAdd={jest.fn()} setError={setErrorMock} />);

    fireEvent.click(screen.getByText("Add Player"));
    await waitFor(() => expect(setErrorMock).toHaveBeenCalled());
  });

  test("displays success message on add/update", async () => {
    axios.post.mockResolvedValue({});
    render(<PlayerForm onAdd={jest.fn()} setError={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("Player name"), { target: { value: "Mbappe", name: "playerName" } });
    fireEvent.change(screen.getByPlaceholderText("Country"), { target: { value: "France", name: "country" } });
    fireEvent.change(screen.getByPlaceholderText("Age"), { target: { value: "24", name: "age" } });
    fireEvent.change(screen.getByPlaceholderText("Goals"), { target: { value: "100", name: "goals" } });

    fireEvent.click(screen.getByText("Add Player"));
    await waitFor(() => screen.getByText("Player added successfully"));
  });

  // ----------------- ADDITIONAL TESTS -----------------
describe("Additional Player Management Tests", () => {
  test("updates player name correctly", async () => {
    axios.get.mockResolvedValue({ data: mockPlayers[0] });
    axios.put.mockResolvedValue({ data: { ...mockPlayers[0], playerName: "Leo Messi" } });
    const onAddMock = jest.fn();

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<PlayerForm onAdd={onAddMock} setError={jest.fn()} editId="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("Messi"));
    fireEvent.change(screen.getByDisplayValue("Messi"), { target: { value: "Leo Messi", name: "playerName" } });
    fireEvent.click(screen.getByText("Update Player"));

    await waitFor(() => expect(onAddMock).toHaveBeenCalled());
  });



  test("renders success message on update", async () => {
    axios.get.mockResolvedValue({ data: mockPlayers[0] });
    axios.put.mockResolvedValue({ data: mockPlayers[0] });

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<PlayerForm onAdd={jest.fn()} setError={jest.fn()} editId="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("Messi"));
    fireEvent.click(screen.getByText("Update Player"));
    await waitFor(() => screen.getByText("Player updated successfully"));
  });

  test("handles empty country field validation", async () => {
    const setErrorMock = jest.fn();
    render(<PlayerForm onAdd={jest.fn()} setError={setErrorMock} />);
    fireEvent.change(screen.getByPlaceholderText("Player name"), { target: { value: "Test Player", name: "playerName" } });
    fireEvent.click(screen.getByText("Add Player"));
    await waitFor(() => expect(setErrorMock).toHaveBeenCalledWith("Country is required"));
  });

});

});

