import "./UseScaleBlock.css";

export default function UseScaleBlock({
  level = "LEVEL N",
  label = "NO AI",
  labelBg = "#f600f6ff",
}) {
  return (
    <div className="use-scale-block">
      <div className="use-scale-block-level">{level}</div>
      <div className="use-scale-block-label" style={{ background: labelBg }}>
        {label}
      </div>
    </div>
  );
}
