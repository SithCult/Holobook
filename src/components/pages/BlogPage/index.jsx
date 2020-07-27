//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Link, Redirect } from "react-router-dom";
// Meta tags
import { Helmet } from "react-helmet";

//> Redux
// Connect
import { connect } from "react-redux";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardUp,
  MDBAvatar,
  MDBAlert,
  MDBBtn,
  MDBBadge,
  MDBInput,
  MDBIcon,
  MDBTooltip,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";

//> Additional Components
import { OnlineUsers, BlogEditor } from "../../molecules";
import { BlogList } from "../../organisms";

//> Additional modules
// Country list
import countryList from "react-select-country-list";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import holocronIcon from "../../../assets/images/icons/holocron.png";
import darkUserIMG from "../../../assets/images/dark.gif";

//> SCSS
import "./blogpage.scss";
//#endregion

//#region > Components
class BlogPage extends React.Component {
  getCountry = (address) => {
    let country = address ? countryList().getLabel(address.country) : null;

    return country;
  };

  render() {
    const { profile } = this.props;

    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{"SithCult - Holonet"}</title>
          <link rel="canonical" href="https://sithcult.com/holonet" />
        </Helmet>
        <MDBContainer className="white-text" id="blogs">
          <MDBRow>
            <MDBCol md="10">
              <BlogEditor />
              <BlogList />
            </MDBCol>
            <MDBCol md="2">
              <MDBCard className="award text-center">
                <MDBCardBody>
                  <p className="lead mb-1">Get rewards</p>
                  <p className="small text-muted mb-1">
                    Contribute to SithCult and achieve greatness.
                  </p>
                  <Link to="/contribute">
                    <MDBBtn color="blue" size="md">
                      <MDBIcon icon="hand-holding-usd" className="mr-2" />
                      Contribute to SithCult
                    </MDBBtn>
                  </Link>
                </MDBCardBody>
              </MDBCard>
              <MDBCard className="text-center mt-3">
                <MDBCardBody>
                  <p className="lead mb-1">Your district</p>
                  <p className="small text-muted mb-1">
                    Get details about SithCult in your country.
                  </p>
                  {profile.isLoaded ? (
                    <Link
                      to={
                        "/c/" + profile.address?.country?.toLowerCase().trim()
                      }
                    >
                      <MDBBtn color="red" size="md">
                        <MDBIcon far icon="flag" className="mr-2" />
                        {profile.isLoaded ? (
                          <>{this.getCountry(profile.address)}</>
                        ) : (
                          <>
                            <span>Loading</span>
                          </>
                        )}
                      </MDBBtn>
                    </Link>
                  ) : (
                    <MDBBtn color="red" size="md" disabled={true}>
                      <MDBIcon far icon="flag" className="mr-2" />
                      <span>Loading</span>
                    </MDBBtn>
                  )}
                </MDBCardBody>
              </MDBCard>
              <MDBCard className="mt-3">
                <MDBCardBody>
                  <OnlineUsers />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(BlogPage);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
