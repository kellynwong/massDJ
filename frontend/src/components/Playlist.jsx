import React, { useState, useEffect, useContext } from "react";
import DataContext from "../context/DataContext";

function Playlist() {
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState("");
  const dataContext = useContext(DataContext);

  // Refresh page to update vote count and disable voting for songs user has voted for
  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("This will run every second!");
      const displaySongs = async () => {
        const res = await fetch("/api/playlist");
        const playlist = await res.json();
        setPlaylist(playlist);
      };
      displaySongs();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [dataContext.userToken]);

  // Sends request periodically to evaluate progress of song currently playing
  useEffect(() => {
    const interval = setInterval(() => {
      if (dataContext.user.isAdmin) {
        // console.log("This too shall run?");
        const currentlyPlaying = async () => {
          const res = await fetch("/api/pollqueue");
          const currentSong = await res.json();
          if (currentSong.duration_ms) {
            setCurrentSong(currentSong);
          }
        };
        currentlyPlaying();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [dataContext.user.isAdmin, dataContext.userToken]);

  const handleClick = async (e) => {
    let songId = e.target.value;
    console.log(songId);
    // prints 63ff9a581b6a4f463d8c5f82

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: songId,
      }),
    };

    const url = "/api/song";
    const res = await fetch(url, requestOptions);
    await res.json();
  };

  const handleChange = async (id, voting) => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        vote: voting,
      }),
    };
    const url = "/api/playlist";
    const res = await fetch(url, requestOptions);
    const vote = await res.json();
  };

  return (
    <div className="border-[13px] border-transparent">
      {/* Show currently playing song to users (no controls)*/}
      {dataContext.user.isAdmin ? null : (
        <div className="border-[13px] border-transparent font-barlow text-[15px] text-[#8B8B8B]">
          <div className="ml-4">
            <img src={dataContext.current_track.album.images[0].url} alt="" />
          </div>
          <div className="mt-4 text-center">
            <div className="">{dataContext.current_track.name}</div>
            <div>{dataContext.current_track.artists[0].name}</div>
          </div>
        </div>
      )}

      <table className="bg-[#10181D] text-[#8B8B8B] font-barlow text-sm text-left">
        <thead className="w-full text-sm text-left">
          <tr className="border-b border-[#8B8B8B]">
            <th className="pb-4">Title</th>
            <th className="pb-4"></th>
            <th className="pb-4">Status</th>
            {dataContext.user.isAdmin && <th className="pb-4">Admin</th>}
            <th className="pb-4">#</th>
            <th className="pb-4">Vote</th>
          </tr>
        </thead>
        <tbody>
          {playlist.map((song, index) => {
            return (
              <tr key={index}>
                <td className="w-1/6 h-1/6 pt-6 pr-2">
                  <img src={song.imgUrl} />
                </td>
                <td className="w-2/6 h-2/6 pt-6">
                  <div className="text-[#FEFEFE] font-bold"> {song.title}</div>
                  <div className="font-thin"> {song.artist}</div>
                </td>
                <td className="w-3/12 h-3/12 pt-4 pl-2">
                  {index === 0 ? "Up Next" : null}
                  {index === playlist.length - 1 ? "Currently Playing" : null}
                  {index === playlist.length - 2 ? "Last Played" : null}
                </td>
                {dataContext.user.isAdmin && (
                  <td className="w-1/6 h-1/6 pt-4">
                    <button
                      type="text"
                      value={song._id}
                      onClick={handleClick}
                      className="text-left"
                    >
                      Play Now
                    </button>
                  </td>
                )}
                <td className="w-1/6 h-1/6 pt-4">{song.count}</td>
                {song.votedBefore ? (
                  <div className="w-1/6 h-1/6 ml-2  mt-8">NA</div>
                ) : (
                  <td className="w-1/6 h-1/6 pt-6 text-center">
                    <button onClick={() => handleChange(song._id, 1)}>+</button>
                    <br />
                    <button onClick={() => handleChange(song._id, -1)}>
                      -
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Playlist;
