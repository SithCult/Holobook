//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router DOM bindings
import { Link } from "react-router-dom";
// React Prop Types
import PropTypes from "prop-types";

//> Additional libraries
// Calculate time ago
import TimeAgo from "javascript-time-ago";
// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";
// Date/Time formatting
import moment from "moment";
// Flags for countries
import ReactCountryFlag from "react-country-flag";
// Country list
import countryList from "react-select-country-list";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBAvatar, MDBIcon } from "mdbreact";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { removeNotification } from "../../../store/actions/notificationActions";

//> CSS
import "./notificationitem.scss";
//#endregion

//#region > Components
class NotificationItem extends React.Component {
  // Calculate time ago
  calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);

    const timeAgo = new TimeAgo("en-US");

    return timeAgo.format(timestamp);
  };

  render() {
    const { details } = this.props;

    console.log(details);

    return (
      <Link
        to={{
          pathname: "/chat",
          chatProps: {
            chid: details.data.chid,
          },
        }}
        className="notify-item d-block clickable"
      >
        <div>
          <div className="d-flex justify-content-between">
            <p className="small font-weight-bold">
              {details.data.chatName.length === 2 ? (
                <div>
                  <div className="text-center flag">
                    <ReactCountryFlag svg countryCode={details.data.chatName} />
                  </div>
                  {countryList().getLabel(details.data.chatName)}
                </div>
              ) : (
                <p className="mb-0">
                  {details.data.chatName.split("and").length === 2 ? (
                    <>
                      {details.data.chatName
                        .split("and")[1]
                        ?.trim()
                        .toLowerCase() ===
                      this.props.profile.sith_name?.toLowerCase()
                        ? details.data.chatName.split("and")[0]
                        : details.data.chatName.split("and")[1]}
                    </>
                  ) : (
                    <span>{details.data.chatName}</span>
                  )}
                </p>
              )}
            </p>
            <p className="text-muted small">
              {moment(
                details.data.sentTimestamp > new Date().getTime()
                  ? new Date().getTime()
                  : details.data.sentTimestamp
              ).format("MMM Do")}
            </p>
          </div>
          <div>
            <p className="blue-text small">
              {details.data.msg.length > 10
                ? details.data.msg.slice(0, 10) + "..."
                : details.data.msg}
            </p>
          </div>
        </div>
      </Link>
    );
  }
}
//#endregion

//#region > PropTypes
NotificationItem.propTypes = {
  details: PropTypes.object.isRequired,
};
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    profile: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeNotification: (nid) => dispatch(removeNotification(nid)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(NotificationItem);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
