// This test verifies the user flow for a single-select "tag input":
// 1. Initially shows a <select> (combobox) with an empty placeholder
// 2. When a user selects a value, the component renders a "tag/chip" for that value and shows a clear (×) button
// 3. Clicking the clear button removes the selection and returns to the original <select>

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DropdownTagInput from "../DropdownTagInput";

describe("DropdownTagInput", () => {
  test("select → tag → clear → back to select", async () => {
    // render with a placeholder and some options
    const user = userEvent.setup();
    render(
      <DropdownTagInput
        placeholder="Pick one"
        options={["A", "B", "C"]}
      />
    );

    // assert initial state:
        // expect a <select> (role="combobox") to be present with an empty string value ""
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue(""); // empty means "no selection yet" (placeholder showing)

    // select one option (i.e. B)
    await user.selectOptions(select, "B");

    // assert new state: the component should now render a "tag" with text "B" | AND there should be a clear button labeled "×"
    expect(screen.getByText("B")).toBeInTheDocument();
    const clearBtn = screen.getByRole("button", { name: "×" });
    expect(clearBtn).toBeInTheDocument();

    // clear the tag selection by clicking the ×
    await user.click(clearBtn);

    // asseret final state: we should be back to a <select> with empty value
    const selectAgain = screen.getByRole("combobox");
    expect(selectAgain).toBeInTheDocument();
    expect(selectAgain).toHaveValue("");
  });
});
