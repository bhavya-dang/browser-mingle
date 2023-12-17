import React, { useEffect, useState } from "react";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import supabase from "../supabase";
import floating from "floating.js";
import NavBar from "./components/NavBar";

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [lusername, _] = useState(localStorage.getItem("username"));
  const [topic, setTopic] = useState("");
  const [room, setRoom] = useState("");

  const [similarRooms, setsimilarRooms] = useState([]);


  // Function to send a message
  async function sendMessage() {
    const message = input;
    if (message.trim() !== "") {
      const { data, error } = await supabase.from("messages").insert([
        {
          room_id: room,
          content: message.slice(0, 512),
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

  function insertEgg(url, username) {
    floating({
      content: `<div style="display: block;">
                  <img src=${url}>
                  <p style="font-size: 40%;">${username}</p>
                </div>`,
      number: 1,
      size: [5, 6],
      repeat: 1,
    });
  }

  // hook to request tab data whenever BrowserMingle window is loaded
  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: "window_tab_data_request" },
      (response) => {
        console.log("WIN: received data from background script", response);
        setTopic(response.title);
      }
    );
  }, []);

  useEffect(() => {
    console.log("topic:", topic);
    if (topic !== null && topic !== "") {
      getRoomId(topic).then((r) => setRoom(r));

      // set similar rooms
      async function update_similar_rooms() {
        const { data, error } = await supabase.functions.invoke("vectorquery", {
          body: { topic: topic }
        });
        setsimilarRooms(data.topics);
      };
      update_similar_rooms();

    }

  }, [topic]);

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
            let emoji;
            switch (payload.new.content) {
              case "anya-scared":
                emoji = "https://cdn3.emoji.gg/emojis/2101-anya-7.png";
                break;
              case "pepecry":
                emoji = "https://cdn3.emoji.gg/emojis/4153-pepe-cry.png";
                break;
              case "shocked":
                emoji = "https://cdn3.emoji.gg/emojis/5850-shocked-emoji.png";
                break;
              case "blob":
                emoji = "https://cdn3.emoji.gg/emojis/3314-blobby-the-blob.gif";
                break;
              case "mikuparty":
                emoji = "https://cdn3.emoji.gg/emojis/4548-miku-party.png";
                break;
              default:
              // code block
            }
            floating({
              content: `<div style="display: block;">
                          <img src=${emoji} alt=${payload.new.content}>
                          <p style="font-size: 40%;">${payload.new.username}</p>
                        </div>`,
              number: 1,
              size: [4, 5],
              repeat: 1,
            });
          } else if (payload.new.content.trim() === ":q")  {
            insertEgg("https://rvcsutokdfgfytaugjyw.supabase.co/storage/v1/object/public/eggs/vim-linux.gif", payload.new.username);
            addMessage(payload.new);
          } else if (payload.new.content.includes("big brain")) {
            insertEgg("https://rvcsutokdfgfytaugjyw.supabase.co/storage/v1/object/public/eggs/mind-blown-mind-explosion.gif", payload.new.username);
            addMessage(payload.new);
          } else if (payload.new.content.includes("supabase")) {
            insertEgg("https://rvcsutokdfgfytaugjyw.supabase.co/storage/v1/object/public/eggs/supabase.png", payload.new.username);
            addMessage(payload.new);
          } else {
            addMessage(payload.new);
          }
        }
      )
      .subscribe();
  }, [room]);

  return (
    <>
      {/*
      <img
        alt=""
        className="bg-[url(https://www.openbin.dev/_next/static/media/grid.41943b4a.svg)] w-full h-full object-cover filter brightness-75 blur-lg"
        width="1308"
      />
      */}

      <div className="h-full relative">

        <div className="p-4 w-full z-10 fixed top-0 z-10 glass">
          <NavBar topic={topic} similarRooms={similarRooms} setTopic={setTopic} />
        </div>

        <div className="overflow-auto p-4 my-16">
          <MessageList messages={messages} username={lusername} />
        </div>

        <div className="p-4 w-full z-10 fixed bottom-0 z-10 flex justify-center">
          <MessageInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            room={room}
            lusername={lusername}
          />
        </div>
      </div>

      {/* <EmojiBar room={room} lusername={lusername} /> */}

      {/* <div>
        <button className="button" onClick={sendReaction}>send reaction</button>
      </div> */}
    </>
  );
};

export default App;
