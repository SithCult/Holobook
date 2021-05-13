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

//> SCSS
import "./blogcreatepage.scss";
//#endregion

//#region > Components
class BlogCreatePage extends React.Component {
  state = {};

  createBlog() {}

  render() {
    const { auth, profile } = this.props;

    // Redirect unauthorized users
    if (
      auth.uid === undefined ||
      (profile.isLoaded && !profile.badges.includes("author"))
    )
      return <Redirect to="/holonet" />;

    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{"SithCult - Add Holonet entry"}</title>
          <link rel="canonical" href="https://sithcult.com/holonet/add" />
        </Helmet>
        <MDBContainer className="py-5 mt-5" id="createblog">
          <BlogEditor />
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
export default connect(mapStateToProps, mapDispatchToProps)(BlogCreatePage);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
