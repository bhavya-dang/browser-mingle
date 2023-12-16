export default function Navbtn() {
  const room_id = 123;
  const similarRooms = [
    {
      name: "room1",
      index: 1,
    },
    {
      name: "room2",
      index: 2,
    },
    {
      name: "room3",
      index: 3,
    },
  ];
  return (
    <div className="dropdown fixed top-2 left-2">
      <div tabIndex={0} role="button" className="btn btn-info">
        Rooms
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-secondary text-primary-content"
      >
        <div className="card-body">
          <p className="card-title">Current Room: {room_id}</p>
          <div>
            Similar rooms:
            {similarRooms.map((room, index) => {
              return <p key={index}>{room.name}</p>;
            })}
          </div>
          <button className="btn btn-error"> leave Room</button>
        </div>
      </div>
    </div>
  );
}
