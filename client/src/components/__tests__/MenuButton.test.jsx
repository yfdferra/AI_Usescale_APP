// Verifies MenuButton opens a menu, clicking an item notifies the parent via onAction(value).
// example of menuButton: { label: "Edit Title", icon: editIcon, onClick: () => editTitle(id, title) }

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuButton from "../MenuButton";



describe("MenuButton", () => {
    test("opens menu and triggers actions: Add Row Above", async () => {
        const user = userEvent.setup();

        // mock functions for each row action
        const addAbove = jest.fn();
        const addBelow = jest.fn();
        const delRow = jest.fn();
        const dupRow = jest.fn();

        // render with 4 items in the menu  (icons irrelevant to this test)
        render(
        <MenuButton
            items={[
            { label: "Add Row Above", icon: "addIcon", onClick: addAbove },
            { label: "Add Row Below", icon: "addIcon", onClick: addBelow },
            { label: "Delete Row",    icon: "deleteIcon", onClick: delRow  },
            { label: "Duplicate Row", icon: "copyIcon",   onClick: dupRow  },
            ]}
        />
        );

        // Open Menu
        // use first button seen
        const trigger =
        screen.queryByRole("button", { name: /menu|more|options|actions/i }) ??
        screen.getAllByRole("button")[0];

        await user.click(trigger);

        // simulate user clicking add row above
        await user.click(screen.getByText(/^Add Row Above$/i));

        // only the correct handler shoule be called
        expect(delRow).not.toHaveBeenCalled();
        expect(addAbove).toHaveBeenCalledTimes(1);
        expect(addBelow).not.toHaveBeenCalled();
        expect(dupRow).not.toHaveBeenCalled();

        // MenuButton should close after click
        // assert its gone
        expect(screen.queryByText(/^Add Row Above$/i)).not.toBeInTheDocument();

    });



    test("opens menu and triggers actions: Add Row Below", async () => {
        const user = userEvent.setup();

        // mock functions for each row action
        const addAbove = jest.fn();
        const addBelow = jest.fn();
        const delRow = jest.fn();
        const dupRow = jest.fn();

        // render with 4 items in the menu  (icons irrelevant to this test)
        render(
        <MenuButton
            items={[
            { label: "Add Row Above", icon: "addIcon", onClick: addAbove },
            { label: "Add Row Below", icon: "addIcon", onClick: addBelow },
            { label: "Delete Row",    icon: "deleteIcon", onClick: delRow  },
            { label: "Duplicate Row", icon: "copyIcon",   onClick: dupRow  },
            ]}
        />
        );

        // Open Menu
        // use first button seen
        const trigger =
        screen.queryByRole("button", { name: /menu|more|options|actions/i }) ??
        screen.getAllByRole("button")[0];

        await user.click(trigger);

        // simulate user clicking add row Below
        await user.click(screen.getByText(/^Add Row Below$/i));

        // only the correct handler shoule be called
        expect(delRow).not.toHaveBeenCalled();
        expect(addAbove).not.toHaveBeenCalled();
        expect(addBelow).toHaveBeenCalledTimes(1);
        expect(dupRow).not.toHaveBeenCalled();

        // MenuButton should close after click
        // assert its gone
        expect(screen.queryByText(/^Add Row Below$/i)).not.toBeInTheDocument();

    });



    test("opens menu and triggers actions: Delete Row", async () => {
        const user = userEvent.setup();

        // mock functions for each row action
        const addAbove = jest.fn();
        const addBelow = jest.fn();
        const delRow = jest.fn();
        const dupRow = jest.fn();

        // render with 4 items in the menu  (icons irrelevant to this test)
        render(
        <MenuButton
            items={[
            { label: "Add Row Above", icon: "addIcon", onClick: addAbove },
            { label: "Add Row Below", icon: "addIcon", onClick: addBelow },
            { label: "Delete Row",    icon: "deleteIcon", onClick: delRow  },
            { label: "Duplicate Row", icon: "copyIcon",   onClick: dupRow  },
            ]}
        />
        );

        // Open Menu
        // use first button seen
        const trigger =
        screen.queryByRole("button", { name: /menu|more|options|actions/i }) ??
        screen.getAllByRole("button")[0];

        await user.click(trigger);

        // simulate user clicking Delete Row
        await user.click(screen.getByText(/^Delete Row$/i));

        // only the correct handler shoule be called
        expect(delRow).toHaveBeenCalledTimes(1);
        expect(addAbove).not.toHaveBeenCalled();
        expect(addBelow).not.toHaveBeenCalled();
        expect(dupRow).not.toHaveBeenCalled();

        // MenuButton should close after click
        // assert its gone
        expect(screen.queryByText(/^Delete Row$/i)).not.toBeInTheDocument();

    });



    test("opens menu and triggers actions: Duplicate Row", async () => {
        const user = userEvent.setup();

        // mock functions for each row action
        const addAbove = jest.fn();
        const addBelow = jest.fn();
        const delRow = jest.fn();
        const dupRow = jest.fn();

        // render with 4 items in the menu  (icons irrelevant to this test)
        render(
        <MenuButton
            items={[
            { label: "Add Row Above", icon: "addIcon", onClick: addAbove },
            { label: "Add Row Below", icon: "addIcon", onClick: addBelow },
            { label: "Delete Row",    icon: "deleteIcon", onClick: delRow  },
            { label: "Duplicate Row", icon: "copyIcon",   onClick: dupRow  },
            ]}
        />
        );

        // Open Menu
        // use first button seen
        const trigger =
        screen.queryByRole("button", { name: /menu|more|options|actions/i }) ??
        screen.getAllByRole("button")[0];

        await user.click(trigger);

        // simulate user clicking Duplicate Row
        await user.click(screen.getByText(/^Duplicate Row$/i));

        // only the correct handler shoule be called
        expect(delRow).not.toHaveBeenCalled();
        expect(addAbove).not.toHaveBeenCalled();
        expect(addBelow).not.toHaveBeenCalled();
        expect(dupRow).toHaveBeenCalledTimes(1);

        // MenuButton should close after click
        // assert its gone
        expect(screen.queryByText(/^Duplicate Row$/i)).not.toBeInTheDocument();

    });
});
