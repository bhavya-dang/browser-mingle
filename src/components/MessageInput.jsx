import React from "react";

const MessageInput = ({ input, setInput, sendMessage }) => {
  return (
    <div className="flex fixed bottom-3 left-2 right-2 gap-3 justify-center">
      <input
        type="text"
        className="input w-full max-w-xs outline-none"
        name="message"
        id="input-box"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="say something"
      />
      <button
        className="btn btn-neutral rounded-md"
        onClick={() => sendMessage()}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
