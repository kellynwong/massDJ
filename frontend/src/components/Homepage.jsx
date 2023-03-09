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
        <div className="mt-[-45px] mb-[-15px] text-[#8B8B8B] font-barlow text-lg text-left border-[13px] border-transparent motion-safe:animate-fadeIn">
          Welcome <span className="text-white">{dataContext.user.email}</span>,
        </div>
      ) : null}
      <div>
        {dataContext.user.isAdmin ? (
          <div className="bg-[#181818] p-3 mt-[-10px]">
            <div className="w-[100px] bg-white border-2 border-white mx-auto">
              <QRCode
                value={window.location.href}
                className="w-24 h-24 mx-auto"
              />
            </div>
          </div>
        ) : null}
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
