//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional libraries
// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";

// Flags for countries
import ReactCountryFlag from "react-country-flag";

// Country name by country code
import { getName } from "country-list";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBSpinner,
  MDBBadge,
} from "mdbreact";

//> Redux Firebase
// Actions for comments
import {
  createComment,
  editComment,
  loadComments,
} from "../../../store/actions/commentActions";

// Connect
import { connect } from "react-redux";

// Comment element
import { Comment } from "../../molecules";
//#endregion

class Comments extends React.Component {
  state = {
    username: "",
    avatar: "",
    isUploading: false,
    progress: 0,
    avatarURL: "",
    basic: true,
  };

  changeTextareaHandler = (event) => {
    event.target.style.overflow = "hidden";
    event.target.style.height = 0;
    event.target.style.height = event.target.scrollHeight + "px";

    if (event.target.value.length <= 500) {
      this.setState({
        comment: event.target.value,
      });
    }
  };

  createPost = (pid, cid) => {
    console.log(pid, cid);
    let content = this.state.comment;
    let author = {
      uid: this.props.auth.uid,
      name: this.props.profile.title + " " + this.props.profile.sith_name,
    };
    let timestamp = new Date().getTime();
    let basic = this.state.post_basic;
    if (content && author) {
      // Normalize data
      let data = {
        comment: content.replace(/\r\n|\r|\n/g, "</br>"),
        author,
        timestamp,
        pid,
        cid,
        basic: basic,
      };

      // Tell Firebase to create post
      this.setState(
        {
          postError: false,
        },
        () => {
          this.setState({ comment: "" });
          this.props.createComment(data);
          this.props.load();
        }
      );
    } else {
      console.log("do not post - not enough chars or no author");
    }
  };

  render() {
    const { items } = this.props;

    return (
      <>
        <MDBInput
          type="textarea"
          label="Add a comment"
          name="comment"
          outline
          className={this.state.post_basic ? "basic hand" : undefined}
          value={this.state.comment}
          onChange={this.changeTextareaHandler}
        />
        <MDBBtn
          color="elegant"
          rounded
          onClick={() => this.createPost(this.props.pid, null)}
        ></MDBBtn>
        {items &&
          items.length > 0 &&
          items.map((comment, i) => {
            return (
              <>
                {!comment.data.cid && (
                  <>
                    <Comment comment={comment.data} key={i} />
                    <MDBInput
                      type="textarea"
                      label="Add a comment"
                      name="comment"
                      outline
                      className={this.state.post_basic ? "basic hand" : null}
                      value={this.state.comment}
                      onChange={this.changeTextareaHandler}
                    />
                    <MDBBtn
                      color="elegant"
                      rounded
                      onClick={() =>
                        this.createPost(comment.data.pid, comment.id)
                      }
                    >
                      <MDBIcon icon="paper-plane" className="pr-2" size="lg" />
                      Post
                    </MDBBtn>
                  </>
                )}
                {items.map((child, c) => {
                  if (child.data.cid === comment.id) {
                    return (
                      <Comment comment={child.data} key={c} child></Comment>
                    );
                  }
                })}
              </>
            );
          })}
      </>
    );
  }
}

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    comments: state.comment.comments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadComments: () => dispatch(loadComments()),
    createComment: (comment) => dispatch(createComment(comment)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(Comments);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
