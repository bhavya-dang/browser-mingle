export default function Navbtn({ topic, similarRooms, setTopic }) {

  function changeRoom(room_topic) {
    console.log("changed new topic in Navbtn", room_topic);
    setTopic(room_topic);
  }

  return (
    <div className="dropdown dropdown-hover">
      <div tabIndex={0} role="button" className="btn btn-info">
        Rooms
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-secondary text-primary-content"
      >
        <div className="card-body">
          <p className="card-title">Current Room: {topic}</p>
          <div>
            Similar rooms:
            {
              similarRooms.map((room, index) => {
                return (
                  <div>
                    <p>{room}</p>
                    <button key={index} onClick={() => changeRoom(room)}>set</button>
                  </div>
                )
              })
            }
          </div>
          <button className="btn btn-error"> leave Room</button>
        </div>
      </div>
    </div>
  );
}
