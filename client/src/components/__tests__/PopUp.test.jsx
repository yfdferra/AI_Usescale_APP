// Verifies PopUp shows title/message/subtitle/icon and calls onClose when closed

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PopUp from "../PopUp";

describe("PopUp", () => {
  test("renders content (title, message, subtitle, icon) and closes via onClose", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    // render the PopUp with all fields filled & render icon
    render(
      <PopUp
        title="Forgot Password"
        message="Please contact the admin for this problem."
        subtitle="For security reasons, password reset is handled by the administrator."
        icon={<span role="img" aria-label="alert">🚨</span>}
        onClose={onClose}
      />
    );

    // Content should be rendered by expectation
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(
      screen.getByText(/please contact the admin for this problem/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/for security reasons, password reset is handled by the administrator/i)
    ).toBeInTheDocument();

    // Icon expected to be present since we passed role="img" aria-label="alert"
    expect(screen.getByRole("img", { name: /alert/i })).toBeInTheDocument();

    // Close Behavior
    // if no named close button, get the first/only button in the popup
    const closeBtn =
      screen.queryByRole("button", { name: /close|dismiss|ok|got it|×/i }) ??
      screen.getAllByRole("button")[0];

    await user.click(closeBtn);

    // should notify parent
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
