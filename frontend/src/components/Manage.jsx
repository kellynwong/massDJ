import React, { useState, useEffect, useContext } from "react";
import DataContext from "../context/DataContext";

const Manage = () => {
  const [listOfUsers, setListOfUsers] = useState([]);
  const dataContext = useContext(DataContext);

  // Get all users (include admin)
  const getUsers = async () => {
    const res = await fetch("/api/admin/users");
    const listOfUsers = await res.json();
    setListOfUsers(listOfUsers);
  };
  useEffect(() => {
    getUsers();
  }, []);

  const updateAdmin = async (updatedUser) => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    };
    const url = "/api/admin/users";
    const res = await fetch(url, requestOptions);
    const resJSON = await res.json();
    getUsers();
    if (updatedUser.email === dataContext.user.email) {
      // if the user demoted
      window.location.href = "/";
    }
  };

  const handleClick = (e) => {
    const email = e.target.id;
    const isAdmin = e.target.value === "true" ? false : true;

    e.preventDefault();
    const updatedUser = {
      email: email,
      isAdmin: isAdmin,
    };
    updateAdmin(updatedUser);
  };

  const handleDelete = async (e) => {
    const email = e.target.value;
    e.preventDefault();

    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    };
    const url = "/api/admin/users";
    const res = await fetch(url, requestOptions);
    await res.json();
    getUsers();
  };

  return (
    <div className="border-[13px] border-transparent h-[844px] motion-safe:animate-fadeIn">
      <table className="bg-[#10181D] text-[#8B8B8B] font-barlow text-sm text-left">
        <thead className="w-full text-sm text-left">
          <tr className="border-b border-[#8B8B8B]">
            <th className="pb-4">Email</th>
            <th className="pb-4">Admin</th>
            <th className="pb-4 pl-4">Promote</th>
            <th className="pb-4">Delete</th>
          </tr>
        </thead>
        <tbody>
          {listOfUsers.map((user, index) => {
            return (
              <tr key={index}>
                <td className="w-2/6 h-2/6 pt-6 pr-2">{user.email}</td>
                <td className="w-1/6 h-1/6 pt-6 pl-2">
                  {user.isAdmin ? (
                    <div className="text-green-400">Yes</div>
                  ) : (
                    "No"
                  )}
                </td>
                <td className="w-2/6 h-2/6 pl-4">
                  {user.isAdmin ? (
                    <button
                      className="pt-6 text-red-400"
                      onClick={handleClick}
                      id={user.email}
                      value={user.isAdmin}
                    >
                      Demote
                    </button>
                  ) : (
                    <button
                      className="pt-6"
                      onClick={handleClick}
                      id={user.email}
                      value={user.isAdmin}
                    >
                      Promote
                    </button>
                  )}
                </td>
                <td className="w-2/6 h-2/6">
                  <button
                    className="pt-6"
                    onClick={handleDelete}
                    value={user.email}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Manage;
