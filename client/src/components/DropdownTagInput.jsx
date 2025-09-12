import { useState } from "react";
import "./TagInput.css";

export default function DropdownTagInput({ placeholder = "*Semester", options = [] }) {
  const [selected, setSelected] = useState(null);

  const handleChange = (e) => {
    if (e.target.value) {
      setSelected(e.target.value);
    }
  };

  const clearSelection = () => {
    setSelected(null);
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
          defaultValue=""
          onChange={handleChange}
          className="dropdown-tag"
        >
          <option value="" disabled>
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
