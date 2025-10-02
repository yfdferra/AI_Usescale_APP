import { useState } from "react";
import "./TagInput.css";

export default function TagInput({ placeholder, value }) {
  const [tags, setTags] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim && !tags) {
      e.preventDefault();
      setTags(inputValue.trim());
      setInputValue("");
    }
  };

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
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
}
