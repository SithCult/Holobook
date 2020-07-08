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
// Date/Time formatting
import moment from "moment";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBAvatar, MDBIcon } from "mdbreact";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { readMessage } from "../../../store/actions/chatActions";

//> CSS
import "./messageitem.scss";

//> Components
import { RankItem } from "../../atoms";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";
//#endregion

//#region > Components
class MessageItem extends React.Component {
  componentDidMount() {
    this.props.readMessage(
      this.props.uid,
      this.props.chid,
      this.props.mid,
      this.props.read
    );
  }

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

  // Calculate time ago
  calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo("en-US");

    return timeAgo.format(timestamp);
  };

  // Check if the message has been read and render result accordingly
  getReadStatus = () => {
    if (this.props.chatUsers.length === this.props.read.length) {
      return (
        <span className="text-muted">
          <MDBIcon icon="check-circle" className="mr-2 blue-text" />
          Read
        </span>
      );
    } else {
      if (this.props.chatUsers.length > 2) {
        return (
          <span className="text-muted">
            <MDBIcon far icon="check-circle" className="mr-2" />
            Read by {this.props.read.length - 1} /{" "}
            {this.props.chatUsers.length - 1}
          </span>
        );
      } else {
        return (
          <span className="text-muted">
            <MDBIcon far icon="check-circle" className="mr-2" />
            Delivered
          </span>
        );
      }
    }
  };

  /** assumes array elements are primitive types
   * check whether 2 arrays are equal sets.
   * @param  {} a1 is an array
   * @param  {} a2 is an array
   */
  areArraysEqualSets(a1, a2) {
    const arr1 = a1.concat().sort();
    const arr2 = a2.concat().sort();

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    return true;
  }

  render() {
    const { msg, mid, author, reverse, timestamp, spacing } = this.props;

    return (
      <>
        {spacing && (
          <div className="text-center mb-3">
            <hr className="mb-1" />
            <span className="small text-muted">
              {moment(timestamp).format("MMMM Do YYYY h:mm a")}
            </span>
          </div>
        )}
        <div className="chat-item" key={mid}>
          <div className={reverse ? "d-flex reverse" : "d-flex"}>
            <div>
              {this.getPicture(author.data.skin, mid, author.sith_name)}
            </div>
            <div className="body-container">
              <div className="body">
                <div className="d-flex justify-content-between">
                  <span className="font-weight-bold">
                    {author.data.title} {author.data.sith_name}
                    {author.data.badges.includes("grandmoff") && (
                      <RankItem rank="grandmoff" />
                    )}
                    {author.data.badges.includes("hand") && (
                      <RankItem rank="hand" />
                    )}
                    {author.data.badges.includes("moff") && (
                      <RankItem rank="moff" />
                    )}
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
          {this.props.reverse && (
            <div className="text-right">
              <span className="read small mr-5">{this.getReadStatus()}</span>
            </div>
          )}
        </div>
      </>
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

//#region > Functions
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    readMessage: (uid, chid, mid, read) =>
      dispatch(readMessage(uid, chid, mid, read)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(MessageItem);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
