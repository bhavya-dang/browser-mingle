import React, { useEffect, useState } from "react";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
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
          addMessage(payload.new);
        }
      )
      .subscribe();
  }, [room]);

  
  return (
    <>
      <MessageList messages={messages} />
      <MessageInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
      />
  
      <p>room topic: {topic}</p>
      <p>room id: {room}</p>
    </>
  );
}

export default App;
