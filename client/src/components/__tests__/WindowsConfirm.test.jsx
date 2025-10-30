// Verifies the behavior of the WindowsConfirm component
// Checks that: renders only when 'show' is true | displays message | has Yes / No buttons | triggers onConfirm and onCancel

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmPopup from "../WindowsConfirm";

describe("WindowsConfirm (ConfirmPopup)", () => {
  // should not render when show=false
  test("does not render when show=false", () => {
    const { container } = render(<ConfirmPopup show={false} message="I do not exist, heeheee" />);

    // expect nothing to be rendered
    expect(container.firstChild).toBeNull();
  });


  // renders message and buttons when show=true
  test("renders correctly when show=true, and displays message and buttons", () => {
    render(<ConfirmPopup show={true} message="Its Chewsday Innit" />); 

    expect(screen.getByText("Its Chewsday Innit")).toBeInTheDocument();  // expect message to be there

    expect(screen.getByRole("button", { name: /yes/i })).toBeInTheDocument();  // expect buttons to render too
    expect(screen.getByRole("button", { name: /no/i })).toBeInTheDocument();
  });


  // clicking Yes button triggers onConfirm
  test("calls onConfirm when clicking Yes button", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(<ConfirmPopup show={true} message="LeBrawn JAEEEMS" onConfirm={onConfirm} onCancel={onCancel} />);

    // simulate click on Yes
    await user.click(screen.getByRole("button", { name: /yes/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);  // expect onConfirm to have been called once
    expect(onCancel).not.toHaveBeenCalled();
  });


  // clicking No button triggers onCancel
  test("calls onCancel when clicking No button", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(<ConfirmPopup show={true} message="LeBrawn JAEEEMS" onConfirm={onConfirm} onCancel={onCancel} />);

    // simulate click on No
    await user.click(screen.getByRole("button", { name: /no/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);  // expect onCancel to have been called once
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
