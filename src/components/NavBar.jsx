import React from "react";
import Navbtn from "./Navbtn";

const NavBar = ({ topic, roomId }) => {
  return (
    <div>
      <div className="navbar bg-accent-100">
        <div className="navbar-start">
          <Navbtn></Navbtn>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">{topic}</a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
