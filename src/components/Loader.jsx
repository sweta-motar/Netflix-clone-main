function Loader() {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton"></div>
      ))}
    </div>
  );
}

export default Loader;