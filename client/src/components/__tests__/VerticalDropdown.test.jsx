// Verifies VerticalDropdown toggles its open state by clicking the header: starts closed with children hidden, icon downwards pointing
// on click: opens, children become visible, icon flips to point upwards | and vice versa

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VerticalDropdown from "../VerticalDropdown";

describe("VerticalDropdown", () => {
  test("toggles open/closed and flips icon", async () => {
    const user = userEvent.setup();

    render(
      <VerticalDropdown title="Advanced Options">
        <div>Inner content</div>
      </VerticalDropdown>
    );

    // Initial State: closed
    // find header by title text
    const header = screen.getByText(/advanced options/i);
    // icon should show point downwards when closed
    expect(within(header.parentElement ?? header).getByText("▼")).toBeInTheDocument();
    // children should be hidden
    expect(screen.queryByText(/inner content/i)).not.toBeInTheDocument();

    // Click: open state
    await user.click(header);
    // children now visible
    expect(screen.getByText(/inner content/i)).toBeInTheDocument();
    // icon flips to upwards facing
    const headerOpen = screen.getByText(/advanced options/i);
    expect(within(headerOpen.parentElement ?? headerOpen).getByText("▲")).toBeInTheDocument();

    // Click: close again
    await user.click(headerOpen);
    expect(screen.queryByText(/inner content/i)).not.toBeInTheDocument();
    const headerClosedAgain = screen.getByText(/advanced options/i);
    expect(within(headerClosedAgain.parentElement ?? headerClosedAgain).getByText("▼")).toBeInTheDocument();
  });
  
  test("respects expanded prop and updates on prop change", () => {
    const { rerender } = render(
      <VerticalDropdown title="Advanced Options" expanded={true}>
        <div>Inner content</div>
      </VerticalDropdown>
    );

    // starts open if expanded=true
    expect(screen.getByText(/inner content/i)).toBeInTheDocument();
    expect(screen.getByText("▲")).toBeInTheDocument();

    // now flip expanded to false
    rerender(
      <VerticalDropdown title="Advanced Options" expanded={false}>
        <div>Inner content</div>
      </VerticalDropdown>
    );

    expect(screen.queryByText(/inner content/i)).not.toBeInTheDocument();
    expect(screen.getByText("▼")).toBeInTheDocument();
  });

});
