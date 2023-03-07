import React, { useState, useEffect } from "react";
import DataContext from "./context/DataContext";
import SpotifyLogin from "./components/SpotifyLogin";
import SpotifyPlayer from "./components/SpotifyPlayer";
import Playlist from "./components/Playlist";
import Headers from "./components/Headers";

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [userToken, setUserToken] = useState("");
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [adminIsLoggedIn, setAdminIsLoggedIn] = useState(false);
  const [adminFormIsOpen, setAdminFormIsOpen] = useState(false);
  const [userFormIsOpen, setUserFormIsOpen] = useState(false);

  // Get spotiify token
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
        userIsLoggedIn,
        setUserIsLoggedIn,
        adminIsLoggedIn,
        setAdminIsLoggedIn,
        adminFormIsOpen,
        setAdminFormIsOpen,
        userFormIsOpen,
        setUserFormIsOpen,
      }}
    >
      <div className="bg-[#181818] rounded-3xl border-transparent border-4 relative">
        <span className="absolute ml-[168px] border border-[#8B8B8B] bg-[#8B8B8B] w-16 h-2 mt-2 rounded-full"></span>
        <Headers />
        <div className="text-white font-bold mt-[-10px] text-lg text-left border-[13px] border-transparent">
          Good morning
        </div>
        <div>
          <div>
            <Playlist />
          </div>
          <div>
            {spotifyToken === "" ? (
              <SpotifyLogin />
            ) : (
              <SpotifyPlayer token={spotifyToken} />
            )}
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default App;
