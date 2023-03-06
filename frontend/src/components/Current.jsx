import React, { useState, useEffect, useContext } from "react";
import DataContext from "../context/DataContext";

const Current = () => {
  const [currentSong, setCurrentSong] = useState("");
  const dataContext = useContext(DataContext);
  useEffect(() => {
    const currentlyPlaying = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dataContext.userToken}`,
        },
      };
      const url = "http://localhost:4000/current";
      const res = await fetch(url, requestOptions);
      console.log(res);
      const currentSong = await res.json();
      if (currentSong.duration_ms) {
        setCurrentSong(currentSong);
      }
    };
    currentlyPlaying();
  }, []);
  // return <div>Hello {currentSong.duration_ms}</div>;
};

export default Current;
