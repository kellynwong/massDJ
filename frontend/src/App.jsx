import React, { useState, useEffect } from "react";
import DataContext from "./context/DataContext";
import Homepage from "./components/Homepage";
import Manage from "./components/Manage";
import History from "./components/History";
import Headers from "./components/Headers";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [userToken, setUserToken] = useState("");
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [user, setUser] = useState("");
  const [current_track, setTrack] = useState(track);
  const [history, setHistory] = useState([
    // {
    //   title: "",
    //   artist: "",
    //   vote: 0,
    //   restaurant: "",
    //    date: ""
    // },
  ]);

  // Get spotify token
  useEffect(() => {
    async function getSpotifyToken() {
      const response = await fetch("/api/auth/token");
      const json = await response.json();
      setSpotifyToken(json.access_token);
    }
    getSpotifyToken();

    async function getUser() {
      try {
        const response = await fetch("/api/users/profile");
        const user = await response.json();
        setUser(user);
      } catch (error) {
        // not logged in
      }
    }
    getUser();
  }, []);

  return (
    <DataContext.Provider
      value={{
        spotifyToken,
        setSpotifyToken,
        userToken,
        setUserToken,
        formIsOpen,
        setFormIsOpen,
        user,
        setUser,
        current_track,
        setTrack,
        history,
        setHistory,
      }}
    >
      <div className="bg-[#181818] rounded-3xl border-transparent border-4 relative">
        <span className="absolute ml-[168px] border border-[#8B8B8B] bg-[#8B8B8B] w-16 h-2 mt-2 rounded-full"></span>
        <BrowserRouter>
          <Headers />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </BrowserRouter>
      </div>
    </DataContext.Provider>
  );
}

export default App;
