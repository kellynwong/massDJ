import React, { useContext } from "react";
import DataContext from "../context/DataContext";
import SpotifyLogin from "./SpotifyLogin";
import SpotifyPlayer from "./SpotifyPlayer";
import Playlist from "./Playlist";
import QRCode from "react-qr-code";

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
        <div style={{ background: "white", padding: "16px" }}>
          <QRCode value={window.location.href} />
        </div>
      </div>
      <div>
        {dataContext.user.isAdmin &&
          (dataContext.spotifyToken === "" ? (
            <SpotifyLogin />
          ) : (
            <SpotifyPlayer token={dataContext.spotifyToken} />
          ))}
      </div>
      <div>
        {dataContext.user.email || dataContext.user.isAdmin ? (
          <div className="mt-[5px]"></div>
        ) : (
          <div className="mt-[-80px]"></div>
        )}
        <Playlist />
      </div>
    </div>
  );
}

export default Homepage;
