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
import { removeNotification } from "../../../store/actions/notificationActions";
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

    return <div>{details.data.msg}</div>;
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
  return {};
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
