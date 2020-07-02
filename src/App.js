//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { BrowserRouter as Router } from "react-router-dom";

//> Additional
// Google Analytics
import ReactGA from "react-ga";
// Facebook Pixel
import ReactPixel from "react-facebook-pixel";

//> Components
/**
 * Footer: Global Footer
 * Navbar: Global navigation bar
 */
import { Footer, Navbar, CookieModal } from "./components/molecules";
import { ScrollToTop } from "./components/atoms";

//> Redux
// Connect
import { connect } from "react-redux";

// Actions
import { initPresenceHandler } from "./store/actions/userActions";

// Routes
import Routes from "./Routes";

class App extends React.Component {
  state = {};

  componentDidMount = () => {
    this.checkCookies();
  };

  checkCookies = () => {
    // Create custom user id for tracking
    let userId = localStorage.getItem("userId");

    if (!userId) {
      const sha256 = require("js-sha256");

      userId = sha256.create();
      localStorage.setItem("userId", userId);
    }

    // Check cookies
    let cookie = localStorage.getItem("cookie");

    if (cookie) {
      cookie = JSON.parse(cookie);
      if (cookie.marketing || cookie.statistics) {
        if (
          window.location.hostname !== "localhost" &&
          window.location.hostname !== "127.0.0.1"
        ) {
          // Google Analytics
          ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS, {
            gaOptions: {
              userId,
            },
          });
          ReactGA.pageview(window.location.pathname + window.location.search);

          // Facebook Pixel
          if (cookie.marketing) {
            // Advanced matching
            let advancedMatching = {};
            const info = localStorage.getItem("info");

            if (info) {
              // Store user email to match
              advancedMatching = { em: JSON.parse(info).email };
            }

            ReactPixel.init(process.env.REACT_APP_FB_PIXEL, advancedMatching);
            ReactPixel.pageView();
          }
        }
      }
    }
  };

  saveCookie = () => {
    this.checkCookies();
  };

  render() {
    if (!this.state.initialized) {
      this.setState({ initialized: true }, () =>
        this.props.initPresenceHandler()
      );
    }

    return (
      <Router>
        <ScrollToTop>
          <div className="flyout">
            <Navbar />
            <main>
              <Routes />
              <CookieModal saveCookie={this.saveCookie} />
            </main>
            <Footer />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initPresenceHandler: () => dispatch(initPresenceHandler()),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(App);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
