// Verifies TagInput allows input for tags, pressing enter would create the tag, remove can delete the tag

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagInput from "../TagInput";

describe("TagInput", () => {
  test("adds a tag on Enter and removes it via  ×  remove button", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn(); // add mock onChange

    render(<TagInput placeholder="Add tag..." value={[]} onChange={handleChange} />);

    // input should be initially visible
    const input =
      screen.queryByPlaceholderText(/add tag/i) ??
      screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    // type in input, onChange should be triggered by each key pressed  
    await user.type(input, "COMP30022");
    expect(handleChange).toHaveBeenCalled();

    await user.type(input, "{enter}");  // then press enter  ->  tag forms and appears
    expect(screen.getByText(/^COMP30022$/i)).toBeInTheDocument();

    // input should become the tag (becomes hidden)
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    // remove the tag with ×: input should return
    const removeBtn =
      screen.getByRole("button", { name: /×/ })
    await user.click(removeBtn);

    expect(screen.queryByText(/^COMP30022$/i)).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/add tag/i) ?? screen.getByRole("textbox")
    ).toBeInTheDocument();
  });
});
