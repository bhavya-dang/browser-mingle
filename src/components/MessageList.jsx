import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div>
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
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
