import React from "react";
import Navbtn from "./Navbtn";

const NavBar = ({ topic, similarRooms, setTopic }) => {
  return (
    <div>
       <div className="flex gap-3 w-auto">
        <Navbtn topic={topic} similarRooms={similarRooms} setTopic={setTopic}></Navbtn>
        <p className="btn btn-ghost text-xl break-all">{topic}</p>
      </div>
    </div>
  );
};

export default NavBar;
