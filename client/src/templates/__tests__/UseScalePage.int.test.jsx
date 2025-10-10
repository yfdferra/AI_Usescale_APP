// Integration test for UseScalePage
// verifies that fetched data populates TableSection and HorizontalSidebar properly

import { render, screen, waitFor, act } from "@testing-library/react";
import UseScalePage from "../UseScalePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// silence React & fetch error logs: does not interfere with test accuracy
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});
afterAll(() => {
  console.error.mockRestore();
  console.log.mockRestore();
});


// mock child components in UseScalePage
jest.mock("../../components/Sidebar", () => {
  return function MockSidebar() {
    return <div data-testid="sidebar" />;
  };
});

jest.mock("../../components/TableSection", () => ({ tableData }) => (
  <div data-testid="table-section">
    {tableData?.map((row, col) => <div key={col}>{row.ai_title || "Empty Row"}</div>)}
  </div>
));

jest.mock("../../components/HorizontalSidebar", () => ({ children }) => (
  <div data-testid="horizontal-sidebar">{children}</div>
));

jest.mock("../../components/VerticalDropdown", () => ({ title, children }) => (
  <div data-testid="vertical-dropdown">
    <div>{title}</div>
    {children}
  </div>
));

jest.mock("../../components/FilterSearchBar", () => {
  return function MockFilterSearchBar() {
    return <div data-testid="filter-search-bar" />;
  };
});

jest.mock("../../components/UseScaleBlock", () => ({ label }) => (
  <div data-testid="use-scale-block">{label}</div>
));

// mock global.fetch
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/usecase")) {
      return Promise.resolve({
        json: async () => [
          { id: 1, ai_title: "AI Row 1", instruction: "Do be" },
          { id: 2, ai_title: "AI Row 2", instruction: "Do be doooo" },
        ],
      });
    }
    if (url.includes("/entries")) {
      return Promise.resolve({
        json: async () => [
          {
            entry_type_id: "t1",
            title: "Entry Type 1",
            entries: [
              { ai_level: "LEVEL N", ai_title: "NO AI" },
              { ai_level: "LEVEL G", ai_title: "AI FOR LEARNING" },
            ],
          },
        ],
      });
    }
    return Promise.reject(new Error("Unknown endpoint"));
  });
});
afterEach(() => jest.resetAllMocks());

// test one: render basic layout and fetch data
test("renders layout and fetched data correctly", async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/usescale/123"]}>
        <Routes>
          <Route
            path="/usescale/:id"
            element={
              <UseScalePage
                isBaseTemplate={false}
                userId="1"
                userType="admin"
                template_title="My Template"
                subject_id="1"
                onLogout={jest.fn()}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
  });

  // vasic layout
  expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  expect(screen.getByTestId("horizontal-sidebar")).toBeInTheDocument();
  expect(screen.getByTestId("table-section")).toBeInTheDocument();

  // data fetched from both endpoints appears
  await waitFor(() => {
    expect(screen.getByText("AI Row 1")).toBeInTheDocument();
    expect(screen.getByText("AI Row 2")).toBeInTheDocument();
    expect(screen.getByText("NO AI")).toBeInTheDocument();
    expect(screen.getByText("AI FOR LEARNING")).toBeInTheDocument();
  });
});

// network failure scenario
test("handles fetch failure: still renders Sidebar and TableSection accordingly", async () => {
  global.fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={["/usescale/123"]}>
        <Routes>
          <Route
            path="/usescale/:id"
            element={
              <UseScalePage
                isBaseTemplate={false}
                userId="2"
                userType="coordinator"
                template_title="Template of sadness is open't"
                subject_id="2"
                onLogout={jest.fn()}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
  });

  // expect sidebar to still render
  expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  expect(screen.getByTestId("table-section")).toBeInTheDocument();
});
