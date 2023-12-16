import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="fixed bottom-10 pb-7 justify-center left-2 right-2 h-auto overflow-y-auto">
      {messages.map((msg, index) => {
        const dateObject = new Date(msg.timestamp);
        const formattedTime = `${dateObject.getHours()}:${dateObject.getMinutes()}`;
        return (
          <div className="flex items-center mb-2 rounded-md p-2" key={index}>
            <div className="ml-3 text-left">
              <div className="flex ">
                <div className="text-base font-bold text-accent mr-2 ">
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
