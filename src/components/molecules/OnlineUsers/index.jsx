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
  MDBTooltip,
  MDBProgress,
} from "mdbreact";
//#endregion

//#region > Components
class OnlineUsers extends Component {
  componentDidMount() {
    this.props.getOnlineUserCount();
  }

  render() {
    const { onlineusercount } = this.props;

    return (
      <div id="onlineusers">
        {!onlineusercount ? (
          <MDBProgress material preloader className="placeholder mt-1" />
        ) : (
          <div className="d-flex justify-content-between">
            <MDBTooltip placement="top" domElement>
              <span>
                <MDBIcon icon="circle" className="text-success" size="sm" />
              </span>
              <span>You are online</span>
            </MDBTooltip>
            <p className="small text-muted">{onlineusercount} users online</p>
          </div>
        )}
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
