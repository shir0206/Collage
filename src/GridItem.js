import "./styles.css";

export default function GridItem({
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  color,
  id
}) {
  return (
    <div
      className="item"
      style={{
        gridColumnStart: colStart,
        gridColumnEnd: colEnd,
        gridRowStart: rowStart,
        gridRowEnd: rowEnd,
        background: color
      }}
    >
      {id}
    </div>
  );
}
