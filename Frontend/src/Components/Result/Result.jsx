import React, { useState, useRef, useEffect } from "react";
import "./result.css";

const Result = ({ disease, sym, updateList, trackList }) => {
  const [isScreenLarge, setIsScreenLarge] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsScreenLarge(window.innerWidth > 1083);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // call once initially

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="container1">
        <h2>{disease}</h2>
        <p>Which symptoms match the {disease}?</p>
        <div className="flex">
          {sym.map((item, index) => {
            const isInList = trackList.includes(item);
            return (
              <button
                className={isInList ? "selectContainer2" : "container2"}
                onClick={updateList}
                data-value={item}
                key={index}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Result;
