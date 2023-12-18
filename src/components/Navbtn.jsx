export default function Navbtn({ topic, similarRooms, setTopic }) {

  function changeRoom(room_topic) {
    console.log("changed new topic in Navbtn", room_topic);
    setTopic(room_topic);
  }

  return (
    <div className="dropdown dropdown-hover">
      <div tabIndex={0} role="button" className="btn btn-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-secondary text-primary-content"
      >
        <div className="card-body p-2">
          Similar Rooms:
          {
            similarRooms.map((room, index) => {
              return (
                <button key={index} className="btn btn-accent font-mono" onClick={() => changeRoom(room)}>
                  {room}
                </button>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}
