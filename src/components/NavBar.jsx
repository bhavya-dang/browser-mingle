import React from "react";

const NavBar = ({ topic, roomId }) => {
  return (
    <div className="navbar">
      <div className="flex-1 text-ellipsis">
        {topic}
      </div>
    </div>
  );
};

export default NavBar;
