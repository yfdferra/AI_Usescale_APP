// Verifies clicking a menu item will trigger its onClick, then onClose.
// Also checks multiple items render by label.

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DropdownMenu from "../Menu";

describe("DropdownMenu", () => {
  test("clicking an item triggers its handler and onClose", async () => {
    // create a user controller simulating realistic clicking
    const user = userEvent.setup();
    // mock handlers
    const onClose = jest.fn();
    const onClick = jest.fn();

    render(
      <DropdownMenu
        items={[{ label: "Edit", onClick }]}
        onClose={onClose}
      />
    );

    await user.click(screen.getByText("Edit"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("renders multiple items", () => {
    render(
      <DropdownMenu
        items={[
          { label: "Edit", onClick: jest.fn() },
          { label: "Delete", onClick: jest.fn() },
        ]}
      />
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
