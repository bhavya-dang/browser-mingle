import React, { useRef, useEffect } from "react";

const MessageList = ({ messages }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (messages.length) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages.length]);

  return (
    <div id="chat-scroll-area-inner">
      {messages.map((msg, index) => {
        const dateObject = new Date(msg.timestamp);
        const formattedTime = `${dateObject.getHours()}:${dateObject.getMinutes()}`;
        return (
          <div className="flex items-center m-2 rounded-md" key={index}>
            <div className="text-left">
              <div className="flex">
                <div className="text-base font-bold text-accent mr-2">
                  {msg.username}
                </div>
                <div className="text-ghost text-base ">{formattedTime}</div>
              </div>
              <div>
                <span className="text-base text-ghost">{msg.content}</span>
              </div>
            </div>

            <div className="mt-5" ref={ref} />
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;





