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
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";

//> SCSS
import "./blogeditor.scss";
//#endregion

//#region > Components
class BlogEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState });
  };

  getHtml = (editorState) =>
    draftToHtml(convertToRaw(editorState.getCurrentContent()));

  render() {
    const { editorState } = this.state;

    console.log(editorState);

    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="rich-editor demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
        <div className="text-white">{this.getHtml(editorState)}</div>
      </div>
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BlogEditor));
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
