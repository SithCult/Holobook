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
// Actions for comments
import {
  removeComment,
  likeComment,
  unlikeComment,
} from "../../../store/actions/commentActions";
// Getting user information
import { getUser, clearUser } from "../../../store/actions/userActions";
// Connect
import { connect } from "react-redux";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";

//> CSS
import "./comment.scss";
//#endregion

//#region > Components
class Comment extends React.Component {
  state = {};

  componentDidMount = async () => {
    console.log("PROPS", this.props);
    this.setState({
      receivedUser: await this.props.getUser(this.props.comment.author.uid),
    });
  };

  _calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo("en-US");

    return timeAgo.format(timestamp);
  };

  handlePopoverChange = (open) => {
    if (!open) {
      this.props.clearUser();
    }
  };

  render() {
    const { comment, child } = this.props;
    const { receivedUser } = this.state;

    return (
      <div
        className={
          child
            ? "comment d-flex justify-content-between child-comment"
            : "comment d-flex justify-content-between"
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
        <div className="content">
          <div className="p-2 author-info d-flex justify-content-between align-items-center">
            <div>
              <MDBPopover
                placement="top"
                popover
                clickable
                domElement
                className="furtherInfo"
                onChange={this.handlePopoverChange}
              >
                <div
                  className="clickable name"
                  onClick={() => this.props.getUser(comment.author.uid)}
                >
                  {comment.author.name}
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
                {comment.timestamp && this._calculateTimeAgo(comment.timestamp)}
              </small>
            </div>
          </div>
          <div className="px-3 pb-3">
            <p className="mb-0">{comment.msg}</p>
          </div>
        </div>
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
    receivedUser: state.user.receivedUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    likeComment: (uniqueID, user, likes) =>
      dispatch(likeComment(uniqueID, user, likes)),
    getUser: (uid) => dispatch(getUser(uid)),
    clearUser: () => dispatch(clearUser()),
    unlikeComment: (uniqueID, user, likes) =>
      dispatch(unlikeComment(uniqueID, user, likes)),
    removeComment: (uid, commentID) => dispatch(removeComment(uid, commentID)),
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
