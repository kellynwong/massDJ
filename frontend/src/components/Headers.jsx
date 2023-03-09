import React, { useContext } from "react";
import DataContext from "../context/DataContext";
import Login from "./Login";
import { Link } from "react-router-dom";

const Headers = () => {
  const dataContext = useContext(DataContext);

  const handleLoginSignup = () => {
    dataContext.formIsOpen
      ? dataContext.setFormIsOpen(false)
      : dataContext.setFormIsOpen(true);
  };

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST" });
    dataContext.setUser("");
    window.location.href = "/";
  };

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div className="inline-flex">
        {/* massDJ logo */}
        <div onClick={goHome}>
          {dataContext.user.isAdmin ? (
            <div>
              <img
                className="w-28 h-28 ml-2"
                src="/src/assets/massDJadmin.png"
              />
            </div>
          ) : (
            <div>
              <img className="w-28 h-28 ml-2" src="/src/assets/massDJ.png" />
            </div>
          )}
        </div>

        {/* Manage logo for Admin*/}
        <div className="ml-36 mr-[-10px]">
          {dataContext.user.isAdmin && (
            <Link to="manage">
              <div>
                <img
                  className="w-16 h-16 mt-2"
                  src="/src/assets/manageAdmin.png"
                />
              </div>
            </Link>
          )}

          {/* History logo for User*/}
          {dataContext.user.email && !dataContext.user.isAdmin && (
            <Link to="history">
              <div>
                <img
                  className="w-16 h-16 mt-2"
                  src="/src/assets/historyUser.png"
                />
              </div>
            </Link>
          )}
        </div>

        {/* Login logo*/}
        <div className="mt-1">
          {dataContext.user.email ? (
            <img
              className="w-16 h-16 mt-1 "
              src="/src/assets/login.png"
              onClick={handleLogout}
            />
          ) : (
            <img
              className="w-16 h-16 ml-14"
              src="/src/assets/notLogin.png"
              onClick={handleLoginSignup}
            />
          )}
        </div>
      </div>
      {dataContext.formIsOpen && <Login />}
    </>
  );
};

export default Headers;
