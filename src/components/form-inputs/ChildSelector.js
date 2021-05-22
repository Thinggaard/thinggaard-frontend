import React from "react";

const ChildSelector = () => {
  const [childCount, setChildCount] = useState(0);

  return (
    <div>
      <input
        type="number"
        onChange={(prev) => {
          setChildCount(prev + 1);
        }}
      />

      {childCount.map((item) => (
        <input type="number" />
      ))}
    </div>
  );
};

export default ChildSelector;
