// Verifies the dashboard renders children inside
// not much to test here

import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard";

test("renders children", () => {
  render(
    <Dashboard>
      <div>hello</div>
    </Dashboard>
  );
  expect(screen.getByText("hello")).toBeInTheDocument();
});
