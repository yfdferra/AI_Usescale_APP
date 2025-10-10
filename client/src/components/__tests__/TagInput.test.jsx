// Verifies TagInput allows input for tags, pressing enter would create the tag, remove can delete the tag

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagInput from "../TagInput";

describe("TagInput", () => {
  test("adds a tag on Enter and removes it via  ×  remove button", async () => {
    const user = userEvent.setup();

    render(<TagInput placeholder="Add tag..." value={[]} />);

    // input should be initially visible
    const input =
      screen.queryByPlaceholderText(/add tag/i) ??
      screen.getByRole("textbox");
    expect(input).toBeInTheDocument();

    // type in input, then press enter  ->  tag forms and appears
    await user.type(input, "COMP30022{enter}");
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
