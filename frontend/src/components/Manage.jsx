import React, { useEffect, useState } from "react";

// Server

// router.get("/api/admin/users", authAdmin, getUsersAdmin);

// // Get all users (authAdmin)
// const getUsersAdmin = async (req, res) => {
//   // console.log("req.decoded: " + req.decoded);
//   const users = await Users.find();
//   res.json(users);
// };

const Manage = () => {
  const [listOfUsers, setListOfUsers] = useState([]);

  // Get all users (include admin)

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch("/api/admin/users");
      const listOfUsers = await res.json();
      setListOfUsers(listOfUsers);
    };
    getUsers();
  }, []);

  return (
    <div className="border-[13px] border-transparent">
      <table className="bg-[#10181D] text-[#8B8B8B] font-barlow text-sm text-left">
        <thead className="w-full text-sm text-left">
          <tr className="border-b border-[#8B8B8B]">
            <th className="pb-4">Email</th>
            <th className="pb-4">Admin</th>
          </tr>
        </thead>
        <tbody>
          {listOfUsers.map((user, index) => {
            return (
              <tr key={index}>
                <td className="w-1/6 h-1/6 pt-6 pr-2">{user.email}</td>
                <td className="w-1/6 h-1/6 pt-6 pr-2">
                  {user.isAdmin ? "Yes" : "No"}
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
