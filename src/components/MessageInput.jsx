import React from "react";

const MessageInput = ({ input, setInput, sendMessage, room }) => {
  return (
    <div className="flex fixed bottom-3 left-2 right-2 gap-3 justify-center">
      <input
        type="text"
        className="input input-bordered w-full max-w-xs outline-none"
        name="message"
        id="input-box"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder={(room) ? "say something" : "joining room..."}
        disabled={(room) ? false : true}
      />
      <button
        className="btn glass rounded-full"
        disabled={(room) ? false : true}
        onClick={() => sendMessage()}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
