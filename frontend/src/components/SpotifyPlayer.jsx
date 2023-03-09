import React, { useState, useEffect, useContext } from "react";
import DataContext from "../context/DataContext";
import { RiSkipForwardLine } from "react-icons/ri";

function SpotifyPlayer(props) {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const dataContext = useContext(DataContext);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK 2",
        getOAuthToken: (cb) => {
          cb(props.token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", async ({ device_id }) => {
        console.log("Ready with Device ID", device_id);

        let url = "https://api.spotify.com/v1/me/player";
        let requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.token}`,
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: true,
          }),
        };
        const resp = await fetch(url, requestOptions);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        dataContext.setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);

  if (!is_active) {
    return (
      <>
        <div>
          <div>
            <b className="text-[#181818]">
              {" "}
              Instance not active. Transfer your playback using your Spotify app{" "}
            </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="border-[13px] border-transparent font-barlow text-[15px] text-[#8B8B8B] mb-[-80px]">
          <div className="ml-7">
            <img src={dataContext.current_track.album.images[0].url} alt="" />

            <div className="mt-4 ml-[-25px] text-center">
              <div className="font-bold">{dataContext.current_track.name}</div>
              <div>{dataContext.current_track.artists[0].name}</div>

              <button
                onClick={() => {
                  player.nextTrack();
                }}
              >
                <RiSkipForwardLine className="text-[22px]" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SpotifyPlayer;
