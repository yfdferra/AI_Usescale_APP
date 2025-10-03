// Verifies HorizontalSidebar open/close behavior and child render

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HorizontalSidebar from "../HorizontalSidebar";

describe("HorizontalSidebar", () => {
  test("closed -> open toggle | open renders children on top and middle", async () => {
    const user = userEvent.setup();

    const setOpen = jest.fn();
    const children = [
      <div key="s">Search Bar</div>,
      <div key="a">Panel A</div>,
      <div key="b">Panel B</div>,
    ];

    // Render Closed
    const { rerender } = render(
      <HorizontalSidebar open={false} setOpen={setOpen}>
        {children}
      </HorizontalSidebar>
    );

    // should not have any content when closed
    expect(screen.queryByText(/search bar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/panel a/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/panel b/i)).not.toBeInTheDocument();

    // find ARIA label Open Sidebar  &  > 
    const toggleClosed = screen.getByRole("button", { name: /open sidebar/i });
    expect(toggleClosed).toBeInTheDocument();
    expect(within(toggleClosed).getByText(">")).toBeInTheDocument();

    // click toggle: should open the sidebar
    await user.click(toggleClosed);
    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(true);

    // Render Open
    setOpen.mockClear();
    rerender(
      <HorizontalSidebar open={true} setOpen={setOpen}>
        {children}
      </HorizontalSidebar>
    );

    // first children at top
    expect(screen.getByText(/search bar/i)).toBeInTheDocument();
    // rest in the middle
    expect(screen.getByText(/panel a/i)).toBeInTheDocument();
    expect(screen.getByText(/panel b/i)).toBeInTheDocument();

    // find ARIA label Close Sidebar  &  <
    const toggleOpen = screen.getByRole("button", { name: /close sidebar/i });
    expect(within(toggleOpen).getByText("<")).toBeInTheDocument();

    // click toggle: should close the sidebar
    await user.click(toggleOpen);
    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
