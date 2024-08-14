import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./search.css";
import axios from "axios";
import Result from "../Result/Result";
import { sym } from "./data";

const Search = () => {
  // const valueGabber = useRef("");
  const [isScreenLarge, setIsScreenLarge] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsScreenLarge(window.innerWidth > 1083);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // call once initially

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [trackList, setTrackList] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [predictedList, setPredictedList] = useState([]);

  useEffect(() => {
    const filtered = sym.filter((item) => toFilter(item));
    const newFiltered = filtered.slice(0, 10);
    setData(newFiltered);
  }, [text]);

  useEffect(() => {
    const fetchApi = async () => {
      const postData = { list: trackList };
      try {
        const res = await axios.post("http://34.131.80.63/", postData);
        // console.log(res["data"]);
        const sliceData = res["data"].slice(0, 5);

        setPredictedList(sliceData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApi();
  }, [trackList]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleClick = (e) => {
    const { value } = e.target.dataset;
    const newList = [...trackList];

    if (newList.includes(value)) {
      const index = newList.indexOf(value);
      if (index > -1) {
        // only splice array when item is found
        newList.splice(index, 1); // 2nd parameter means remove one item only
      }

      setTrackList(newList);
    } else {
      const newList = [value, ...trackList];

      const timer = setTimeout(() => {
        setIsFocused(false);
        setTrackList(newList);
      }, 300);
      return () => clearTimeout(timer);
    }
  };

  const removeBtn = (e) => {
    const { value } = e.target.dataset;
    const newList = [...trackList];

    const index = newList.indexOf(value);
    if (index > -1) {
      // only splice array when item is found
      newList.splice(index, 1); // 2nd parameter means remove one item only
    }
    setTrackList(newList);
  };

  const handleBlur = () => {};

  useEffect(() => {
    const handleBlur = () => {
      if (isFocused) {
        setIsFocused(false);
      }
    };
    handleBlur();
  }, [trackList]);

  const toFilter = (item) => {
    try {
      if (item.substring(0, text.length).toLowerCase() === text.toLowerCase()) {
        return item;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Heading />
      <center>
        <p
          style={{
            color: "white",
            fontSize: `${isScreenLarge ? 27 : 15}px`,
            fontWeight: "600",
          }}
        >
          What{" "}
          <span style={{ font: "Montserrat", color: "#FC8621" }}>symptoms</span>{" "}
          are you experiencing?
        </p>
      </center>
      <div className="searchContainer">
        <input
          type="text"
          style={isFocused ? { borderRadius: "35px 35px 0px 0px" } : {}}
          className="searchInput"
          placeholder="Symptoms"
          // ref={valueGabber}
          onChange={(e) => handleChange(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleClick}
        />
        {/* <FaSearch
          style={{ fontSize: "30px", marginTop: "10px", marginLeft: "-10px" }}
        /> */}
      </div>

      <div
        className="displayContainer"
        style={isFocused ? { display: "block" } : { display: "none" }}
      >
        {data.map((item) => {
          return (
            <div className="showContainer" key={item}>
              <FaSearch style={{ paddingTop: "10px", fontSize: "30px" }} />
              <button
                className="showContainer"
                style={{ backgroundColor: "transparent" }}
                data-value={item}
                onClick={handleClick}
              >
                {item}
              </button>
            </div>
          );
        })}
      </div>

      <div className="selectedContainer">
        {trackList.map((item, index) => {
          if (item == undefined) {
            return <></>;
          } else {
            return (
              <div className="selectedItems" key={index}>
                <p
                  style={{
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {item}
                </p>
                <button
                  className="removeBtn"
                  onClick={removeBtn}
                  data-value={item}
                >
                  <span className="XBtn" onClick={removeBtn} data-value={item}>
                    x
                  </span>
                </button>
              </div>
            );
          }
        })}
      </div>
      <div className="resultContainer">
        {predictedList.map((item, index) => {
          const { disease, sym } = item;
          return (
            <>
              <Result
                key={index}
                disease={disease}
                sym={sym}
                updateList={handleClick}
                trackList={trackList}
              />
            </>
          );
        })}
      </div>
    </>
  );
};

const Heading = () => {
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
    <div
      className="flexbox"
      style={
        isScreenLarge
          ? {
              marginTop: "100px",
              justifyContent: "center",
            }
          : {
              margin: "50px",
              justifyContent: "center",
            }
      }
    >
      <center>
        <h2
          style={{
            color: "black",
            font: "Montserrat",
            fontSize: `${isScreenLarge ? 53 : 37}px`,

            fontWeight: "700",
          }}
        >
          <span style={{ color: "white" }}>Your Health is </span>{" "}
          <span style={{ color: "#FC8621" }}> our priority</span>
        </h2>
      </center>
    </div>
  );
};

export default Search;
