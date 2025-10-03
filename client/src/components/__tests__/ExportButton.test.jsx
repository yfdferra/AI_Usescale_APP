// Verifies clicking on export button opens popup and selects Student Declaration by default, while AI Usage Scale is not selected
// download button should be disabled when both options are not chosen

// mock jspdf library before importing the component
jest.mock("jspdf", () => {
  // mimic default export returning an instance with the methods app might call
  return {
    __esModule: true,
    default: jest.fn(() => ({
      addImage: jest.fn(),
      setFontSize: jest.fn(),
      text: jest.fn(),
      save: jest.fn(),
    })),
  };
});
jest.mock("jspdf-autotable", () => ({
  __esModule: true,
  default: jest.fn(), // if called directly
}));


import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExportButton from "../ExportButton";

describe("ExportButton (UI only, actual export not tested *manual*)", () => {
  test("opens popup and toggles Download enabled/disabled based on checkbox selections", async () => {
    const user = userEvent.setup();

    // render the component: initially only the main Export button is present
    render(<ExportButton />);

    // find and click the export button to show popup
    const exportBtn = screen.getByRole("button", { name: /export/i });
    await user.click(exportBtn);

    // the two checkboxes should both show and only export student declaration should be chosen by default
    const studentDecl = screen.getByRole("checkbox", { name: /export student declaration/i });
    const aiScale = screen.getByRole("checkbox", { name: /export ai usage scale/i });

    expect(studentDecl).toBeChecked();     // default value: checked
    expect(aiScale).not.toBeChecked();     // default value: unchecked

    // download button should be enabled since at least one option is selected.
    const downloadBtn = screen.getByRole("button", { name: /download/i });
    expect(downloadBtn).toBeEnabled();

    // deselect the only checked box: making both unchecked, download should be disabled
    await user.click(studentDecl);
    expect(studentDecl).not.toBeChecked();
    expect(aiScale).not.toBeChecked();
    expect(downloadBtn).toBeDisabled();

    // select one of the two: download should be abled again
    await user.click(aiScale);
    expect(aiScale).toBeChecked();
    expect(downloadBtn).toBeEnabled();
  });
});
