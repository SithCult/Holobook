//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Redirect from Router
import { Link, Redirect } from "react-router-dom";

//> Additional modules
// Fade In Animation
import FadeIn from "react-fade-in";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { signIn } from "../../../store/actions/authActions";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBAlert,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBSimpleChart,
  MDBDataTable,
  MDBView,
  MDBMask,
} from "mdbreact";

//> Components
// To be added

//> CSS
import "./basic.scss";

//> Images
import logoIMG from "../../../assets/images/logo_white_sm.png";
import cheatSheetIMG from "../../../assets/images/aurek.png";

//> Other words and phrases
import { items } from "./items.js";

class BasicTraining extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  state = {
    userInput: "",
    activeBasic: undefined,
    showSolution: false,
    startTimer: new Date(),
    previous: [],
    tries: 0,
  };

  componentDidMount = () => {
    let randomWord = require("random-words");
    if (!this.state.activeBasic)
      this.setState({
        activeBasic: randomWord().toLowerCase().trim(),
      });
  };

  submitHandler = (event) => {
    event.preventDefault();

    // Get list of previous tries
    let previous = this.state.previous;

    if (this.state.userInput === this.state.activeBasic.toLowerCase().trim()) {
      // Calculate how much time it took to get the result
      let currentTime = new Date().getTime();
      let t1 = new Date();
      let t2 = this.state.startTimer;
      let dif = t1.getTime() - t2.getTime();
      let elapsedTime = dif / 1000;
      let item = {
        text: this.state.activeBasic.toLowerCase().trim(),
        elapsed: elapsedTime,
        hinted: this.state.showSolution,
        wasCorrect: !this.state.wrongInput,
      };
      previous.push(item);

      // Set next word
      let randomWord = "";
      let randChoice = Math.floor(Math.random() * 100);
      if (randChoice < 95) {
        // Get word from library
        let randomWords = require("random-words");
        randomWord = randomWords();
      } else {
        // Get word from custom list
        let rand = Math.floor(Math.random() * items.length);
        randomWord = items[rand];
      }
      if (this.state.wrongInput) {
        this.setState(
          {
            activeBasic: randomWord.toLowerCase().trim(),
            userInput: "",
            wrongInput: false,
            showSolution: false,
            startTimer: new Date(),
            tries: this.state.tries + 1,
          },
          () => {
            this.textInput.focus();
            this.getAverageTimeElapsed();
          }
        );
      } else {
        this.setState(
          {
            activeBasic: randomWord.toLowerCase().trim(),
            userInput: "",
            wrongInput: false,
            showSolution: false,
            startTimer: new Date(),
            previous,
            tries: this.state.tries + 1,
          },
          () => {
            this.textInput.focus();
            this.getAverageTimeElapsed();
          }
        );
      }
    } else {
      this.setState({
        wrongInput: true,
        tries: this.state.tries + 1,
      });
    }
  };

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value.toLowerCase().trim(),
    });
  };

  getAverageTimeElapsed = () => {
    let previous = this.state.previous;

    if (previous.length > 0) {
      let time = 0;

      previous.map((item, i) => {
        time += parseInt(item.elapsed);
      });

      return time;
    } else {
      return 0;
    }
  };

  getRows = () => {
    if (this.state.previous.length > 0) {
      return this.state.previous.map((item, i) => {
        return {
          basic: item.text,
          english: item.text,
          elapsed: item.elapsed + "sec",
          firsttry: item.wasCorrect ? (
            <MDBIcon icon="check" className="text-success" />
          ) : (
            <MDBIcon icon="times" className="text-danger" />
          ),
        };
      });
    } else {
      return undefined;
    }
  };

  render() {
    const { authErrorDetails, auth } = this.props;

    console.log(auth);

    return (
      <MDBContainer
        id="imperialbasictraining"
        className="text-center text-white pt-5 mt-5"
      >
        <img src={logoIMG} alt="SithCult Logo" className="mt-5 logo" />
        <h2 className="font-weight-bold mt-2">Imperial Basic Trainer</h2>
        <p>The best way to learn Imperial Basic on this planet.</p>
        {this.state.showSheet && (
          <div className="cheatsheet my-4">
            <img
              src={cheatSheetIMG}
              alt="Aurek Besh cheat sheet"
              className="img-fluid"
            />
          </div>
        )}
        {this.state.showSheet ? (
          <span
            className="clickable underlined"
            onClick={() => this.setState({ showSheet: false })}
          >
            Hide alphabet
          </span>
        ) : (
          <span
            className="clickable underlined"
            onClick={() => this.setState({ showSheet: true })}
          >
            Show alphabet
          </span>
        )}

        <p className="font-weight-bold text-success mt-4">
          {this.state.previous.length === 1 ? (
            <>{this.state.previous.length} correct answer</>
          ) : (
            <>
              {this.state.previous.length > 1 && (
                <>{this.state.previous.length} correct answers</>
              )}
            </>
          )}
        </p>
        <MDBView>
          <MDBAlert color="gold" className="mb-0 py-4">
            <div className={!this.state.showSolution ? "basic" : ""}>
              {this.state.activeBasic}
            </div>
          </MDBAlert>
          <MDBMask className="flex-center"></MDBMask>
        </MDBView>
        <form onSubmit={this.submitHandler}>
          <MDBRow className="flex-center">
            <MDBCol md="4">
              <MDBInput
                value={this.state.userInput}
                onChange={this.changeHandler}
                type="text"
                inputRef={(ref) => (this.textInput = ref)}
                id="materialFormRegisterConfirmEx2"
                name="userInput"
                containerClass="mb-0"
                outline
                label="Translate to English"
                labelClass="active"
                size="lg"
              >
                {this.state.wrongInput && !this.state.showSolution && (
                  <small
                    id="emailHelpError"
                    className="form-text text-danger font-weight-bold"
                  >
                    Try again.
                    {!this.state.showSolution && (
                      <a
                        className="ml-1 mr-1 underlined text-white"
                        onClick={() => this.setState({ showSolution: true })}
                      >
                        Show solution
                      </a>
                    )}
                  </small>
                )}
                <small id="emailHelp" className="form-text text-muted">
                  Translate the written Imperial Basic to plain English.
                </small>
              </MDBInput>
            </MDBCol>
          </MDBRow>
          <MDBBtn color="red" type="submit">
            <MDBIcon icon="search" className="pr-2" />
            Check
          </MDBBtn>
        </form>
        {!auth.uid ? (
          <div className="mt-5 p-4 login">
            <p className="lead mb-1">
              Want to receive rewards and see your results?
            </p>
            <small className="text-muted d-block mb-2">
              Signing up is 100% free and provides you a connection to
              like-minded individuals.
            </small>
            <Link to="/login?refer=basic">
              <MDBBtn color="yellow">
                <MDBIcon icon="angle-right" className="pr-1" />
                Login
              </MDBBtn>
            </Link>
            <Link to="/">
              <MDBBtn color="red">
                <MDBIcon fab icon="sith" className="pr-1" />
                Sign up
              </MDBBtn>
            </Link>
          </div>
        ) : (
          <div className="results mt-5">
            <MDBRow className="flex-center">
              <MDBCol md="4">
                {this.state.previous.length > 0 && (
                  <>
                    <p className="lead pb-2">Correct answers</p>
                    <MDBSimpleChart
                      width={90}
                      height={90}
                      strokeWidth={5}
                      percent={Math.round(
                        (100 / this.state.tries) * this.state.previous.length
                      )}
                      strokeColor="#4FB64E"
                      labelFontWeight="300"
                      labelColor="#fff"
                    />
                  </>
                )}
              </MDBCol>
              <MDBCol md="8">
                {this.state.previous.length > 0 && (
                  <>
                    <p className="lead pb-2">Your tries</p>
                    <MDBDataTable
                      striped
                      small
                      responsive
                      borderless
                      theadTextWhite
                      searching={false}
                      paging={false}
                      noBottomColumns
                      data={{
                        columns: [
                          {
                            label: "Basic",
                            field: "basic",
                            sort: "asc",
                          },
                          {
                            label: "English",
                            field: "english",
                            sort: "asc",
                          },
                          {
                            label: "Time elapsed",
                            field: "elapsed",
                            sort: "asc",
                          },
                          {
                            label: "First try",
                            field: "firsttry",
                          },
                        ],
                        rows: this.getRows(),
                      }}
                    />
                  </>
                )}
              </MDBCol>
            </MDBRow>
          </div>
        )}
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    authErrorCode: state.auth.authErrorCode,
    authErrorDetails: state.auth.authErrorDetails,
    auth: state.firebase.auth,
  };
};

export default connect(mapStateToProps)(BasicTraining);

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
