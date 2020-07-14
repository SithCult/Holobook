//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// React Prop Types
import PropTypes from "prop-types";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBBadge } from "mdbreact";

//> Components
import { NotificationItem } from "../../molecules";
//#endregion

//#region > Components
class NotifBox extends React.Component {
  state = {};

  render() {
    const { notifications } = this.props;

    return (
      <div className="notify">
        {notifications.length > 0 ? (
          notifications.map((n, i) => (
            <NotificationItem details={n} key={i}></NotificationItem>
          ))
        ) : (
          <p className="text-muted small p-2">No new notifications</p>
        )}
      </div>
    );
  }
}
//#endregion

//#region > PropTypes
NotifBox.propTypes = {
  notifications: PropTypes.array.isRequired,
};
//#endregion

//#region > Exports
export default NotifBox;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
