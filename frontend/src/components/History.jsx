import React, { useEffect, useState } from "react";
import Moment from "moment";

const History = () => {
  const [history, setHistory] = useState([
    // {restaurant: "",
    // imgUrl: "",
    //   title: "",
    //   artist: "",
    //   vote: 0,
    //
    //    createdAt: ""
    // },
  ]);
  Moment.locale("en");

  const getHistory = async () => {
    const res = await fetch("/api/accounthistory");
    const history = await res.json();
    setHistory(history);
  };
  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="border-[13px] border-transparent h-[844px] motion-safe:animate-fadeIn">
      <table className="bg-[#10181D] text-[#8B8B8B] font-barlow text-sm text-left">
        <thead className="w-full text-sm text-left">
          <tr className="border-b border-[#8B8B8B]">
            <th className="pb-4">Date Voted</th>
            <th className="pb-4"></th>
            <th className="pb-4">Title</th>
            <th className="pb-4">Artist</th>
            <th className="pb-4">Vote</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record, index) => {
            return (
              <tr key={index}>
                <td className="w-2/6 h-2/6 pt-6 pr-2">
                  {Moment(record.createdAt).format("DD MMM YY, HH:MM")}
                </td>
                <td className="w-2/6 h-2/6">
                  <img src={record.imgUrl} />
                </td>
                <td className="w-2/6 h-2/6">{record.title}</td>
                <td className="w-2/6 h-2/6">{record.artist}</td>
                <td className="w-2/6 h-2/6">{record.vote}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default History;
