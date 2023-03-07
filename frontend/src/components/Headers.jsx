import React, { useState, useContext } from "react";
import DataContext from "../context/DataContext";
import AdminLogin from "./AdminLogin";
import UserLogin from "./UserLogin";

const Headers = () => {
  const dataContext = useContext(DataContext);

  const handleAdminLoginSignupClick = () => {
    dataContext.adminFormIsOpen
      ? dataContext.setAdminFormIsOpen(false)
      : dataContext.setAdminFormIsOpen(true);
  };

  const handleUserLoginSignupClick = () => {
    dataContext.userFormIsOpen
      ? dataContext.setUserFormIsOpen(false)
      : dataContext.setUserFormIsOpen(true);
  };

  return (
    <>
      <div className="inline-flex">
        {/* massDJ logo */}
        <div>
          <img className="w-28 h-28 " src="src/assets/massDJ.png" />
        </div>

        {/* Restaurant login logo*/}
        <div className="ml-36 mt-1">
          {dataContext.adminIsLoggedIn ? (
            <img className="w-16 h-16" src="src/assets/restaurantLogin.png" />
          ) : (
            <img
              className="w-16 h-16"
              src="src/assets/restaurantNotLogin.png"
              onClick={handleAdminLoginSignupClick}
            />
          )}
        </div>

        {/* User login logo*/}
        <div className="mt-1">
          {dataContext.userIsLoggedIn ? (
            <img className="w-16 h-16" src="src/assets/userLogin.png" />
          ) : (
            <img
              className="w-16 h-16"
              src="src/assets/userNotLogin.png"
              onClick={handleUserLoginSignupClick}
            />
          )}
        </div>
      </div>
      {dataContext.adminFormIsOpen && <AdminLogin />}
      {dataContext.userFormIsOpen && <UserLogin />}
    </>
  );
};

export default Headers;
