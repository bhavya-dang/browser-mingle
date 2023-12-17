import React from "react";
import Navbtn from "./Navbtn";

const NavBar = ({ topic, similarRooms, setTopic }) => {
  return (
    <div className="flex w-full p-2 glass">
      <Navbtn topic={topic} similarRooms={similarRooms} setTopic={setTopic}></Navbtn>
      <div className="ml-4 text-xl truncate">{topic}</div>
    </div>
  );
};

export default NavBar;
