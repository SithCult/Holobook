//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// React Prop Types
import PropTypes from "prop-types";

//> Additional libraries
// Calculate time ago
import TimeAgo from "javascript-time-ago";
// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBAvatar,
  MDBCard,
  MDBCardBody,
} from "mdbreact";

//> CSS
import "./messageitem.scss";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";
//#endregion

//#region > Components
class MessageItem extends React.Component {
  // Get user profile picture
  getPicture = (skin, index, name) => {
    switch (skin) {
      case "gold":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={goldUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "light":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={lightUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "bronze":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={bronzeUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "dark":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={darkUserIMG} alt={name} />
          </MDBAvatar>
        );
      default:
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={defaultUserIMG} alt={name} />
          </MDBAvatar>
        );
    }
  };

  calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo("en-US");

    return timeAgo.format(timestamp);
  };

  render() {
    const { msg, mid, read, author, reverse, timestamp } = this.props;
    console.log(author);

    return (
      <div className="chat-item" key={mid}>
        <div className={reverse ? "d-flex reverse" : "d-flex"}>
          <div>{this.getPicture(author.data.skin, mid, author.sith_name)}</div>
          <div className="body-container">
            <div className="body">
              <div className="d-flex justify-content-between">
                <span className="font-weight-bold">
                  {author.data.title} {author.data.sith_name}
                </span>
                <span className="small text-muted">
                  {this.calculateTimeAgo(timestamp)}
                </span>
              </div>
              <div>
                <span>{msg}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//#endregion

//#region > PropTypes
MessageItem.propTypes = {
  mid: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
  read: PropTypes.array.isRequired,
  reverse: PropTypes.bool.isRequired,
};
//#endregion

//#region > Exports
export default MessageItem;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
