import React, { useState, useEffect, useContext } from "react";
import DataContext from "../context/DataContext";

function Playlist() {
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState("");
  const [lastSong, setLastSong] = useState("");
  const dataContext = useContext(DataContext);

  // Refresh page to update vote count and disable voting for songs user has voted for
  useEffect(() => {
    const interval = setInterval(() => {
      // console.log("This will run every second!");
      const displaySongs = async () => {
        const res = await fetch("/api/playlist");
        const playlist = await res.json();
        setPlaylist(playlist);
        if (playlist?.length > 0) {
          const playlistWithNoNegatives = playlist.filter((song) => {
            return song.count >= 0;
          });
          const currentSong =
            playlistWithNoNegatives[playlistWithNoNegatives.length - 1];
          const lastSong =
            playlistWithNoNegatives[playlistWithNoNegatives.length - 2];
          setCurrentSong(currentSong);
          setLastSong(lastSong);
        }
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

  // Voting
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
  };

  return (
    <div className="border-[13px] border-transparent mt-16">
      {/* Show currently playing song to users (no controls)*/}
      {dataContext.user.isAdmin ? null : (
        <div className="border-[13px] border-transparent font-barlow text-[15px] text-[#8B8B8B] mt-[-40px]">
          <div className="mx-auto">
            <img src={currentSong.imgUrl} alt="" />
          </div>
          <div className="mt-4 text-center">
            <div>{currentSong.title}</div>
            <div className="mb-8">{currentSong.artist}</div>
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
                <td className="w-3/12 h-3/12 pt-4 pl-2 text-yellow-400">
                  {index === 0 ? "Up Next" : null}
                  {song._id === currentSong._id ? "Currently Playing" : null}
                  {song._id === lastSong._id ? "Last Played" : null}
                </td>
                {dataContext.user.isAdmin && (
                  <td className="w-1/6 h-1/6 pt-4">
                    <button
                      type="text"
                      value={song._id}
                      onClick={handleClick}
                      className="text-left pl-2"
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
