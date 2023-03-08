import React, { useState, useEffect } from "react";
import DataContext from "./context/DataContext";
import SpotifyLogin from "./components/SpotifyLogin";
import SpotifyPlayer from "./components/SpotifyPlayer";
import Playlist from "./components/Playlist";
import Headers from "./components/Headers";

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [userToken, setUserToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [user, setUser] = useState("");

  // Get spotiify token
  useEffect(() => {
    async function getSpotifyToken() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setSpotifyToken(json.access_token);
    }
    getSpotifyToken();
  }, []);

  console.log(user);
  return (
    <DataContext.Provider
      value={{
        setSpotifyToken,
        userToken,
        setUserToken,
        isLoggedIn,
        setIsLoggedIn,
        formIsOpen,
        setFormIsOpen,
        user,
        setUser,
      }}
    >
      <div className="bg-[#181818] rounded-3xl border-transparent border-4 relative">
        <span className="absolute ml-[168px] border border-[#8B8B8B] bg-[#8B8B8B] w-16 h-2 mt-2 rounded-full"></span>
        <Headers />
        <div className="mt-[-10px] text-[#8B8B8B] font-barlow text-lg text-left border-[13px] border-transparent">
          Currently Playing:
        </div>
        <div>
          {user.isAdmin &&
            (spotifyToken === "" ? (
              <SpotifyLogin />
            ) : (
              <SpotifyPlayer token={spotifyToken} />
            ))}
        </div>
        <div>
          <div>
            <Playlist />
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );
}

export default App;
