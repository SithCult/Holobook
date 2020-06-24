//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional libraries
// Calculate time ago
import TimeAgo from "javascript-time-ago";
// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";
// Flags for countries
import ReactCountryFlag from "react-country-flag";
// Country name by country code
import { getName } from "country-list";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBSpinner,
  MDBBadge,
  MDBProgress,
} from "mdbreact";

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
// Auth
import { auth } from "firebase";
// Connect
import { connect } from "react-redux";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";
import loadingUserIMG from "../../../assets/images/loading.gif";

//> CSS
import "./comment.scss";
//#endregion

//#region > Functions
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

String.prototype.escape = function () {
  // Replace those tags with HTML equivalent
  const tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  };

  // Replace </br> with ||/br|| so it is not affected by the replacement
  const pre = replaceAll(this, "</br>", "||/br||");

  // Replace all <, > and & with the HTML equivalent
  const result = pre.replace(/[&<br>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });

  // Change ||/br|| back to </br>
  return replaceAll(result, "||/br||", "</br>");
};
//#endregion

//#region > Components
class Comment extends React.Component {
  state = {
    settings: false,
  };

  componentDidMount = async () => {
    this.setState(
      {
        receivedUser: await this.props.getUser(
          this.props.comment.data.author.uid
        ),
        liked: await this.props.hasLiked(this.props.comment.id),
        likeCount: await this.props.getLikeAmount(this.props.comment.id),
      },
      () => this.checkTag(this.props.comment.data.msg)
    );
  };

  componentWillReceiveProps = (nextProps) => {
    this.checkTag(nextProps.comment.data.msg);
  };

  // Handle edit input change
  changeTextareaHandler = (event, cid) => {
    event.target.style.overflow = "hidden";
    event.target.style.height = 0;
    event.target.style.height = event.target.scrollHeight + "px";

    if (event.target.value.length <= 500) {
      if (cid) {
        this.setState({
          ["edit_comment_" + cid]: event.target.value,
        });
      } else {
        this.setState({
          comment: event.target.value,
        });
      }
    }
  };

  editComment = (comment, newmsg) => {
    if (newmsg) {
      this.setState(
        { comment: "", ["edit_comment_" + comment.id]: "", edit: false },
        () => {
          this.props.editComment(comment, newmsg);
          this.checkTag(newmsg);
        }
      );
    }
  };

  updateLikes = (amount) => {
    this.setState({
      likeCount: this.state.likeCount + amount,
    });
  };

  removeComment = (comment) => {
    this.props.removeComment(comment);
    this.props.refreshData();
  };

  _calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo("en-US");

    return timeAgo.format(timestamp);
  };

  checkTag = async (msg) => {
    if (msg.includes("@")) {
      const regExpression = /@\w+/g;
      const re = msg.match(regExpression);

      let result = msg;

      await re.forEach(async (item, i) => {
        result = result.replace(
          item,
          `<span class="orange-text">${item}</span>`
        );
      });

      this.setState({
        message: result,
      });
    } else {
      this.setState({
        message: msg,
      });
    }
  };

  render() {
    const { auth, comment, child, cid } = this.props;
    const { receivedUser, message, likeCount } = this.state;

    if (!receivedUser) {
      return (
        <>
          <div
            className={
              child
                ? "comment d-flex justify-content-between child-comment"
                : "comment d-flex justify-content-between mt-4"
            }
          >
            <div className="p-2 img">
              <img
                src={loadingUserIMG}
                className="rounded-circle avatar-img align-self-center mr-0"
              />
            </div>
            <div className="content">
              <div className="p-2 author-info">
                <div className="name">
                  <MDBProgress material preloader className="placeholder" />
                </div>
              </div>
              <div className="px-3 pb-3">
                <MDBProgress material preloader className="placeholder" />
                <div>
                  <span className="text-muted">
                    <small>Comment loading</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div
          className={
            child
              ? "comment d-flex justify-content-between child-comment"
              : "comment d-flex justify-content-between mt-4"
          }
        >
          <div className="p-2 img">
            {receivedUser &&
              (() => {
                switch (receivedUser.skin) {
                  case "gold":
                    return (
                      <img
                        src={goldUserIMG}
                        className="rounded-circle avatar-img align-self-center mr-0"
                      />
                    );
                  case "light":
                    return (
                      <img
                        src={lightUserIMG}
                        className="rounded-circle avatar-img align-self-center mr-0"
                      />
                    );
                  case "bronze":
                    return (
                      <img
                        src={bronzeUserIMG}
                        className="rounded-circle avatar-img align-self-center mr-0"
                      />
                    );
                  case "dark":
                    return (
                      <img
                        src={darkUserIMG}
                        className="rounded-circle avatar-img align-self-center mr-0"
                      />
                    );
                  default:
                    return (
                      <img
                        src={defaultUserIMG}
                        className="rounded-circle avatar-img align-self-center mr-0"
                      />
                    );
                }
              })()}
            {auth.uid === comment.data.author.uid && (
              <div className="w-100 text-center settings">
                <MDBIcon
                  icon="ellipsis-v"
                  className="p-2"
                  onClick={() =>
                    this.setState({ settings: !this.state.settings })
                  }
                />
              </div>
            )}
          </div>
          <div className="content">
            <div className="p-2 author-info d-flex justify-content-between align-items-center">
              <div>
                <MDBPopover
                  placement="top"
                  popover
                  clickable
                  domElement
                  className="furtherInfo"
                >
                  <div
                    className="clickable name"
                    onClick={() => this.props.getUser(comment.data.author.uid)}
                  >
                    {comment.data.author.name}
                  </div>
                  <div>
                    {receivedUser !== true && receivedUser !== undefined ? (
                      <>
                        {receivedUser !== false ? (
                          <>
                            <MDBPopoverHeader className="flex-center">
                              <div>
                                {receivedUser.title +
                                  " " +
                                  receivedUser.sith_name}
                                <small className="text-muted d-block blue-text">
                                  {receivedUser.department}
                                </small>
                              </div>
                              <div className="ml-auto p-2 mb-auto">
                                <small className="text-muted">
                                  <MDBIcon
                                    icon="medal"
                                    className="purple-text mr-1"
                                  />
                                  {receivedUser.reputation}
                                </small>
                              </div>
                            </MDBPopoverHeader>
                            <MDBPopoverBody>
                              <div>
                                {(() => {
                                  return receivedUser.badges.map((badge, i) => {
                                    switch (badge) {
                                      case "founder":
                                        return (
                                          <MDBBadge
                                            pill
                                            color="elegant-color"
                                            key={i}
                                          >
                                            <MDBIcon
                                              icon="fire"
                                              className="pr-2"
                                            />
                                            Founder
                                          </MDBBadge>
                                        );
                                      case "member":
                                        return (
                                          <MDBBadge pill color="red" key={i}>
                                            <MDBIcon
                                              icon="user"
                                              className="pr-2"
                                            />
                                            Council
                                          </MDBBadge>
                                        );
                                      case "historic":
                                        return (
                                          <MDBBadge pill color="orange" key={i}>
                                            <MDBIcon
                                              icon="book"
                                              className="pr-2"
                                            />
                                            Historic
                                          </MDBBadge>
                                        );
                                      default:
                                        return null;
                                    }
                                  });
                                })()}
                                <div className="flex-center text-left my-2">
                                  <ReactCountryFlag
                                    svg
                                    className="mr-1"
                                    countryCode={receivedUser.address.country}
                                  />
                                  {getName(receivedUser.address.country)}
                                </div>
                              </div>
                            </MDBPopoverBody>
                          </>
                        ) : (
                          <>
                            <MDBPopoverHeader>
                              <div>User not found</div>
                            </MDBPopoverHeader>
                            <MDBPopoverBody>
                              This person is no longer a member of SithCult.
                            </MDBPopoverBody>
                          </>
                        )}
                      </>
                    ) : (
                      <MDBPopoverBody className="text-center">
                        <div>
                          <MDBSpinner />
                        </div>
                        <div>Receiving current status</div>
                      </MDBPopoverBody>
                    )}
                  </div>
                </MDBPopover>
              </div>
              <div className="ml-auto p-2 mb-auto time">
                <small className="text-muted">
                  {comment.data.timestamp &&
                    this._calculateTimeAgo(comment.data.timestamp)}
                </small>
              </div>
            </div>
            <div className="px-3 pb-3">
              {this.state.edit ? (
                <div className="editcomment">
                  <MDBInput
                    type="textarea"
                    label={`Edit Comment`}
                    name="editcomment"
                    outline
                    className={
                      this.state["edit_comment_" + comment.id]
                        ? "keep"
                        : undefined
                    }
                    value={
                      this.state["edit_comment_" + comment.id]
                        ? this.state["edit_comment_" + comment.id]
                        : comment.data.msg
                    }
                    onChange={(e) => this.changeTextareaHandler(e, comment.id)}
                  />
                  {this.state["edit_comment_" + comment.id] && (
                    <div className="text-right">
                      <MDBBtn
                        color="elegant"
                        size="md"
                        onClick={() =>
                          this.editComment(
                            comment,
                            this.state["edit_comment_" + comment.id]
                          )
                        }
                      >
                        <MDBIcon icon="comment-alt" className="pr-2" />
                        Save Changes
                      </MDBBtn>
                    </div>
                  )}
                </div>
              ) : (
                <p
                  className="mb-0"
                  dangerouslySetInnerHTML={{
                    __html: message && message.escape(),
                  }}
                ></p>
              )}
              <div>
                {auth.uid !== comment.data.author.uid && (
                  <MDBIcon
                    icon="angle-up clickable"
                    className={
                      !this.state.liked ? "text-white p-2" : "text-red p-2"
                    }
                    onClick={() => {
                      if (this.state.liked) {
                        this.setState({ liked: false }, () => {
                          this.props.removeLike(comment.id);
                          this.updateLikes(-1);
                        });
                      } else {
                        this.setState(
                          {
                            liked: true,
                          },
                          () => {
                            this.props.createLike(comment.id);
                            this.updateLikes(1);
                          }
                        );
                      }
                    }}
                    size="lg"
                  />
                )}
                <span className="text-muted">
                  <small>{likeCount} Likes</small>
                </span>
              </div>
              {this.state.settings && (
                <div className="settings-tab">
                  {!this.state.delete ? (
                    <div>
                      <span
                        className="clickable"
                        onClick={() => this.setState({ delete: true })}
                      >
                        Delete
                      </span>
                      <span className="mx-2">|</span>
                      {!this.state.edit ? (
                        <span
                          className="clickable"
                          onClick={() => this.setState({ edit: true })}
                        >
                          Edit
                        </span>
                      ) : (
                        <span
                          className="clickable"
                          onClick={() => this.setState({ edit: false })}
                        >
                          Cancel Edit
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span
                        className="clickable text-danger"
                        onClick={() =>
                          this.setState({ delete: false }, () =>
                            this.removeComment(comment)
                          )
                        }
                      >
                        Remove comment permanently
                      </span>
                      <span className="mx-2">|</span>
                      <span
                        className="clickable"
                        onClick={() => this.setState({ delete: false })}
                      >
                        Cancel
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
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
    receivedUser: state.user.receivedUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (uid) => dispatch(getUser(uid)),
    getUserByName: (sithName) => dispatch(getUserByName(sithName)),
    createLike: (cid) => dispatch(createLike(cid)),
    removeLike: (cid) => dispatch(removeLike(cid)),
    hasLiked: (cid) => dispatch(hasLiked(cid)),
    getLikeAmount: (cid) => dispatch(getLikeAmount(cid)),
    removeComment: (comment) => dispatch(removeComment(comment)),
    editComment: (comment, newmsg) => dispatch(editComment(comment, newmsg)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(Comment);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
