//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// React Prop Types
import PropTypes from "prop-types";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBBadge } from "mdbreact";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { getNotifs } from "../../../store/actions/notificationActions";

//> Components
import { NotificationItem } from "../../molecules";
//#endregion

//#region > Components
class NotifBox extends React.Component {
  state = {};

  componentDidMount = async () => {
    this.getNotifs();
  };

  getNotifs = () => {
    // Get notifications
    this.props.getNotifs();
  };

  render() {
    const { notifications } = this.props;
    return (
      <div className="notificationbox text-white">
        Notifications
        {notifications &&
          notifications.map((n, i) => (
            <NotificationItem details={n} key={i}></NotificationItem>
          ))}
      </div>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNotifs: (uid) => dispatch(getNotifs(uid)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(NotifBox);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
