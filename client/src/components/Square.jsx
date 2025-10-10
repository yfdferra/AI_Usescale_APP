import "./Sqaure.css";

export default function Square({ text, onClick, selected }) {
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
