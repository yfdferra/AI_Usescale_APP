/**
 * TagInput Component
 *
 * input that allows entering a single tag. Displays the tag with a remove button once added.
 *
 * @component
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {string} [props.value] - Initial input value
 * @param {function} props.onChange - Callback when input value changes
 * @returns {JSX.Element} The TagInput component
 */

import { useState } from "react";
import "./TagInput.css";

export default function TagInput({ placeholder, value, onChange }) {
  // State definitions
  const [tags, setTags] = useState(null);
  const [inputValue, setInputValue] = useState(value || "");

  const handleKeyDown = (e) => {
    // Add tag on Enter key
    if (e.key === "Enter" && inputValue.trim && !tags) {
      e.preventDefault();
      setTags(inputValue.trim());
      setInputValue("");
    }
  };
  // Remove existing tag
  const removeTag = () => {
    setTags(null);
  };

  return (
    <div className="tag-input">
      {tags ? (
        <div className="tag">
          {tags}
          <button onClick={removeTag}>×</button>
        </div>
      ) : (
        // Input field for entering a tag
        // Placeholder text is shown when input is empty, value changes based on user input
        // onChange updates inputValue state and calls the onChange prop
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
}
