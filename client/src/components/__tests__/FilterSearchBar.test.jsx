// This test verifies the two core behaviors of FilterSearchBar:
// 1. Changing the <select> calls onFilterChange
// 2. Typing into the search input calls onSearch with the current text (on each key input)

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterSearchBar from "../FilterSearchBar";

describe("FilterSearchBar", () => {
  test("emits filter changes and search text", async () => {
    // create a user controller simulating realistic typing
    const user = userEvent.setup();

    // mock handlers so we can assert they were called
    const onFilterChange = jest.fn();
    const onSearch = jest.fn();

    // render the component with two filter options
    render(
      <FilterSearchBar
        filterOptions={["Default", "Recent"]}
        onFilterChange={onFilterChange}
        onSearch={onSearch}
      />
    );

    // Filter Select Behavior
    // query the select via its ARIA role (combobox) -> see footnote for ARIA roles
    const select = screen.getByRole("combobox");

    // change selection to "Recent"
    await user.selectOptions(select, "Recent");

    // expect the filter change callback to run once
    expect(onFilterChange).toHaveBeenCalledTimes(1);


    // Search Input Behavior
    // query the search input via the placeholder -> ("Search" in gray)
    const input = screen.getByPlaceholderText(/search/i);

    // type "abc" into the input, simulates live input a->ab->abc
    await user.type(input, "abc");

    // expect onSearch called for each keypress (a, b, c)
    // the last call should carry the full string "abc"
    expect(onSearch).toHaveBeenNthCalledWith(1, "a");
    expect(onSearch).toHaveBeenNthCalledWith(2, "ab");
    expect(onSearch).toHaveBeenNthCalledWith(3, "abc");

  });
});


// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles
// ARIA-Roles: provide semantics to content, i.e. radio, combobox, etc.
