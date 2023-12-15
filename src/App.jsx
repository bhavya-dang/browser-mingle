import React, { useEffect, useState } from "react";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import NavBar from "./components/NavBar";
import supabase from "../supabase";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [lusername, _] = useState(localStorage.getItem("username"));
  const [topic, setTopic] = useState("");
  const [room, setRoom] = useState("");

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

  // function to send a reaction
  async function sendReaction() {
    const { data, error } = await supabase.from("messages").insert([
      {
        room_id: room,
        content: "😗",
        type: "reaction",
        timestamp: new Date(),
        username: lusername,
      },
    ]);
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
  
  // hook to request tab data whenever BrowserMingle window is loaded
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "window_tab_data_request" }, (response) => {
      console.log("WIN: received data from background script", response);
      setTopic(`${response.title} ${response.uri}`)
    });
  }, []);

  useEffect(() => {
    console.log("topic:", topic);
    if (topic !== null && topic !== "") {
      getRoomId(topic).then((r) => setRoom(r));
    }
  }, [topic])

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

          if (payload.new.type === "reaction") {
            alert("reaction");
          } else {
            addMessage(payload.new);
          }
        }

      )
      .subscribe();
  }, [room]);
  
  return (
    <>
      <NavBar className="bg-primary" topic={topic} roomId={room} />

      <MessageList messages={messages} username={lusername} />
      <MessageInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />

      <div>
        <button className="button" onClick={sendReaction}>send reaction</button>
      </div>
    </>
  );
}

export default App;
