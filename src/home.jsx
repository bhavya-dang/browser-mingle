import App from "./App";
import { ReactDOM } from "react";

export default function Home() {
  function setLocalUsername() {
    const username = document.getElementById("username").value;
    localStorage.setItem("username", username);
    console.log(username);
    ReactDOM.render(<App />);
  }
  if (
    localStorage.getItem("username") == "" ||
    localStorage.getItem("username") == null
  )
    return (
      <>
        <h1>Welcome to BrowserMingle 😳</h1>
        <p>To get started choose a username</p>
        <input id="username" placeholder="Veg Camel"></input>
        <button onClick={() => setLocalUsername()}> SET</button>
      </>
    );
  else {
    return <App />;
  }
}
