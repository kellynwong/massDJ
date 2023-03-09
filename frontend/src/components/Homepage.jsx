import React, { useContext } from "react";
import DataContext from "../context/DataContext";
import SpotifyLogin from "./SpotifyLogin";
import SpotifyPlayer from "./SpotifyPlayer";
import Playlist from "./Playlist";

function Homepage() {
  const dataContext = useContext(DataContext);

  return (
    <div>
      {dataContext.user.email ? (
        <div className="mt-[-45px] text-[#8B8B8B] font-barlow text-lg text-left border-[13px] border-transparent motion-safe:animate-fadeIn">
          Welcome <span className="text-white">{dataContext.user.email}</span>,
        </div>
      ) : null}
      <div>
        {dataContext.user.isAdmin &&
          (dataContext.spotifyToken === "" ? (
            <SpotifyLogin />
          ) : (
            <SpotifyPlayer token={dataContext.spotifyToken} />
          ))}
      </div>
      <div>
        <div className="mt-[-15px]">
          <Playlist />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
