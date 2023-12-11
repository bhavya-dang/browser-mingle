import { useEffect, useState } from "react";
import "./App.css";
import supabase from "../supabase";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [lusername, setUsername] = useState(localStorage.getItem("username"));

  // Function to send a message
  async function sendMessage() {
    const message = input;
    if (message.trim() !== "") {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          { content: message, timestamp: new Date(), username: lusername },
        ]);

      if (error) {
        console.error("Error sending message:", error.message);
      }
      setInput("");
    }
  }

  async function addMessage(msgobj) {
    setMessages((prevMessages) => [...prevMessages, msgobj]);
  }

  useEffect(() => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          addMessage(payload.new);
        }
      )
      .subscribe();
  }, []);

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
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={() => sendMessage()}>Send</button>
    </>
  );
}

export default App;
