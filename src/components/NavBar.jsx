import React from "react";
import Navbtn from "./Navbtn";

const NavBar = ({ topic, similarRooms, setTopic }) => {
  return (
    <div>
       <div className="flex gap-3">
        <Navbtn topic={topic} similarRooms={similarRooms} setTopic={setTopic}></Navbtn>
        <a className="btn btn-ghost text-xl">{topic}</a>
      </div>
    </div>
  );
};

export default NavBar;
