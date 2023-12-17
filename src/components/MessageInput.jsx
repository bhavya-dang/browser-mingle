import React from "react";
import EmojiBar from "./Emojibar";

const MessageInput = ({ input, setInput, sendMessage, room, lusername }) => {
  return (
    <div className="flex bottom-3 gap-3">
      <input
        type="text"
        className="input input-bordered w-full max-w-xs outline-none"
        name="message"
        id="input-box"
        autocomplete="off"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder={room ? "say something" : "joining room..."}
        disabled={room ? false : true}
      />
      <EmojiBar lusername={lusername} room={room}></EmojiBar>
      <button
        className="btn btn-accent "
        disabled={room ? false : true}
        onClick={() => sendMessage()}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
