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
// Getting user information
import { createLike } from "../../../store/actions/likeActions";
import { getUser } from "../../../store/actions/userActions";
// Getting comments
import { loadComments } from "../../../store/actions/commentActions";
// Connect
import { connect } from "react-redux";

//> Components
import { Comments } from "../../organisms/";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
//#endregion

//#region > Components
class Post extends React.Component {
  state = {
    liked: false,
  };

  componentDidMount = async () => {
    this.setState({
      receivedUser: await this.props.getUser(this.props.uid),
      comments: await this.props.loadComments(this.props.post.id),
    });
  };

  calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo("en-US");

    return timeAgo.format(timestamp);
  };

  render() {
    const { auth, post, key } = this.props;
    const { receivedUser, comments } = this.state;

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
                <MDBPopover
                  placement="top"
                  popover
                  clickable
                  domElement
                  className="furtherInfo"
                  onChange={this.handlePopoverChange}
                >
                  <div className="clickable name">{post.data.author.name}</div>
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
              dangerouslySetInnerHTML={{ __html: post.data.content }}
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
            {post.data.image && (
              <div className="p-4">
                <img
                  className="img-fluid w-100 h-auto"
                  src={post.data.image}
                  alt={"Uploaded image by " + post.data.author}
                />
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
                className="text-white p-2"
                onClick={() => {
                  this.setState(
                    {
                      liked: true,
                    },
                    () => this.props.createLike(post.id)
                  );
                }}
                size="lg"
              />
              <span className="text-muted">blyat</span>
            </>
            {/*this.alreadyLiked(post.data.likes) ? (
                  <>
                    <MDBIcon
                      icon="angle-up"
                      className="text-white p-2"
                      onClick={() => {
                        this.props.unlikePost(
                          post.id,
                          this.props.auth.uid,
                          post.data.likes
                        );
                        this.props.load(this.props.posts.length);
                      }}
                      size="lg"
                    />
                    <span className="text-muted">
                      {post.data.likes.length !== 0 ? (
                        <>
                          {post.data.likes.length + " "}
                          {post.data.likes.length > 1
                            ? "approvals"
                            : "approval"}
                        </>
                      ) : (
                        "0 approvals"
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <MDBIcon
                      icon="angle-up"
                      className="text-muted p-2"
                      onClick={() => {
                        this.props.likePost(
                          post.id,
                          this.props.auth.uid,
                          post.data.likes
                        );
                        this.props.load(this.props.posts.length);
                      }}
                      size="lg"
                    />
                    <span className="text-muted">
                      {post.data.likes.length !== 0 ? (
                        <>
                          {post.data.likes.length + " "}
                          {post.data.likes.length > 1
                            ? "approvals"
                            : "approval"}
                        </>
                      ) : (
                        "0 approvals"
                      )}
                    </span>
                  </>
                      )*/}
            {auth.uid === post.data.author.uid && (
              <div className="ml-auto p-2 mb-auto">
                {this.state["delete-" + post.id] ? (
                  <>
                    <small
                      className="clickable text-danger"
                      onClick={() => {
                        this.props.removePost(post.id, post.data.author.uid);
                        this.props.load();
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
          <div className="card-footer mt-3">
            <Comments items={comments} />
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
    comments: state.comment.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (uid) => dispatch(getUser(uid)),
    loadComments: (pid) => dispatch(loadComments(pid)),
    createLike: (pid) => dispatch(createLike(pid)),
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
