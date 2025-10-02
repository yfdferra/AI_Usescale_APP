import { render, screen } from "@testing-library/react";  // render mounts component into JSDOM | screen is shared, global testing screen
import userEvent from "@testing-library/user-event";  // simulates real user interactions
import Square from "../Square";  // component that we are testing: Square.jsx

describe("Square", () => {  // group related tests with describe
    // each test defines one behavior that is expected
    test("renders text", () => {
        render(<Square text="+ Written Assessment" />);  // render the component
        // assert the button exists, then getByRole
        expect(  
        screen.getByRole("button", { name: "+ Written Assessment" })
        ).toBeInTheDocument();
    });

    test("calls onClick when clicked", async () => {
        // create user controller for interactions
        const user = userEvent.setup();
        // Jest mock function to verify click handler call
        const onClick = jest.fn();
        // render component as onClickable
        render(<Square text="Click me" onClick={onClick} />);

        // simulate real user click on button
        await user.click(screen.getByRole("button", { name: "Click me" }));
        // assert handler was called once only
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test("adds selected class when selected=true", () => {
        // render component with the 'selected' prop set
        const { container } = render(<Square text="X" selected />);
        // get button from DOM node
        const btn = container.querySelector("button");
        // assert className contains square--selected | use regex to get exact match
        expect(btn.className).toMatch(/\bsquare--selected\b/);
    });

    test('applies "custom-square" when text is "+ Create from scratch"', () => {
        // render with special title "Create from scratch" that triggers different class in component
        const { container } = render(<Square text="+ Create from scratch" />);
        // find first button within container to directly inspect the element's classes (btn.className / btn.classList) to assert the CSS class got added
        const btn = container.querySelector("button");
        // match custom-square
        expect(btn.className).toMatch(/\bcustom-square\b/);
    });
});
