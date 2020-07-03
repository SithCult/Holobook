//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional libraries
// Calculate time ago
import TimeAgo from "javascript-time-ago";
// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";

//> Components
import ReceivedUser from "../ReceivedUser";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";

//> Redux Firebase
// Getting user information
import {
  createLike,
  removeLike,
  hasLiked,
  getLikeAmount,
} from "../../../store/actions/likeActions";
import { getUser } from "../../../store/actions/userActions";
// Connect
import { connect } from "react-redux";

//> Components
import { Comments } from "../../organisms/";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";
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
class Post extends React.Component {
  state = {
    liked: false,
  };

  componentDidMount = async () => {
    this.setState({
      receivedUser: await this.props.getUser(this.props.uid),
      comments: this.props.comments,
      liked: await this.props.hasLiked(this.props.post.id),
      likeCount: await this.props.getLikeAmount(this.props.post.id),
    });
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      comments: nextProps.comments,
    });
  };

  updateLikes = async (amount) => {
    this.setState({
      likeCount: this.state.likeCount + amount,
    });
  };

  calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo("en-US");

    return timeAgo.format(timestamp);
  };

  render() {
    const { auth, post, key } = this.props;
    const { receivedUser, comments, likeCount, liked } = this.state;

    return (
      <MDBCard
        className={post.data.visible ? "mb-3 post" : "mb-3 post deleted"}
        key={key}
      >
        <MDBCardBody className={post.data.skin ? post.data.skin : ""}>
          <MDBRow>
            <MDBCol className="flex-center">
              <div className="p-2">
                {(() => {
                  switch (post.data.skin) {
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
              </div>
              <div className="p-2 author-info">
                <ReceivedUser
                  receivedUser={receivedUser}
                  name={post.data.author.name}
                />
                {post.data.details.feeling && (
                  <i className="feeling">
                    <MDBIcon
                      icon={post.data.details.feeling.icon}
                      className="pl-1"
                      size="lg"
                    />
                    - is feeling {post.data.details.feeling.name}
                  </i>
                )}
                <small className="text-muted d-block">
                  {post.data.details.ip && (
                    <>
                      <MDBIcon icon="map-marker-alt" className="pr-1" />
                      {post.data.details.ip.country_name}
                      {" | "}
                    </>
                  )}
                  <MDBIcon
                    icon="language"
                    className={post.data.basic ? "text-gold" : ""}
                  />
                  {" | "}
                  <MDBIcon
                    icon="globe-americas"
                    className={post.data.target ? "text-gold" : ""}
                  />
                </small>
              </div>
              <div className="ml-auto p-2 mb-auto">
                <small className="text-muted">
                  {this.calculateTimeAgo(post.data.timestamp)}
                </small>
                {post.data.skin && post.data.skin !== "standard" && (
                  <div className="skin-label">
                    <small className={post.data.skin + "-label"}>
                      {post.data.skin} Edition
                    </small>
                  </div>
                )}
              </div>
            </MDBCol>
          </MDBRow>
          <div className="p-3">
            <p
              dangerouslySetInnerHTML={{
                __html: post.data.content.escape(),
              }}
              className={
                post.data.basic && this.state.basic !== post.id
                  ? "basic hand"
                  : ""
              }
            ></p>
            {post.data.basic && (
              <div className="toggle-basic">
                {this.state.basic !== post.id ? (
                  <small
                    className="clickable"
                    onClick={() => this.setState({ basic: post.id })}
                  >
                    Translate
                  </small>
                ) : (
                  <small
                    className="clickable"
                    onClick={() => this.setState({ basic: 0 })}
                  >
                    Show original
                  </small>
                )}
              </div>
            )}
            {post.data.youtubeId && (
              <div className="embed-responsive embed-responsive-16by9 mt-3">
                <iframe
                  className="embed-responsive-item"
                  src={"//www.youtube.com/embed/" + post.data.youtubeId}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          <div
            className={
              auth.uid === post.data.author.uid
                ? "px-2 bottom flex-center"
                : "px-2 bottom"
            }
          >
            <>
              <MDBIcon
                icon="angle-up"
                className={
                  !this.state.liked ? "text-white p-2" : "text-red p-2"
                }
                onClick={() => {
                  if (this.state.liked) {
                    this.setState(
                      {
                        liked: false,
                      },
                      () => {
                        this.props.removeLike(post.id);
                        this.updateLikes(-1);
                      }
                    );
                  } else {
                    this.setState(
                      {
                        liked: true,
                      },
                      () => {
                        this.props.createLike(post.id);
                        this.updateLikes(1);
                      }
                    );
                  }
                }}
                size="lg"
              />
              <span className="text-muted">
                {this.state.likeCount}{" "}
                {this.state.likeCount === 1 ? "Like" : "Likes"}
              </span>
            </>
            {auth.uid === post.data.author.uid && (
              <div className="ml-auto p-2 mb-auto">
                {this.state["delete-" + post.id] ? (
                  <>
                    <small
                      className="clickable text-danger"
                      onClick={() => {
                        this.props.removePost(post.id, post.data.author.uid);
                        this.props.refreshData();
                      }}
                    >
                      Remove post permanently
                    </small>
                    <small className="px-2 text-muted">|</small>
                    <small
                      className="clickable"
                      onClick={() =>
                        this.setState({ ["delete-" + post.id]: false })
                      }
                    >
                      Cancel
                    </small>
                  </>
                ) : (
                  <small
                    className="clickable"
                    onClick={() =>
                      this.setState({ ["delete-" + post.id]: true })
                    }
                  >
                    Delete post
                  </small>
                )}
              </div>
            )}
          </div>
          <hr />
          <div className="mt-3">
            <Comments
              items={comments}
              pid={post.id}
              refreshData={this.props.refreshData}
            />
          </div>
        </MDBCardBody>
      </MDBCard>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    receivedUser: state.user.receivedUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (uid) => dispatch(getUser(uid)),
    createLike: (pid) => dispatch(createLike(pid)),
    removeLike: (pid) => dispatch(removeLike(pid)),
    hasLiked: (pid) => dispatch(hasLiked(pid)),
    getLikeAmount: (pid) => dispatch(getLikeAmount(pid)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(Post);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
