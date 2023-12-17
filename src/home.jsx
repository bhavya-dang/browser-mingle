import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';

export default function Home() {
  function setLocalUsername() {
    const username = document.getElementById('username').value;
    if (username.length > 0) {
      localStorage.setItem('username', username);
      console.log(username);
      ReactDOM.render(<App key={Math.random()} />, document.getElementById('root'));
    }
  }

  if (localStorage.getItem('username') === '' || localStorage.getItem('username') === null) {
    return (
      <>
        <div className="flex left-2 right-2 justify-center items-center h-screen">
          <div className="card w-96 glass mx-8 my-20">
            <figure><img src="https://cdn.britannica.com/15/241115-050-41EBA94D/Wanderer-Above-the-Sea-Fog-Caspar-David-Friedrich-Hamburger-Kunsthalle-Hamburg-Germany.jpg" alt="'Wanderer Above The Sea Of Fog' by Caspar David Friedrich"/></figure>
            <div className="card-body">
              <h2 className="card-title">Welcome to BrowserMingle</h2>
              <p>To get started, choose a username</p>
              <div className="flex">
                <div className="card-actions">
                  <input
                    id="username"
                    placeholder="Veg Camel"
                    className="input input-bordered w-full max-w-xs outline-none"
                    autocomplete="off"
                  ></input>
                  <button className="btn btn-primary" onClick={() => setLocalUsername()}>Find Rooms</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <App key={Math.random()} />;
  }
}

