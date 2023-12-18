import React, { useState, useEffect } from "react";
import supabase from "../../supabase";

const EmojiBar = ({ room, lusername, channel }) => {
  // array of random emojis for fun (tm)
  const emoji_rand = [
    '🥰',
    '🤣',
    '💪',
    '🥳',
    '😴',
    '⚡'
  ];
  const [displayedEmoji, _] = useState(emoji_rand[Math.floor(Math.random() * emoji_rand.length)]);

  // function to send a reaction
  async function sendReaction(emoji) {

    await channel.send({
      type: 'broadcast',
      event: 'message',
      payload: {
        room_id: room,
        content: emoji,
        timestamp: new Date(),
        username: lusername,
        type: "reaction"
      },
    })

  }

  const emojis = [
    {
      name: "vibin",
      identifier: "https://emoji.discadia.com/emojis/788f3a39-7ecf-4aee-bac0-d7c0dbbf02a3.gif",
    },
    {
      name: "pepe",
      identifier: "https://emoji.discadia.com/emojis/PepeRain.gif",
    },
    {
      name: "gojo",
      identifier: "https://emoji.discadia.com/emojis/cdb3e0e6-85b8-47a5-b0dc-38b5ff4b0916.gif"
    },
    {
      name: "blob",
      identifier: "https://cdn3.emoji.gg/emojis/3314-blobby-the-blob.gif",
    },
    {
      name: "mikuparty",
      identifier: "https://cdn3.emoji.gg/emojis/4548-miku-party.png",
    },
  ];

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
              <a onClick={() => sendReaction(emoji.name) }>
                <img
                  src={emoji.identifier}
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
