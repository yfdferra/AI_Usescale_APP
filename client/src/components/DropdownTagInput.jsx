import { useState } from "react";
import "./TagInput.css";
import "./DropdownTagInput.css";

export default function DropdownTagInput({
  placeholder,
  options = [],
  onChange,
}) {
  const [selected, setSelected] = useState("");

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
