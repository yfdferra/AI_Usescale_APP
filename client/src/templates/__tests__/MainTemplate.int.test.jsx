// Integration test for MainTemplate page
// should fetch custom templates for logged in user & global base templates
// should render Sidebar, BaseTemplatesSection, CustomTemplatesSection, all of which should be wrapped in Dashboard

import { render, screen, waitFor, act } from "@testing-library/react";
import MainTemplate from "../MainTemplate";

// mock all child components to focus on page behavior
jest.mock("../../components/Sidebar", () => {
  // fuction for Jest to call to get the mock module
  return function MockSidebar() {
    return <div data-testid="sidebar" />;  // data-testid is an HTML attribute for testing (easier lookup)
  };
});


// mock the Dashboard component
jest.mock("../../components/Dashboard", () => {
  return function MockDashboard({ children }) {
    return <div data-testid="dashboard">{children}</div>;
  };
});

// mock the BaseTemplatesSection component
jest.mock("../../components/BaseTemplatesSection", () => {
  return function MockBaseTemplatesSection({ templates }) {
    return (
      <div data-testid="base-section">
        {templates.map((t) => (
          <div key={t.id}>{t.title}</div>
        ))}
      </div>
    );
  };
});

// mock the CustomTemplatesSection component
jest.mock("../../components/CustomTemplatesSection", () => {
  return function MockCustomTemplatesSection({ templates }) {
    return (
      <div data-testid="custom-section">
        {templates.map((t) => (
          <div key={t.id}>{t.title}</div>
        ))}
      </div>
    );
  };
});


// mock fetch for both /get_custom_scales and /get_base_scales
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/get_custom_scales")) {
      return Promise.resolve({
        json: async () => [
          { usescale_id: "c1", title: "Custom 1", subject_id: "1" },
          { usescale_id: "c2", title: "Custom 2", subject_id: "2" },
        ],
      });
    }
    if (url.includes("/get_base_scales")) {
      return Promise.resolve({
        json: async () => [
          { usescale_id: "b1", title: "Base 1", subject_id: "3" },
          { usescale_id: "b2", title: "Base 2", subject_id: "4" },
        ],
      });
    }
    return Promise.reject(new Error("Unknown endpoint"));
  });
});

afterEach(() => jest.resetAllMocks());

// appearance test
test("renders layout with Sidebar and Dashboard", async () => {
  await act(async () => {
    render(
      <MainTemplate
        userId="1"
        userType="coordinator"
        onTemplateClick={jest.fn()}
        onBaseTemplateClick={jest.fn()}
        onCreateFromScratchClick={jest.fn()}
        onLogout={jest.fn()}
      />
    );
  });

  expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  expect(screen.getByTestId("dashboard")).toBeInTheDocument();
});

// further checks to ensure custom templates and base templates are both successfully brought in and rendered
test("displays base and custom templates after fetch", async () => {
  await act(async () => {
    render(
      <MainTemplate
        userId="2"
        userType="admin"
        onTemplateClick={jest.fn()}
        onBaseTemplateClick={jest.fn()}
        onCreateFromScratchClick={jest.fn()}
        onLogout={jest.fn()}
      />
    );
  });

  // wait for both sections to render templates
  await waitFor(() => {
    expect(screen.getByText("Custom 1")).toBeInTheDocument();
    expect(screen.getByText("Base 1")).toBeInTheDocument();
  });

  // confirm both sections received correct number of templates -> being 2 each
  expect(screen.getAllByText(/Custom/i).length).toBe(2);
  expect(screen.getAllByText(/Base/i).length).toBe(2);
});

// able to handle fetch failure  *(should trigger console log: Error scale not found)*
test("handles fetch failure: still renders Sidebar and Dashboard", async () => {
  // force fetch to reject
  global.fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));  // most realistic error, v1 used normal Error("with text network error")

  await act(async () => {
    render(
      <MainTemplate
        userId="1"
        userType="coordinator"
        onTemplateClick={jest.fn()}
        onBaseTemplateClick={jest.fn()}
        onCreateFromScratchClick={jest.fn()}
        onLogout={jest.fn()}
      />
    );
  });

  // even on error, Sidebar and Dashboard should ideally still render
  expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  expect(screen.getByTestId("dashboard")).toBeInTheDocument();
});
