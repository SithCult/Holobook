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
import { getOnlineUsers } from "../../../store/actions/userActions";

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
    this.props.getOnlineUsers();
  }
  render() {
    return (
      <div id="onlineusers">
        <h4 className="white-text">{this.props.onlineusers} users online</h4>
      </div>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    onlineusers: state.user.onlineusers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOnlineUsers: () => dispatch(getOnlineUsers()),
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
