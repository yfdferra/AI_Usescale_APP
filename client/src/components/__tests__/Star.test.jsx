// Verifies clicking star will toggle it
// mock image imports to stable strings so we can assert src

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// mock imports used by Star to strings  
jest.mock("../../assets/starFilled.png", () => "FILLED"); // closed state  *toggled*
jest.mock("../../assets/starEmpty.png", () => "EMPTY");   // state | initial state  *untoggled*

import StarToggle from "../Star";

describe("StarToggle", () => {
  test("toggles star on click", async () => {
    const user = userEvent.setup();
    render(<StarToggle />);

    const img = screen.getByRole("img");
    // initial state: empty
    expect(img).toHaveAttribute("src", "EMPTY");

    await user.click(img);
    // after 1st click: toggled | filled
    expect(img).toHaveAttribute("src", "FILLED");

    await user.click(img);
    // after 2nd click: back to empty
    expect(img).toHaveAttribute("src", "EMPTY");
    
  });
});
