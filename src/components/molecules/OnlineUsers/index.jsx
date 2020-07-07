//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React, { Component } from "react";

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
import { MDBIcon, MDBProgress, MDBCard, MDBAvatar } from "mdbreact";

//> Components
import { RankItem } from "../../atoms";

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

  // Get user picture‚
  getPicture = (skin, index, name) => {
    switch (skin) {
      case "gold":
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={goldUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "light":
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={lightUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "bronze":
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={bronzeUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "dark":
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={darkUserIMG} alt={name} />
          </MDBAvatar>
        );
      default:
        return (
          <MDBAvatar className="mx-auto white online" key={index}>
            <img src={defaultUserIMG} alt={name} />
          </MDBAvatar>
        );
    }
  };

  // Merge user data with respective online / offline status
  mergeUserData = (onlineusers) => {
    // If state has users and the onlineuser array is defined, merge data
    if (this.state.users && onlineusers.length > 0) {
      // Go through all user data
      let usersWithStatus = this.state.users.map((u) => {
        let newUser;

        //Get the status of the user by uid
        let userStatusData = onlineusers.filter((o) => o.uid === u.id)[0];

        // If user has a status
        if (userStatusData) {
          // Write status into user object
          newUser = {
            ...u,
            status: {
              state: userStatusData.state,
              last_changed: userStatusData.last_changed,
            },
          };
        } else {
          // Write default status into user object
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
        return el !== undefined;
      });

      this.setState({ users: usersWithStatus });
    }
  };

  render() {
    const { onlineusercount } = this.props;
    const { users } = this.state;

    // Merge user data
    if (users && this.props.onlineusers && !users[0].status) {
      this.mergeUserData(this.props.onlineusers);
    }

    return (
      <div id="onlineusers">
        {!onlineusercount ? (
          <MDBProgress material preloader className="placeholder mt-1" />
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <span className="d-flex align-items-center">
                <MDBIcon
                  icon="circle"
                  className="text-success mr-1"
                  style={{ fontSize: "0.5rem" }}
                />
                Online Sith
              </span>
              <p className="small text-muted mb-0">
                {onlineusercount} users online
              </p>
            </div>
            <hr className="my-2" />
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
                              i,
                              user.data.sith_name
                            )}
                            <span className="pl-2">{user.data.sith_name}</span>
                          </div>
                          <span className="small text-muted">
                            {user.data.badges.includes("moff") && (
                              <RankItem rank="moff" />
                            )}
                            {user.data.badges.includes("grandmoff") && (
                              <RankItem rank="grandmoff" />
                            )}
                            {user.data.badges.includes("hand") && (
                              <RankItem rank="hand" />
                            )}
                            <span className="ml-1">{user.data.title}</span>
                          </span>
                        </div>
                      </MDBCard>
                    );
                  } else {
                    return null;
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
