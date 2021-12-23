import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import select from "../assests/sounds/button-sound.mp3";
function Home() {
  const addingSoundToButton = () => {
    play();
  };
  const play = () => {
    document.getElementById("select").play();
    console.log("object");
  };
  return (
    <Fragment>
      <Helmet>
        <title>Quizz App - Home</title>
      </Helmet>
      <Fragment>
        <audio controls id="select" src={select}></audio>
      </Fragment>
      <div id="home">
        <section>
          <div style={{ textAlign: "center" }}>
            <span className="mdi mdi-cube-outline  cube"></span>
          </div>
          {/* head line  */}
          <h2>Quiz App</h2>
          {/* start quizz button  */}
          <div className="play-button-container">
            <ul>
              <li>
                <Link
                  onClick={addingSoundToButton}
                  className="play-button"
                  to="/play/instructions"
                >
                  play
                </Link>
              </li>
            </ul>
          </div>
          {/* authintication section  */}
          <div className="auth-container">
            <Link className="login-button" to="/Login">
              Login
            </Link>
            <Link className="register-button" to="/Register">
              Register
            </Link>
          </div>
        </section>
      </div>
    </Fragment>
  );
}

export default Home;
