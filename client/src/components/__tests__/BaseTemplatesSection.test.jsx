// Verifies BaseTemplatesSection renders the 5 square components and responds correctly with onClicks
// first square calls onWrittenAssessmentClick | last square calls onCreateFromScratchClick

// ASSUMPTION: This test assumes Square.jsx renders as a <button> with the visible text as the accessible name (current version does so)

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BaseTemplatesSection from "../BaseTemplatesSection";

describe("BaseTemplatesSection", () => {
  test("renders tiles and tiggers first/last clicks", async () => {
    const user = userEvent.setup();

    // mock functions for the clicks
    const onWrittenAssessmentClick = jest.fn();
    const onCreateFromScratchClick = jest.fn();

    render(
      <BaseTemplatesSection
        onWrittenAssessmentClick={onWrittenAssessmentClick}
        onCreateFromScratchClick={onCreateFromScratchClick}
      />
    );

    // Render check
    const written = screen.getByRole("button", { name: /\+\s*written assessment/i });
    const coding = screen.getByRole("button", { name: /\+\s*coding assessment/i });
    const oral = screen.getByRole("button", { name: /\+\s*oral assessment/i });
    const presentation = screen.getByRole("button", { name: /\+\s*presentation assessment/i });
    const scratch = screen.getByRole("button", { name: /\+\s*create from scratch/i });

    expect(written).toBeInTheDocument();
    expect(coding).toBeInTheDocument();
    expect(oral).toBeInTheDocument();
    expect(presentation).toBeInTheDocument();
    expect(scratch).toBeInTheDocument();

    // Click Behavior
    // square 1:  (index=0, "Written Assessment")
    await user.click(written);
    expect(onWrittenAssessmentClick).toHaveBeenCalledTimes(1);
    const [idxArg, titleArg] = onWrittenAssessmentClick.mock.calls[0];
    expect(idxArg).toBe(0);
    expect(titleArg).toBe("Written Assessment"); // "+ " removed

    // square -1: Create from scratch
    await user.click(scratch);
    expect(onCreateFromScratchClick).toHaveBeenCalledTimes(1);

    // middle squares aren't ready
    await user.click(coding);
    await user.click(oral);
    await user.click(presentation);
    expect(onWrittenAssessmentClick).toHaveBeenCalledTimes(1);
    expect(onCreateFromScratchClick).toHaveBeenCalledTimes(1);
  });
});
