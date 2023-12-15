import React from "react";

const NavBar = ({ topic, roomId }) => {
  return (
    <div className="navbar">
      <div className="flex-1 text-ellipsis">
        {topic}
      </div>
      <p>
        room ID: {roomId}
      </p>
    </div>
  );
};

export default NavBar;
