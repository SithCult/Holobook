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
  MDBSpinner,
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
    const { auth, profile } = this.props;

    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{"SithCult - Holonet"}</title>
          <link rel="canonical" href="https://sithcult.com/holonet" />
        </Helmet>
        <MDBContainer className="white-text" id="blogs">
          <MDBRow>
            <MDBCol md="9">
              <div className="text-center">
                <h2 className="mb-1 font-weight-bold">SithCult Holonet</h2>
                <p className="lead">News from all over the empire.</p>
              </div>
              <div className="d-sm-none d-block mb-3">
                <Link to="/me">
                  <MDBBtn color="blue" size="md" className="d-block w-100">
                    <MDBIcon icon="users" className="mr-1" />
                    Return to Holobook
                  </MDBBtn>
                </Link>
              </div>
              <BlogList />
            </MDBCol>
            <MDBCol md="3" className="blog-side">
              {!profile.isLoaded ? (
                <div className="text-center">
                  <MDBSpinner />
                </div>
              ) : (
                <>
                  {!auth.uid ? (
                    <MDBCard className="award text-center">
                      <MDBCardBody>
                        <p className="lead mb-1">Sign up for Holobook</p>
                        <p className="small text-muted mb-2">
                          Holobook is the biggest and most active Sith social
                          network.
                        </p>
                        <Link to="/">
                          <MDBBtn color="blue" size="md">
                            <MDBIcon icon="angle-up" className="mr-2" />
                            Sign Up
                          </MDBBtn>
                        </Link>
                      </MDBCardBody>
                    </MDBCard>
                  ) : (
                    <>
                      <MDBCard className="award text-center">
                        <MDBCardBody>
                          <p className="lead mb-1">Your profile</p>
                          <p className="text-muted small mb-1">
                            Return to Holobook, our social network.
                          </p>
                          <Link to="/me">
                            <MDBBtn
                              color="blue"
                              size="md"
                              className="d-block w-100"
                            >
                              <MDBIcon icon="users" className="mr-1" />
                              Return to Holobook
                            </MDBBtn>
                          </Link>
                          {profile?.badges.includes("author") && (
                            <div className="mt-3">
                              <p className="text-muted small mb-1">
                                You are a SithCult author. As which you can
                                create articles.
                              </p>
                              <Link to="/holonet/add">
                                <MDBBtn
                                  color="red"
                                  size="md"
                                  className="d-block w-100"
                                >
                                  <MDBIcon icon="plus" className="mr-1" />
                                  Create article
                                </MDBBtn>
                              </Link>
                            </div>
                          )}
                        </MDBCardBody>
                      </MDBCard>
                    </>
                  )}
                </>
              )}
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
