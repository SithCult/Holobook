//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React, { Component } from "react";

//> Additional
// Firebase
import firebase from "firebase";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { getOnlineUserCount } from "../../../store/actions/userActions";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBadge,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBSpinner,
  MDBIcon,
} from "mdbreact";
//#endregion

//#region > Components
class OnlineUsers extends Component {
  componentDidMount() {
    this.props.getOnlineUserCount();
  }

  render() {
    return (
      <div id="onlineusers">
        <div className="d-flex justify-content-between">
          <MDBIcon icon="circle" className="text-success" size="sm" />
          <p className="small text-muted">
            {this.props.onlineusercount} users online
          </p>
        </div>
      </div>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    onlineusercount: state.user.onlineusercount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOnlineUserCount: () => dispatch(getOnlineUserCount()),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(OnlineUsers);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
