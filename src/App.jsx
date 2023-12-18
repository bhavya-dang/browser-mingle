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

  const [channel, setChannel] = useState(undefined);


  // Function to send a message
  async function sendMessage() {
    if (input && input.trim() !== "" && channel && room) {

      //channel.subscribe((status) => {
      //  if (status !== 'SUBSCRIBED') { return }

        // Send a message once the client is subscribed
        await channel.send({
          type: 'broadcast',
          event: 'message',
          payload: {
            room_id: room,
            content: input.slice(0, 512),
            timestamp: new Date(),
            username: lusername,
            type: "message"
          },
        })
      //});

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
        if (response) {
          setTopic(response.title);
        } else {
          alert("Unable to set topic. Please reload the tab and re-launch the extension.");
        }
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
    if (room) {
      
      const subscription = supabase
        .channel(room, {
          config: {
            broadcast: { self: true },
          },
        })
        .on(
          "broadcast",
          { event: "message" },
          (res) => {
            const payload = res.payload;

            if (payload.type === "reaction") {
              let emoji;
              switch (payload.content) {
                case "vibin":
                  emoji = "https://emoji.discadia.com/emojis/788f3a39-7ecf-4aee-bac0-d7c0dbbf02a3.gif";
                  break;
                case "pepe":
                  emoji = "https://emoji.discadia.com/emojis/PepeRain.gif";
                  break;
                case "gojo":
                  emoji = "https://emoji.discadia.com/emojis/cdb3e0e6-85b8-47a5-b0dc-38b5ff4b0916.gif";
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
                            <img src=${emoji} alt=${payload.content}>
                            <p style="font-size: 40%;">${payload.username}</p>
                          </div>`,
                number: 1,
                size: [4, 5],
                repeat: 1,
              });
            } else if (payload.content.trim() === ":q")  {
              insertEgg("https://rvcsutokdfgfytaugjyw.supabase.co/storage/v1/object/public/eggs/vim-linux.gif", payload.username);
              addMessage(payload);
            } else if (payload.content.includes("big brain")) {
              insertEgg("https://rvcsutokdfgfytaugjyw.supabase.co/storage/v1/object/public/eggs/mind-blown-mind-explosion.gif", payload.username);
              addMessage(payload);
            } else if (payload.content.includes("supabase")) {
              insertEgg("https://rvcsutokdfgfytaugjyw.supabase.co/storage/v1/object/public/eggs/supabase.png", payload.username);
              addMessage(payload);
            } else {
              addMessage(payload);
            }
          }
        );

        subscription.subscribe();

        setChannel(subscription);
      }
  }, [room]);

  return (
    <div className="flex flex-col min-h-screen max-h-screen"> {/* min-h-screen max-h-screen */}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 space-y-2">
        
          <div className="flex h-24">
            <NavBar topic={topic} similarRooms={similarRooms} setTopic={setTopic} />
          </div>

          <div className="flex flex-1 overflow-x-hidden overflow-y-auto">
            <MessageList messages={messages} username={lusername} />
          </div>

        </div>
      </div>

      <MessageInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        room={room}
        lusername={lusername}
        channel={channel}
      />

    </div>
  );
};

export default App;
