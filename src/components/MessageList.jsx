import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="fixed bottom-10 pb-7 justify-center left-2 right-2 h-auto overflow-auto">
      {messages.map((msg, index) => {
        const dateObject = new Date(msg.timestamp);
        const formattedTime = `${dateObject.getHours()}:${dateObject.getMinutes()}`;
        return (
          <div className="flex items-center mb-2" key={index}>
            <div className="ml-3 text-left">
              <div className="text-sm font-bold text-white">
                {msg.username}{" "}
                <span className="text-gray-400">{formattedTime}</span>
              </div>
              <div className="text-white">
                <span className="font-medium">{msg.content}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;

