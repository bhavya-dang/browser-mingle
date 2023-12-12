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
      const { data, error } = await supabase
        .from("messages")
        .insert([
          { room_id: room, content: message, timestamp: new Date(), username: lusername },
        ]);

      if (error) {
        console.error("Error sending message:", error.message);
      }

      setInput('');
      document.getElementById('input-box').value = '';
    }
  }

  async function addMessage(msgobj) {
    setMessages((prevMessages) => [...prevMessages, msgobj]);
  }

  async function getRoomId(name) {
    const { data, error } = await supabase.functions.invoke('join-room', {
      body: { topic: name }
    });

    return data.room_id;
  };

  useEffect(() => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: "room_id=eq."+room, },
        (payload) => {
          addMessage(payload.new);
        }
      )
      .subscribe();
  }, [room]);

  return (
    <>
      <div>
        {messages.map((msg, index) => {
          const dateObject = new Date(msg.timestamp);
          const formattedTime = `${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;
          return (
            <p key={index}>
              <i>
                {msg.username} at {formattedTime} says{" "}
              </i>
              <strong>{msg.content}</strong>
            </p>
          );
        })}
      </div>

      <input
        type="text"
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
      <button onClick={() => sendMessage()}>Send</button>

      <br />
      <input
        type="text"
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
