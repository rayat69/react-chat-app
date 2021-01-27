import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";

interface Chat {
  message: String;
  name: String;
}

console.log(window.location.origin);

const socket: SocketIOClient.Socket = io.connect(
  "https://react-yoyo-chat-app.herokuapp.com"
);

const App: React.FC = () => {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState<Chat[]>([]);

  useEffect(() => {
    socket.on("message", (param: { name: String; message: String }) => {
      const { name, message } = param;
      // gas.push({ name, message });
      // setChat(gas);
      // console.log(gas);

      setChat([...chat, { name, message }]);
    });
  }, [chat]);

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(state);

    e.preventDefault();
    const { name, message } = state;
    socket.emit("message", { name, message });
    setState({ message: "", name });
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // const renderChat = () => {
  //   return chat.map(({ name, message }, idx) => (
  //     <div key={idx}>
  //       <h3>
  //         {name}: <span>{message}</span>
  //       </h3>
  //     </div>
  //   ));
  // };

  return (
    <div className="App">
      <form onSubmit={onSubmitHandler}>
        <h1>Messenger</h1>
        <div className="name-field">
          <input
            type="text"
            name="name"
            value={state.name}
            onChange={onTextChange}
          />
        </div>
        <div className="message-field">
          <input
            type="text"
            name="message"
            value={state.message}
            onChange={onTextChange}
          />
        </div>
        <button type="submit">Send message</button>
      </form>
      <div className="render-chat">
        <h1>Render chat</h1>
        {chat.map(({ name, message }, idx) => (
          <div key={idx}>
            <h3>
              {name}: <span>{message}</span>
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
