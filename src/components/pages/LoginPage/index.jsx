//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Redirect from Router
import { Redirect, withRouter } from "react-router-dom";

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
} from "mdbreact";

//> Components
// To be added

//> CSS
import "./loginpage.scss";

//> Images
import IMGlogo from "../../../assets/images/logo_sm.png";

class LoginPage extends React.Component {
  state = {
    email: "",
    password: "",
  };

  submitHandler = (event) => {
    event.preventDefault();

    this._loginUser();
  };

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  _loginUser = () => {
    let email = this.state.email;
    let psw = this.state.password;

    if (email && psw) {
      this.props.signIn({
        email: email,
        password: psw,
      });
    } else {
      this.setState({
        error: true,
      });
    }
  };

  render() {
    const { authErrorDetails, auth, location } = this.props;

    let params = location.search.substr(1)
      ? location.search.substr(1).split("=")
      : null;
    if (params) {
      if (params[0] === "refer") {
        switch (params[1]) {
          case "basic":
            if (auth.uid !== undefined) return <Redirect to="/basic" />;
            break;
          default:
            if (auth.uid !== undefined) return <Redirect to="/me" />;
        }
      }
    } else {
      if (auth.uid !== undefined) return <Redirect to="/me" />;
    }

    return (
      <MDBContainer id="login" className="text-center text-white pt-5 mt-5">
        <img src={IMGlogo} alt="SithCult logo" className="img-fluid" />
        <h2 className="font-weight-bold mt-5">Login</h2>
        <form onSubmit={this.submitHandler}>
          <MDBRow className="flex-center">
            <MDBCol md="4">
              {authErrorDetails && (
                <MDBAlert color="gold">
                  <p className="text-gold">
                    The password is invalid or the user does not exist.
                  </p>
                </MDBAlert>
              )}
              <MDBInput
                value={this.state.email}
                onChange={this.changeHandler}
                type="email"
                id="materialFormRegisterConfirmEx2"
                name="email"
                outline
                label="Your email"
                required
              >
                <small id="emailHelp" className="form-text text-muted">
                  You can use your SithCult E-Mail (sithname@sithcult.com)
                </small>
              </MDBInput>
            </MDBCol>
            <MDBCol md="12"></MDBCol>
            <MDBCol md="4">
              <MDBInput
                value={this.state.password}
                onChange={this.changeHandler}
                type="password"
                id="materialFormRegisterConfirmEx4"
                outline
                name="password"
                label="Password"
                required
              >
                <small
                  id="passwordHelp"
                  className="form-text text-muted text-right"
                >
                  <a className="underlined" href="mailto:center@sithcult.com">
                    Forgot password?
                  </a>
                  <br />
                </small>
              </MDBInput>
            </MDBCol>
          </MDBRow>
          <MDBBtn color="red" type="submit">
            <MDBIcon icon="key" className="pr-2" />
            Login
          </MDBBtn>
        </form>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authErrorDetails: state.auth.authErrorDetails,
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (credentials) => dispatch(signIn(credentials)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginPage));

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
