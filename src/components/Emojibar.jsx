import React, { useState } from "react";
import supabase from "../../supabase";

const EmojiBar = ({ room, lusername }) => {
  // array of random emojis for fun (tm)
  const emoji_rand = [
    '🥰',
    '🤣',
    '💪',
    '🥳',
    '😴',
    '⚡'
  ];
  const [displayedEmoji, setdisplayedEmoji] = useState(emoji_rand[Math.floor(Math.random() * emoji_rand.length)]);

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

  
  setInterval(() => {
    setdisplayedEmoji(emoji_rand[Math.floor(Math.random() * emoji_rand.length)])
  }, 5000)

  return (
    <>
      <div className="dropdown dropdown-top dropdown-hover">
        <div tabIndex={0} role="button" className="btn btn-warning" disabled={room ? false : true}>
          {displayedEmoji}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-1 shadow bg-base-100 rounded-box w-20"
        >
          {emojis.map((emoji) => (
            <li key={emoji.name}>
              <a onClick={() => {sendReaction(emoji.name)}}>
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
