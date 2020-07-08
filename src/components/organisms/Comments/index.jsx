//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBInput, MDBIcon } from "mdbreact";

//> Redux Firebase
// Actions for comments
import {
  createComment,
  loadComments,
} from "../../../store/actions/commentActions";

// Connect
import { connect } from "react-redux";

//> Components
import { Comment } from "../../molecules";

//> CSS
import "./comments.scss";
//#endregion

//#region > Components
class Comments extends React.Component {
  state = {
    comment: "",
  };

  changeTextareaHandler = (event, cid) => {
    event.target.style.overflow = "hidden";
    event.target.style.height = 0;
    event.target.style.height = event.target.scrollHeight + "px";

    if (event.target.value.length <= 500) {
      if (cid) {
        this.setState({
          ["comment_" + cid]: event.target.value,
        });
      } else {
        this.setState({
          comment: event.target.value,
        });
      }
    }
  };

  createPost = (pid, cid) => {
    let content = "";

    if (cid) {
      content = this.state["comment_" + cid];
    } else {
      content = this.state.comment;
    }

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
          comment: cid ? this.state.comment : "",
          showComments: true,
          ["comment_" + cid]: cid ? "" : this.state["comment_" + cid],
        },
        () => {
          this.setState({ comment: "" });
          this.props.createComment(data);
          this.props.refreshData();
        }
      );
    }
  };

  getChildren = (items, parentId) => {
    let childComments = [];

    // For each comment check if it belongs to the post and is a child comment
    items.forEach((comment, i) => {
      if (comment.data.cid && comment.data.cid === parentId) {
        // Push child comment to array
        childComments.push(
          <Comment
            comment={comment}
            key={comment.id}
            cid={comment.id}
            refreshData={this.props.refreshData}
            child
          />
        );
      }
    });

    return childComments;
  };

  render() {
    const { items } = this.props;

    return (
      <>
        <div className="comment-container">
          <div className="mb-3">
            <MDBInput
              type="textarea"
              label="Add comment"
              name="comment"
              outline
              className={this.state.comment ? "keep" : undefined}
              value={this.state.comment}
              onChange={(e) => this.changeTextareaHandler(e, null)}
            />
            {this.state.comment && (
              <div className="text-right">
                <MDBBtn
                  color="elegant"
                  rounded
                  onClick={() => this.createPost(this.props.pid, null)}
                >
                  <MDBIcon icon="comment-alt" className="pr-2" />
                  Post comment
                </MDBBtn>
              </div>
            )}
          </div>
          {items &&
            items.length > 0 &&
            items.filter((c) => c.data.pid === this.props.pid).length > 0 && (
              <MDBBtn
                color="elegant"
                size="md"
                onClick={() =>
                  this.setState({ showComments: !this.state.showComments })
                }
              >
                {this.state.showComments
                  ? "Hide comments"
                  : `Show ${
                      items.filter((c) => c.data.pid === this.props.pid).length
                    } ${
                      items.filter((c) => c.data.pid === this.props.pid)
                        .length === 1
                        ? "comment"
                        : "comments"
                    }`}
              </MDBBtn>
            )}
          <div style={{ display: this.state.showComments ? "block" : "none" }}>
            {items &&
              items.length > 0 &&
              items
                .filter((c) => c.data.pid === this.props.pid)
                .map((comment, i) => {
                  if (comment.data.visible) {
                    return (
                      <React.Fragment key={i}>
                        {!comment.data.cid && (
                          <>
                            <Comment
                              comment={comment}
                              key={this.props.pid + comment.id}
                              refreshData={this.props.refreshData}
                            />
                            <div className="child-input">
                              <MDBInput
                                type="textarea"
                                label={`Reply to ${comment.data.author.name}`}
                                name="comment"
                                outline
                                className={
                                  this.state["comment_" + comment.id]
                                    ? "keep"
                                    : undefined
                                }
                                value={this.state["comment_" + comment.id]}
                                onChange={(e) =>
                                  this.changeTextareaHandler(e, comment.id)
                                }
                              />
                              {this.state["comment_" + comment.id] && (
                                <div className="text-right">
                                  <MDBBtn
                                    color="elegant"
                                    onClick={() =>
                                      this.createPost(
                                        comment.data.pid,
                                        comment.id
                                      )
                                    }
                                  >
                                    <MDBIcon
                                      icon="comment-alt"
                                      className="pr-2"
                                    />
                                    Reply
                                  </MDBBtn>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        {this.getChildren(
                          items.filter((c) => c.data.pid === this.props.pid),
                          comment.id
                        )}
                      </React.Fragment>
                    );
                  } else return null;
                })}
          </div>
        </div>
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
