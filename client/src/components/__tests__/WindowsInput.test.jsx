// Verifies the behavior of the WindowsInput component
// Checks that: renders when 'show' is true | displays title, placeholder, and buttons | calls onSubmit/onCancel via Enter/Escape/Button clicks | resets input when reopened after hiddern

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WindowsInputModal from "../WindowsInput";

describe("WindowsInputModal", () => {
  // render test: only render when show=true
  test("does not render when show=false", () => {
    const { container } = render(<WindowsInputModal show={false} />);
    // the entire WindowsInputModal should not be rendered
    expect(container.firstChild).toBeNull();
  });


  // when show=true, check that everything is there
  test("renders correctly when show=true, and displays title, placeholder, buttons", () => {
    render(<WindowsInputModal show={true} title="Test Title" placeholder="Enter text" />);

    // title, input(with correct placeholder), OK/Cancel buttons
    expect(screen.getByText("Test Title")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /ok/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });


  // on enter, trigger onSubmit with current value
  test("calls onSubmit with input value when pressing Enter", async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(<WindowsInputModal show={true} onSubmit={onSubmit} onCancel={onCancel} />);

    // simulate text and press enter
    const input = screen.getByRole("textbox");
    await user.type(input, "myNameIsJeff{enter}");

    // expect the handler to have been called with the text entered by simulater user
    expect(onSubmit).toHaveBeenCalledWith("myNameIsJeff");
  });


  // on escape press, should trigger onCancel 
  test("calls onCancel when pressing Escape", async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(<WindowsInputModal show={true} onSubmit={onSubmit} onCancel={onCancel} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "{escape}");

    // expect onCancel to have been called
    expect(onCancel).toHaveBeenCalled();
  });

  // clicking ok button should submit current text
  test("calls onSubmit with updated value when clicking OK button", async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(<WindowsInputModal show={true} onSubmit={onSubmit} onCancel={onCancel} defaultValue="mynameWASjeff" />);

    const input = screen.getByRole("textbox");

    // simulate user to change input value
    await user.clear(input);
    await user.type(input, "holaSoyDora");

    // simulate ok click
    await user.click(screen.getByRole("button", { name: /ok/i }));

    // expect onSubmit called with new value
    expect(onSubmit).toHaveBeenCalledWith("holaSoyDora");
  });


  // clicking cancel button should trigger onCancel
  test("calls onCancel when clicking Cancel button", async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(<WindowsInputModal show={true} onCancel={onCancel} />);

    // simulate click Cancel button
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // expect onCancel to have been called
    expect(onCancel).toHaveBeenCalled();
  });


  // should reset input value when reopened with new default value
  test("resets to new value when reopened", () => {
    const { rerender } = render(
      <WindowsInputModal show={true} defaultValue="Jeff" />
    );

    // should initially have default value
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("Jeff");

    // simulate user editing the value, then closing it
    fireEvent.change(input, { target: { value: "Changed" } });
    rerender(<WindowsInputModal show={false} defaultValue="Dora" />);

    // reopen with new default value
    rerender(<WindowsInputModal show={true} defaultValue="Dora" />);

    // should reset to new value
    expect(screen.getByRole("textbox")).toHaveValue("Dora");
  });
});
