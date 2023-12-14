import { useEffect, useState } from "react";
import "./App.css";
import supabase from "../supabase";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [lusername, _] = useState(localStorage.getItem("username"));
  const [topic, setTopic] = useState(""); // room topic
  const [room, setRoom] = useState(""); // room, controlled by getRoomId

  // Function to send a message
  async function sendMessage() {
    const message = input;
    if (message.trim() !== "") {
      const { data, error } = await supabase.from("messages").insert([
        {
          room_id: room,
          content: message,
          timestamp: new Date(),
          username: lusername,
        },
      ]);

      if (error) {
        console.error("Error sending message:", error.message);
      }

      setInput("");
      document.getElementById("input-box").value = "";
    }
  }

  async function addMessage(msgobj) {
    setMessages((prevMessages) => [...prevMessages, msgobj]);
  }

  async function getRoomId(name) {
    const { data, error } = await supabase.functions.invoke("join-room", {
      body: { topic: name },
    });

    return data.room_id;
  }

  useEffect(() => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: "room_id=eq." + room,
        },
        (payload) => {
          addMessage(payload.new);
        }
      )
      .subscribe();
  }, [room]);

  return (
    <>
      <div className="fixed bottom-10 pb-7 justify-center left-2 right-2  h-auto overflow-y-auto">
        {messages.map((msg, index) => {
          const dateObject = new Date(msg.timestamp);
          const formattedTime = `${dateObject.getHours()}:${dateObject.getMinutes()}`;
          return (
            <div className="flex items-center mb-2" key={index}>
              <div className="ml-3 text-left">
                <div className="text-sm font-medium text-black">
                  {msg.username}{" "}
                  <span className="text-gray-400">at {formattedTime}</span>
                </div>
                <div className="text-black ">
                  <span className="font-medium font-small ">{msg.content}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex fixed bottom-3 left-2 right-2 gap-3 justify-center   ">
        <input
          type="text"
          className="input input-bordered input-primary w-full max-w-xs rounded-md"
          name="message"
          id="input-box"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              sendMessage();
            }
          }}
          placeholder="say something"
        />
        <button
          className="btn btn-neutral rounded-md"
          onClick={() => sendMessage()}
        >
          Send
        </button>
      </div>
      <br />
      <input
        type="text"
        className="input input-bordered input-primary w-full max-w-xs rounded-md border-2 hover:border-4"
        name="room"
        id="tab-title"
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            getRoomId(topic).then((r) => setRoom(r));
          }
        }}
        placeholder="room topic"
      />

      <p>room id: {room}</p>
    </>
  );
}

export default App;
