import React, { useState, useEffect } from "react";
import DataContext from "./context/DataContext";
import UserLogin from "./components/UserLogin";
import AdminLogin from "./components/AdminLogin";
import SpotifyLogin from "./components/SpotifyLogin";
import SpotifyPlayer from "./components/SpotifyPlayer";

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    async function getSpotifyToken() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setSpotifyToken(json.access_token);
    }
    getSpotifyToken();
  }, []);

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
