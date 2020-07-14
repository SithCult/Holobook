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
// Link preview
import { ReactTinyLink } from "react-tiny-link";

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

//#region > Functions
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

// eslint-disable-next-line no-extend-native
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

  processMsg = (msg) => {
    let replacedText, replacePattern1, replacePattern2, replacePattern3;
    const inputText = msg.escape();

    //URLs starting with http://, https://, or ftp://
    // eslint-disable-next-line no-useless-escape
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(
      replacePattern1,
      '<a href="$1" target="_blank">$1</a>'
    );

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    // eslint-disable-next-line no-useless-escape
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(
      replacePattern2,
      '$1<a href="http://$2" target="_blank">$2</a>'
    );

    //Change email addresses to mailto:: links.
    // eslint-disable-next-line no-useless-escape
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(
      replacePattern3,
      '<a href="mailto:$1">$1</a>'
    );

    return replacedText;
  };

  checkForLink = (msg) => {
    // eslint-disable-next-line no-useless-escape
    const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    // eslint-disable-next-line no-useless-escape
    const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    let match;

    match = msg.match(replacePattern1);

    // Check if first pattern matched, if not try second pattern
    if (!match) {
      match = msg.match(replacePattern2);
    }

    // Check if match exists (if url is in post)
    if (match) {
      let url = match[0].trim();

      if (!/^https?:\/\//i.test(url)) {
        url = "http://" + url;
      }

      return url;
    } else {
      return null;
    }
  };

  render() {
    const { msg, mid, author, reverse, timestamp, spacing } = this.props;

    // Get link if there is any
    const url = this.checkForLink(msg);

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
                  <span
                    dangerouslySetInnerHTML={{ __html: this.processMsg(msg) }}
                  ></span>
                </div>
                {url && !this.state?.hideUrlPreview && (
                  <ReactTinyLink
                    cardSize="small"
                    showGraphic={true}
                    maxLine={2}
                    minLine={1}
                    url={url}
                    onError={() => this.setState({ hideUrlPreview: true })}
                  />
                )}
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
