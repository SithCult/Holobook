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
import { MDBBtn, MDBInput, MDBIcon, MDBProgress, MDBSpinner } from "mdbreact";

//> Redux Firebase
// Blog Post Actions
import { createBlogPost } from "../../../store/actions/blogActions";
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
      tags: "",
      description: "",
      headline: "",
    };
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState, content: this.getHtml(editorState) });
  };

  getHtml = (editorState) =>
    draftToHtml(convertToRaw(editorState.getCurrentContent()));

  createPost = () => {
    if (this.state.content && this.state.headline && this.state.description) {
      this.props.createBlogPost({
        content: this.state.content,
        title: this.state.headline,
        lead: this.state.description,
        tags: this.state.tags ? this.state.tags.split(" ") : [],
        author: {
          uid: this.props.auth.uid,
          name: this.props.profile.title + " " + this.props.profile.sith_name,
        },
        timestamp: Date.now(),
      });
    }
  };

  render() {
    const { editorState } = this.state;

    if (this.props.created) {
      return (
        <div className="text-white">
          <h3>Thank you for submitting your blog post</h3>
          <h4>
            It will be published once it has been approved by a moderator!
          </h4>
          <MDBBtn
            color="amber"
            onClick={() => this.props.history.push("/holonet")}
          >
            Back
          </MDBBtn>
        </div>
      );
    }

    if (this.props.profile.isLoaded && !this.props.profile.isEmpty)
      return (
        <div>
          <h3 className="text-white">Create new article</h3>
          <input
            type="text"
            placeholder="Headline"
            value={this.state.headline}
            onChange={(e) => this.setState({ headline: e.target.value })}
            className="form-control mb-2"
          />
          <textarea
            placeholder="Short description"
            value={this.state.description}
            onChange={(e) => this.setState({ description: e.target.value })}
            className="form-control mb-2"
          />
          <input
            type="text"
            placeholder="Tags (seperated by space)"
            value={this.state.tags}
            onChange={(e) => this.setState({ tags: e.target.value })}
            className="form-control mb-4"
          />
          <Editor
            editorState={editorState}
            wrapperClassName="rich-editor demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
          />
          <MDBBtn color="amber" onClick={this.createPost}>
            Create Post
          </MDBBtn>
        </div>
      );
    else
      return (
        <div className="text-center">
          <MDBSpinner />
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
    created: state.blog.created,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { createBlogPost: (post) => dispatch(createBlogPost(post)) };
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
