import React, { useState, useEffect, useContext } from "react";
import DataContext from "../context/DataContext";

function Playlist() {
  const [playlist, setPlaylist] = useState([]);
  const dataContext = useContext(DataContext);

  useEffect(() => {
    const displaySongs = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      };
      const url = "http://localhost:3000/playlist";
      const res = await fetch(url, requestOptions);
      const playlist = await res.json();
      setPlaylist(playlist);
    };
    displaySongs();
  }, []);

  const handleClick = async (e) => {
    let songId = e.target.value;
    console.log(songId);
    // prints 63ff9a581b6a4f463d8c5f82

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: songId,
      }),
    };

    const url = "http://localhost:3000/song";
    const res = await fetch(url, requestOptions);
    const song = await res.json();
  };

  const handleChange = async (id, voting) => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dataContext.userToken}`,
      },
      body: JSON.stringify({
        id: id,
        vote: voting,
      }),
    };
    const url = "http://localhost:3000/playlist";
    const res = await fetch(url, requestOptions);
    const vote = await res.json();
  };

  return (
    <>
      {playlist.map((song, index) => {
        return (
          <table className="border-2 w-3/5 flex justify-left items-center bg-[#333333] text-[#FEFEFE] font-myNerve">
            <tbody>
              <tr key={index}>
                <td className="w-1/5 h-1/5">
                  <img src={song.imgUrl} />
                </td>
                <td className="w-1/5 h-1/5">{song.artist}</td>
                <td className="w-1/5 h-1/5">{song.title}</td>
                <td className="w-1/5 h-1/5">
                  <button type="text" value={song._id} onClick={handleClick}>
                    Play Now
                  </button>
                </td>

                <td className="w-1/5 h-1/5">{song.count || 0} votes</td>

                {song.votedBefore ? (
                  <h4>NA</h4>
                ) : (
                  <td className="w-1/5 h-1/5">
                    <button onClick={() => handleChange(song._id, 1)}>+</button>
                    Vote
                    <button onClick={() => handleChange(song._id, -1)}>
                      -
                    </button>
                  </td>
                )}

                {/* <td className="w-1/5 h-1/5">{song.votedBefore}</td> */}
              </tr>
            </tbody>
          </table>
        );
      })}
    </>
  );
}

export default Playlist;
