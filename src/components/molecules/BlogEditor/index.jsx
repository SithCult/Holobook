//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// PropTypes
import PropTypes from "prop-types";
// Router
import { withRouter, Link } from "react-router-dom";

//> Additional libraries
// Calculate time ago
import TimeAgo from "javascript-time-ago";
// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBInput, MDBIcon, MDBProgress } from "mdbreact";

//> Redux Firebase
// Actions for comments
import {
  removeComment,
  editComment,
} from "../../../store/actions/commentActions";
// Like actions
import {
  removeLike,
  createLike,
  hasLiked,
  getLikeAmount,
} from "../../../store/actions/likeActions";
// Getting user information
import { getUser, getUserByName } from "../../../store/actions/userActions";
// Connect
import { connect } from "react-redux";

// Additional Libraries
// RTE text editor
import RichTextEditor from "react-rte";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";
import loadingUserIMG from "../../../assets/images/loading.gif";

//> SCSS
import "./blogeditor.scss";
//#endregion

//#region > Components
class BlogEditor extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  };

  state = {
    value: RichTextEditor.createEmptyValue(),
  };

  onChange = (value) => {
    this.setState({ value });
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(value.toString("html"));
    }
  };

  render() {
    return <RichTextEditor value={this.state.value} onChange={this.onChange} />;
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BlogEditor));
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
