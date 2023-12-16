import React from "react";
import EmojiBar from "./Emojibar";

const MessageInput = ({ input, setInput, sendMessage, room, lusername }) => {
  return (
    <div className="flex fixed bottom-3 left-2 right-2 gap-3 justify-center">
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
      <button
        className="btn btn-accent "
        disabled={room ? false : true}
        onClick={() => sendMessage()}
      >
        Send
      </button>
      <EmojiBar lusername={lusername} room={room}></EmojiBar>
    </div>
  );
};

export default MessageInput;
