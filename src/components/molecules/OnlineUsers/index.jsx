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
import {
  getOnlineUserCount,
  getOnlineUsers,
  getAllUsers,
} from "../../../store/actions/userActions";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBIcon, MDBTooltip, MDBProgress, MDBCard, MDBAvatar } from "mdbreact";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";

//> CSS
import "./onlineusers.scss";
//#endregion

//#region > Components
class OnlineUsers extends Component {
  state = {};

  componentDidMount = async () => {
    // Get all users
    this.setState({ users: await this.props.getAllUsers() }, () => {
      // Get user count
      this.props.getOnlineUserCount();

      // Get user online state
      this.props.getOnlineUsers();
    });
  };

  componentWillReceiveProps = (nextProps) => {
    // Handle active user change
    if (this.props.onlineusers !== nextProps.onlineusers) {
      this.mergeUserData(nextProps.onlineusers);
    }
  };

  getPicture = (skin, badges, uid, index) => {
    switch (skin) {
      case "gold":
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={goldUserIMG} alt="Gold user profile picture" />
          </MDBAvatar>
        );
      case "light":
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={lightUserIMG} alt="Light user profile picture" />
          </MDBAvatar>
        );
      case "bronze":
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={bronzeUserIMG} alt="Bronze user profile picture" />
          </MDBAvatar>
        );
      case "dark":
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={darkUserIMG} alt="Bronze user profile picture" />
          </MDBAvatar>
        );
      default:
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={defaultUserIMG} alt="Default user profile picture" />
          </MDBAvatar>
        );
    }
  };

  mergeUserData = (onlineusers) => {
    if (this.state.users && onlineusers.length > 0) {
      let usersWithStatus = this.state.users.map((u) => {
        let newUser;
        let userStatusData = onlineusers.filter((o) => o.uid === u.id)[0];

        if (userStatusData) {
          newUser = {
            ...u,
            status: {
              state: userStatusData.state,
              last_changed: userStatusData.last_changed,
            },
          };
        } else {
          newUser = {
            ...u,
            status: {
              state: "offline",
              last_changed: 1519129000,
            },
          };
        }

        return newUser;
      });

      usersWithStatus = usersWithStatus.filter(function (el) {
        return el != undefined;
      });

      this.setState({ users: usersWithStatus });
    }
  };

  render() {
    const { onlineusercount, onlineusers } = this.props;
    const { users } = this.state;

    if (users && this.props.onlineusers && !users[0].status) {
      this.mergeUserData(this.props.onlineusers);
    }

    return (
      <div id="onlineusers">
        {!onlineusercount ? (
          <MDBProgress material preloader className="placeholder mt-1" />
        ) : (
          <>
            <div className="d-flex justify-content-between">
              <MDBTooltip placement="top" domElement>
                <span>
                  <MDBIcon icon="circle" className="text-success" size="sm" />
                </span>
                <span>You are online</span>
              </MDBTooltip>
              <p className="small text-muted">{onlineusercount} users online</p>
            </div>
            <hr className="mt-0 mb-2" />
            <div>
              {users &&
                users.map((user, i) => {
                  if (user?.status?.state === "online") {
                    return (
                      <MDBCard className="text-left">
                        <div className="d-flex justify-content-between">
                          <div className="d-flex align-items-center">
                            {this.getPicture(
                              user.data.skin,
                              user.data.badges,
                              user.id,
                              i
                            )}
                            <span className="pl-2">{user.data.sith_name}</span>
                          </div>
                          <span className="small text-muted">
                            {user.data.title.toLowerCase().trim() ===
                              "darth" && (
                              <MDBIcon
                                icon="crown"
                                className={
                                  user.data.badges.includes("moff")
                                    ? "pr-1 amber-text"
                                    : "pr-1"
                                }
                              />
                            )}
                            {user.data.title}
                          </span>
                        </div>
                      </MDBCard>
                    );
                  }
                })}
            </div>
          </>
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
    onlineusers: state.user.onlineusers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOnlineUserCount: () => dispatch(getOnlineUserCount()),
    getOnlineUsers: () => dispatch(getOnlineUsers()),
    getAllUsers: () => dispatch(getAllUsers()),
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
