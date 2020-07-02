//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Redirect from Router
import { Link, Redirect, withRouter } from "react-router-dom";
// Meta tags
import { Helmet } from "react-helmet";

//> Additional modules
// Fade In Animation
import FadeIn from "react-fade-in";
// Flags for countries
import ReactCountryFlag from "react-country-flag";
// Country list
import countryList from "react-select-country-list";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { getUsersPerCountry } from "../../../store/actions/userActions";

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
  MDBCard,
  MDBCardBody,
  MDBAvatar,
} from "mdbreact";

//> Components
// To be added

//> CSS
import "./countrypage.scss";

//> Images
import logoIMG from "../../../assets/images/logo_white_sm.png";
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";
//#endregion

//#region > Components
class CountryPage extends React.Component {
  state = {
    country: "Loading",
  };

  componentDidMount = async () => {
    const { match } = this.props;
    const country = match?.params?.country;

    if (country) {
      this.setState({
        users: await this.props.getUsersPerCountry(country),
        country_code: country ? country.toLowerCase().trim() : null,
        country: country ? countryList().getLabel(country) : null,
      });
    }
  };

  getMoff = (users) => {
    const found = users.map((user, i) => {
      if (user.data.badges.includes("moff")) {
        return user;
      } else {
        return null;
      }
    });

    // Remove all null from array
    const filtered = found.filter(function (el) {
      return el != null;
    });

    // check if there are any results left
    if (filtered.length > 0) {
      // Return result
      return (
        <div>
          {filtered.map((found, f) => {
            return this.getPicture(found.data.skin, f);
          })}
        </div>
      );
    } else {
      return <p className="small text-muted">No Moff yet</p>;
    }
  };

  getPicture = (skin, index) => {
    switch (skin) {
      case "gold":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={goldUserIMG} alt="Gold user profile picture" />
          </MDBAvatar>
        );
      case "light":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={lightUserIMG} alt="Light user profile picture" />
          </MDBAvatar>
        );
      case "bronze":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={bronzeUserIMG} alt="Bronze user profile picture" />
          </MDBAvatar>
        );
      case "dark":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={darkUserIMG} alt="Bronze user profile picture" />
          </MDBAvatar>
        );
      default:
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={defaultUserIMG} alt="Default user profile picture" />
          </MDBAvatar>
        );
    }
  };

  render() {
    const { authErrorDetails, auth } = this.props;
    const { users, country_code, country } = this.state;

    return (
      <MDBContainer id="country" className="text-white pt-5 mt-5">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`${country} - SithCult`}</title>
          <link
            rel="canonical"
            href={"https://sithcult.com/c/" + country_code}
          />
        </Helmet>
        <MDBRow>
          <MDBCol md="4">
            <MDBCard className="text-center">
              <MDBCardBody>
                {country_code && (
                  <div className="text-center flag mb-3">
                    <ReactCountryFlag svg countryCode={country_code} />
                  </div>
                )}
                <p className="lead font-weight-bold mb-0">{country}</p>
                <p className="text-muted basic small">{country}</p>
                <p className="mb-2 title moff">
                  <MDBIcon icon="angle-up" /> Moff
                </p>
                {users && this.getMoff(users)}
                <p className="mt-2 mb-2 title members">
                  <MDBIcon icon="users" /> Members
                </p>
                <p className="mb-2 small text-muted">
                  Membercount: {users && users.length}
                </p>
                {users &&
                  users.map((user, i) => {
                    return (
                      <span className="mx-1" key={i}>
                        {this.getPicture(user.data.skin, i)}
                      </span>
                    );
                  })}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="8">Test</MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    authErrorCode: state.auth.authErrorCode,
    authErrorDetails: state.auth.authErrorDetails,
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUsersPerCountry: (cc) => dispatch(getUsersPerCountry(cc)),
  };
};
//#endregion

//#region > Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CountryPage));
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
