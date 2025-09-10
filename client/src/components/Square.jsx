import "./Sqaure.css";

export default function Square({ text, onClick, selected }) {
  return (
    <button
      className={`square${selected ? " square--selected" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span className="square__title">{text}</span>
    </button>
  );
}
