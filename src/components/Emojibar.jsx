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
      <ul className="menu menu-vertical bg-gray- rounded-box mt-6 ml-3 fixed right-2 bottom-10 mb-5 ">
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
    </>
  );
};

export default EmojiBar;
