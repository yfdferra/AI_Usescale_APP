// Verifies CustomTemplatesSection renders templates, calls onTemplateClick(id,title,subject_id), 
// and that typing in the FilterSearchBar filters by title

// This test does not test Menu actions | it only tests the list + click + search behaviors

// mock routing, is not tested here
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  // same thing as Sidebar.test.jsx
  NavLink: ({ children, ...rest }) => <a {...rest}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomTemplatesSection from "../CustomTemplatesSection";

describe("CustomTemplatesSection", () => {

  // mock the fetch, as the current version calls backend (fetches) and waits for JSON results
  // mock backend response, as the search now depends on backnd response
  beforeAll(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes("/find_templates")) {
        // simulate backend returning only Template C
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              success: true,
              templates: ["Template C"],
            }),
        });
      }
      // default for other endpoints
      return Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      });
    });
  });

  afterAll(() => {
    global.fetch.mockRestore();
  });

  test("renders templates, clicking a square calls onTemplateClick passed by parent, search filters by title", async () => {
    const user = userEvent.setup();
    const onTemplateClick = jest.fn();  // mock it

    // follows shape of { id, title, subject_id }
    const templates = [
      { id: 1, title: "Template A", subject_id: 11 },
      { id: 2, title: "Template B", subject_id: 22 },
      { id: 3, title: "Template C", subject_id: 33 },
    ];

    render(
      <CustomTemplatesSection
        templates={templates}
        onTemplateClick={onTemplateClick}
      />
    );

    // expecting 3 custom template squares visible
    expect(screen.getByRole("button", { name: /template a/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /template b/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /template c/i })).toBeInTheDocument();

    // click Template B and pass { id, title, subject_id }
    await user.click(screen.getByRole("button", { name: /template b/i }));
    expect(onTemplateClick).toHaveBeenCalledTimes(1);
    expect(onTemplateClick).toHaveBeenCalledWith(2, "Template B", 22);

    // use live search functionality: should only remain Template C after inputting c
    const search = screen.getByPlaceholderText(/search/i);
    await user.type(search, "c");

    // only Template C should remain
    expect(screen.queryByRole("button", { name: /template a/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /template b/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /template c/i })).toBeInTheDocument();
  });
});
