import React, { useState, useEffect } from "react";
import DataContext from "./context/DataContext";
import UserLogin from "./components/UserLogin";
import AdminLogin from "./components/AdminLogin";
import SpotifyLogin from "./components/SpotifyLogin";
import SpotifyPlayer from "./components/SpotifyPlayer";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [userToken, setUserToken] = useState("");
  // const [machineId, setMachineId] = useState("");

  useEffect(() => {
    async function getSpotifyToken() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setSpotifyToken(json.access_token);
    }
    getSpotifyToken();
  }, []);

  // const getCookie = (keyName) => {
  //   if (document.cookie.length != 0) {
  //     let array = document.cookie.split(";");
  //     for (x = 0; x < array.length; x++) {
  //       let subArray = array[x].split("=");
  //       let name = subArray[0];
  //       let value = subArray[1];
  //       if (name === keyName) {
  //         return value;
  //       }
  //     }
  //   }
  // };

  // const getColor = () => {
  //   return getCookie("color");
  // };

  // const getMachineId = () => {
  //   return getCookie("machineId");
  // };

  // const setCookie = () => {
  //   let cookieName = "machineId";
  //   let cookieValue = uuidv4();
  //   let cookieExpiration = 365;
  //   let color = "red";
  //   let width = 50;
  //   let height = 100;
  //   document.cookie =
  //     `machineId=${cookieValue}` +
  //     ";" +
  //     `expires=${cookieExpiration}` +
  //     ";" +
  //     `color=${color}` +
  //     ";" +
  //     `width=${width}` +
  //     ";" +
  //     `height=${height}`;
  // };

  return (
    <DataContext.Provider
      value={{
        userToken,
        setUserToken,
      }}
    >
      <div>
        <div className="font-extrabold mt-16 rounded-md border-2 w-40 bg-[#44c767] text-[#ffffff] p-2 ml-40">
          <div>
            {spotifyToken === "" ? (
              <SpotifyLogin />
            ) : (
              <SpotifyPlayer token={spotifyToken} />
            )}
          </div>
        </div>
        <div className="mt-16 p-2">
          <UserLogin />
        </div>
        <div className="mt-16 p-2">
          <AdminLogin />
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default App;
