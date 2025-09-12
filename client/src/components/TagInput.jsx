import { useState } from "react";
import "./TagInput.css";

export default function TagInput() {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="tag-input">
      {tags.map((tag, idx) => (
        <div key={idx} className="tag">
          {tag}
          <button onClick={() => removeTag(idx)}>×</button>
        </div>
      ))}
      <input
        type="text"
        placeholder="Tags"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}