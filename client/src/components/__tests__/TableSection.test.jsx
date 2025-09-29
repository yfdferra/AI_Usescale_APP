// Verifies TableSection renders initial title AND all 8 headers in order,
// and that editing cells (task in example) update rows via onRowsChange

// mock heavy child components (MenuButton, TagInput, DropdownTagInput, Star, ExportButton)
// and the network fetch used to populate subject info

// Version 2: 2025/09/29 Changed task to assessment_task as per latest Dev branch updates (Backend) see commit ca4a1ad81ba88a7ec3c9b7dfde472aecabd4df15 (Dev) -> 93f9cfdf9642d7bbf2d31f30715bb4817396e86a (Backend, where the change took place)

import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// mock child components in this TableSection test
jest.mock("../MenuButton", () => (props) => <div data-testid="menu-button" />);
jest.mock("../TagInput", () => (props) => <input data-testid="tag-input" />);
jest.mock("../DropdownTagInput", () => (props) => <select data-testid="dropdown-tag-input" />);
jest.mock("../Star", () => (props) => <div data-testid="star" />);
jest.mock("../ExportButton", () => (props) => <div data-testid="export-button" />);

// mock the fetch in TableSection
const originalFetch = global.fetch;
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          subject_name: "COMP30022",
          subject_year: "2025",
          subject_semester: "S2",
        }),
    })
  );
});
afterAll(() => {
  global.fetch = originalFetch;  // might be problematic later
});

// import after mocks so TableSection uses them
import TableSection from "../TableSection";

describe("TableSection (UI + edit flow)", () => {
  test("renders title + ALL headers; editing 'task' updates rows via onRowsChange", async () => {
    const user = userEvent.setup();

    // mocks for parent callbacks
    const onRowsChange = jest.fn();
    const onChangeScale = jest.fn();
    const onSaveTemplate = jest.fn();

    // example table data row
    const tableData = [
      {
        assessment_task: "Initial Task",
        level: "LEVEL N",
        label: "NO AI",
        instruction: "Initial Instruction",
        example: "Initial Example",
        declaration: "Initial Declaration",
        version: "v1",
        purpose: "Initial Purpose",
        key_prompts: "Prompt 1",
      },
    ];

    render(
      <TableSection
        open
        initialTitle="Initial Title"
        subjectId={123}
        tableData={tableData}
        toHighlight={-1}
        onChangeScale={onChangeScale}
        onRowsChange={onRowsChange}
        onSaveTemplate={onSaveTemplate}
        levelsData={[]}
      />
    );

    // wait for fetch() to run and UI to load the data
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // expect initial title to be successfully rendered
    expect(
      screen.getByRole("heading", { name: /initial title/i })
    ).toBeInTheDocument();

    // expect to see all 8 headers rendered
    const expectedHeaders = [
      "General Learning or Assessment Tasks",
      "AI Use Scale Level",
      "Instruction to Students",
      "Examples",
      "AI Generated Content in Submission",
      "AI Tools Used (version and link if available)",
      "Purpose and Usage",
      "Key Prompts Used (if any)",
    ];

    const ths = screen.getAllByRole("columnheader");
    const headerTexts = ths.map((th) => th.textContent?.trim());
    expect(headerTexts).toEqual(expectedHeaders);

    // scope to row instead of whole screen to avoid multiple textboxes
    const firstDataRow = screen.getAllByRole("row")[1]; // [0] is header
    const taskCellDisplay = within(firstDataRow).getByText(/initial task/i);
    expect(taskCellDisplay).toBeInTheDocument();

    // click -> editable -> type -> commit
    await user.click(taskCellDisplay);
    const editor = within(firstDataRow).getByRole("textbox"); // EditableCell editable area
    await user.clear(editor);
    await user.type(editor, "Updated Task{enter}");

    // should notify parent with updated rows
    expect(onRowsChange).toHaveBeenCalled();
    const latestRows = onRowsChange.mock.calls.at(-1)?.[0];
    expect(Array.isArray(latestRows)).toBe(true);
    expect(latestRows[0]?.assessment_task).toBe("Updated Task");
  });
});
