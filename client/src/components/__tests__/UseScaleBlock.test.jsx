// Verifies labels and levels are rendered and are draggable by default (can be disactivated)
// and sets JSON payload with level, label, entry_type_id
import { render, screen, fireEvent } from "@testing-library/react";
import UseScaleBlock from "../UseScaleBlock";
import userEvent from "@testing-library/user-event";


// helper to mimic browser's DataTransfer object during drag and drop
// store data in local object
function makeDataTransfer() {
  const store = {};
  return {
    setData: jest.fn((type, v) => { store[type] = v; }),
    getData: jest.fn((type) => store[type]),
    setDragImage: jest.fn(),
  };
}

describe("UseScaleBlock", () => {
  test("renders level & label and is draggable by default", () => {
    render(<UseScaleBlock level="LEVEL N" label="NO AI" labelBg="#abc" />);

    // default draggable
    const root = screen.getByRole("button");  // root is outer <div> of the component, used to check draggable attribute and dispatch drag event
    expect(root).toHaveAttribute("draggable", "true");

    // level text is visible and styled
    expect(screen.getByText("LEVEL N")).toBeInTheDocument();
    expect(screen.getByText("NO AI")).toHaveStyle({ background: "#abc" });
  });

  test("respects draggable={false}", () => {
    // if component accepts draggable prop, apply it
    render(<UseScaleBlock level="LEVEL TEST not draggable" label="cannot DRAG" draggable={false} />);
    // root should handle draggable=false accordingly
    expect(screen.getByRole("button")).toHaveAttribute("draggable", "false");
  });

  test("dragstart sets JSON payload with level, label, entry_type_id", () => {
    // provide explicit id to later check in JSON payload
    render(<UseScaleBlock level="LEVEL R-2" label="MORE AI" entry_type_id={10240108} />);

    // build DataTransfer and start dragStart against root
    const dt = makeDataTransfer();
    fireEvent.dragStart(screen.getByRole("button"), { dataTransfer: dt });

    // component should set json data during dragStart
    expect(dt.setData).toHaveBeenCalled();

    // verify JSON payload's content to double check
    const payload = dt.getData("application/json");
    expect(typeof payload).toBe("string");

    const parsed = JSON.parse(payload);
    expect(parsed).toEqual({ level: "LEVEL R-2", label: "MORE AI", entry_type_id: 10240108 });
  });

  test("renders edit icon for admin users | triggers onEditClick without misfiring parent onClick", async () => {
    const onClick = jest.fn();
    const onEditClick = jest.fn();

    render(
      <UseScaleBlock
        level="LEVEL TEST for admin"
        label="can EDIT"
        isAdmin={true}
        onClick={onClick}
        onEditClick={onEditClick}
      />
    );

    // expect edit icon to appear for Admin user
    const editIcon = screen.getByAltText("Edit");
    expect(editIcon).toBeInTheDocument();

    // clicking edit icon should only call onEditClick, but not the parent onClick
    await userEvent.click(editIcon);

    expect(onEditClick).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();

  });

  test("does not render edit icon for subject coordinator users", async () => {
    render(
      <UseScaleBlock
        level="LEVEL TEST for subject coordinator"
        label="cannot see EDIT JELP ME"
        isAdmin={false}
      />
    );

    // edit icon should NOT appear for subject coordinator user
    expect(screen.queryByAltText("Edit")).not.toBeInTheDocument();
  })

});
