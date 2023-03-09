import React, { useEffect, useState } from "react";

const Manage = () => {
  const [listOfUsers, setListOfUsers] = useState([]);

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
    console.log(resJSON);
  };

  const handleClick = (e) => {
    const email = e.target.id;
    const isAdmin = e.target.value === "true" ? false : true;

    console.log(email);
    console.log(e.target.value);
    console.log(isAdmin);
    console.log(typeof e.target.value);
    e.preventDefault();
    const updatedUser = {
      email: email,
      isAdmin: isAdmin,
    };
    updateAdmin(updatedUser);
  };

  return (
    <div className="border-[13px] border-transparent h-[844px] motion-safe:animate-fadeIn">
      <table className="bg-[#10181D] text-[#8B8B8B] font-barlow text-sm text-left">
        <thead className="w-full text-sm text-left">
          <tr className="border-b border-[#8B8B8B]">
            <th className="pb-4">Email</th>
            <th className="pb-4">Admin</th>
            <th className="pb-4">Action</th>
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
                <td className="w-2/6 h-2/6">
                  {user.isAdmin ? (
                    <button
                      className="pt-6 text-red-400"
                      onClick={handleClick}
                      id={user.email}
                      value={user.isAdmin}
                    >
                      Remove as Admin
                    </button>
                  ) : (
                    <button
                      className="pt-6"
                      onClick={handleClick}
                      id={user.email}
                      value={user.isAdmin}
                    >
                      Promote to Admin
                    </button>
                  )}
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
