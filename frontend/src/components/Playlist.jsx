import React, { useState, useEffect } from "react";

function Playlist() {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const displaySongs = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      };
      const url = "http://127.0.0.1:4000/playlist";
      const res = await fetch(url, requestOptions);
      const playlist = await res.json();
      setPlaylist(playlist);
      console.log(playlist);
    };
    displaySongs();
  }, []);

  // const handleGetSongsClick = async () => {
  //   // const token = data.access;
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       // Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   const url = "http://127.0.0.1:4000/playlist";
  //   const res = await fetch(url, requestOptions);
  //   const playlist = await res.json();
  //   setPlaylist(playlist);
  //   console.log(playlist);
  // };

  return (
    <>
      {/* <button
        className="rounded-md border-2 mt-4 w-80"
        type="submit"
        value="Update"
        onClick={handleGetSongsClick}
      >
        Get All Songs
      </button> */}
      {playlist.map((song, index) => {
        return (
          <table className="border-2 w-80 flex justify-left items-center bg-[#333333] text-[#FEFEFE] font-myNerve">
            <tbody>
              <tr key={index}>
                <td className="w-1/4 h-1/4">
                  <img src={song.imgUrl} />
                </td>
                <td className="w-1/4 h-1/4">{song.artist}</td>
                <td className="w-1/4 h-1/4">{song.title}</td>
                {/* <td>{song.trackUrl}</td> */}
              </tr>
            </tbody>
          </table>
        );
      })}
    </>
  );
}

export default Playlist;
