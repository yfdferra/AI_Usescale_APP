/**
 * Square Component
 *
 * A clickable square button used to represent templates.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.text - The text displayed inside the square
 * @param {Function} props.onClick - Callback function executed when the square is clicked
 * @param {boolean} [props.selected=false] - Whether the square is currently selected
 * @returns {JSX.Element} The Square component
 */

import "./Sqaure.css";

export default function Square({ text, onClick, selected }) {
  // check if this is a "custom" square for creating new templates
  const isCustom = text === "+ Create from scratch" || text === "+ Create new base template draft";
  return (
    <button
      className={`square${selected ? " square--selected" : ""}${
        isCustom ? " custom-square" : ""
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="square__title">{text}</span>
    </button>
  );
}
