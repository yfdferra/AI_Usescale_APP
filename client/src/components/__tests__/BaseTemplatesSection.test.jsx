// Verifies BaseTemplatesSection renders squares correctly and responds to user clicks depending on userType (admin vs subject coordinator)
//
// coordinator: sees "+ " prefix on template names, create button = "+ Create from scratch"
// admin:  sees raw template names, create button = "+ Create new base template draft"

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BaseTemplatesSection from "../BaseTemplatesSection";

describe("BaseTemplatesSection", () => {
  // mock templates for testing
  const mockTemplates = [
    { id: "t1", title: "Written Assessment", subject_id: "s1" },
    { id: "t2", title: "Coding Assessment", subject_id: "s2" },
  ];

  test("renders coordinator tiles with + prefix and triggers clicks", async () => {
    const user = userEvent.setup();
    const onBaseTemplateClick = jest.fn();
    const onCreateFromScratchClick = jest.fn();

    render(
      <BaseTemplatesSection
        userId="u1"
        userType="coordinator"
        templates={mockTemplates}
        onBaseTemplateClick={onBaseTemplateClick}
        onCreateFromScratchClick={onCreateFromScratchClick}
      />
    );

    // heading text for coordinator user
    expect(screen.getByRole("heading", { name: /Base Templates/i })).toBeInTheDocument();

    // coordinator should see "+ " prefix on template names
    const written = screen.getByRole("button", { name: /\+\s*Written Assessment/i });
    const coding = screen.getByRole("button", { name: /\+\s*Coding Assessment/i });
    const scratch = screen.getByRole("button", { name: /\+\s*Create from scratch/i });

    expect(written).toBeInTheDocument();
    expect(coding).toBeInTheDocument();
    expect(scratch).toBeInTheDocument();

    // click on a template square: should call onBaseTemplateClick with correct args
    await user.click(written);
    expect(onBaseTemplateClick).toHaveBeenCalledWith("t1", "Written Assessment", "s1");

    // click on the "create from scratch" square: should call onCreateFromScratchClick
    await user.click(scratch);
    expect(onCreateFromScratchClick).toHaveBeenCalledTimes(1);
  });

  test("renders admin tiles without + prefix and correct create label", async () => {
    const user = userEvent.setup();
    const onBaseTemplateClick = jest.fn();
    const onCreateFromScratchClick = jest.fn();

    render(
      <BaseTemplatesSection
        userId="admin1"
        userType="admin"
        templates={mockTemplates}
        onBaseTemplateClick={onBaseTemplateClick}
        onCreateFromScratchClick={onCreateFromScratchClick}
      />
    );

    // heading text should change for admin user
    expect(screen.getByRole("heading", { name: /Global Base Templates/i })).toBeInTheDocument();

    // admin should see titles without "+" prefix
    const written = screen.getByRole("button", { name: "Written Assessment" });
    const coding = screen.getByRole("button", { name: "Coding Assessment" });

    // admin create from scratch label is different
    const scratch = screen.getByRole("button", { name: /\+ Create new base template draft/i });

    expect(written).toBeInTheDocument();
    expect(coding).toBeInTheDocument();
    expect(scratch).toBeInTheDocument();

    // clicking a template triggers onBaseTemplateClick
    await user.click(coding);
    expect(onBaseTemplateClick).toHaveBeenCalledWith("t2", "Coding Assessment", "s2");

    // clicking create triggers onCreateFromScratchClick
    await user.click(scratch);
    expect(onCreateFromScratchClick).toHaveBeenCalledTimes(1);
  });
});
