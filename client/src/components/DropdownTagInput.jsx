/**
 * DropdownTagInput Component
 *
 * A dropdown input that allows selection from a list of options.
 * Displays the selected option as a removable tag.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.placeholder - Placeholder text when nothing is selected
 * @param {string[]} [props.options=[]] - List of selectable options
 * @param {Function} props.onChange - Callback when selection changes
 * @returns {JSX.Element} The DropdownTagInput component
 */

import { useState } from "react";
import "./TagInput.css";
import "./DropdownTagInput.css";

export default function DropdownTagInput({
  placeholder,
  options = [],
  onChange,
}) {
  const [selected, setSelected] = useState("");

    // Update selection and trigger callback
  const handleChange = (e) => {
    setSelected(e.target.value);
    onChange(e.target.value);
  };

  const clearSelection = () => {
    setSelected("");
  };

  return (
    <div className="tag-input">
      {selected ? (
        <div className="tag">
          {selected}
          <button onClick={clearSelection}>×</button>
        </div>
      ) : (
        <select
          value={selected}
          onChange={handleChange}
          className="dropdown-tag"
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
