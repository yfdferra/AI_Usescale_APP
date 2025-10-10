// Verifies TextBox renders an input, and emits onChange while typing

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextBox from "../Textbox";

describe("TextBox", () => {
  test("renders and emits onChange while typing", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    // render with a clear placeholder to query the input
    render(<TextBox onChange={onChange} />);

    // find the input by ARIA role
    const input = screen.getByRole("textbox");

    // simulate realistic user typing, expected to call onChange per key entry
    await user.type(input, "hello");

    // assert handler was called and value reflects the typing
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("hello");
  });
});
