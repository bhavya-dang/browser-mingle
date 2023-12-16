import React, { useState } from "react";
import supabase from "../../supabase";

const EmojiBar = ({ room, lusername }) => {
  const [selectedEmoji, setSelectedEmoji] = useState("");
  // function to send a reaction
  async function sendReaction(emoji) {
    const { data, error } = await supabase.from("messages").insert([
      {
        room_id: room,
        content: emoji,
        type: "reaction",
        timestamp: new Date(),
        username: lusername,
      },
    ]);
  }

  const emojis = [
    {
      name: "anya-scared",
      identifier: "2101-anya-7.png",
    },
    {
      name: "pepecry",
      identifier: "4153-pepe-cry.png",
    },
    {
      name: "shocked",
      identifier: "5850-shocked-emoji.png",
    },
    {
      name: "blob",
      identifier: "3314-blobby-the-blob.gif",
    },
    {
      name: "mikuparty",
      identifier: "4548-miku-party.png",
    },
  ];

  return (
    <>
      <div className="dropdown dropdown-top">
        <div tabIndex={0} role="button" className="btn m-1">
          😈
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {emojis.map((emoji) => (
            <li key={emoji.name}>
              <a onClick={() => sendReaction(emoji.name)}>
                <img
                  src={`https://cdn3.emoji.gg/emojis/${emoji.identifier}`}
                  className="h-5 w-5"
                ></img>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default EmojiBar;
