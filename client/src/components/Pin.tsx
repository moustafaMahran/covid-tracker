const PinComponent: React.FC<any> = ({ text, age }) => (
  <div
    style={{
      color: "white",
      background: "#ffca22",
      padding: "15px 10px",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "100%",
      transform: "translate(-50%, -50%)",
    }}
  >
    {text}
    <br />
    {age}
  </div>
);
export default PinComponent;
