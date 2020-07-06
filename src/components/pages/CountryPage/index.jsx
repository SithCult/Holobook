//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Redirect from Router
import { Link, Redirect, withRouter } from "react-router-dom";
// Meta tags
import { Helmet } from "react-helmet";

//> Additional libraries
// Calculate time ago
import TimeAgo from "javascript-time-ago";
// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";
// Flags for countries
import ReactCountryFlag from "react-country-flag";
// Country list
import countryList from "react-select-country-list";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import {
  getUsersPerCountry,
  getOnlineUsers,
} from "../../../store/actions/userActions";
import {
  getCountryChat,
  createChat,
  joinChat,
} from "../../../store/actions/chatActions";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBAvatar,
  MDBBadge,
  MDBProgress,
} from "mdbreact";

//> Components
import { Chat } from "../../organisms";

//> CSS
import "./countrypage.scss";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";
//#endregion

//#region > Components
class CountryPage extends React.Component {
  state = {
    country: "Loading",
  };

  componentDidMount = () => {
    this.init(this.props.match?.params?.country);

    this.props.getOnlineUsers();
  };

  componentWillReceiveProps = (nextProps) => {
    // Handle country change
    if (
      this.props.match?.params.country.toLowerCase().trim() !==
      nextProps.match.params.country.toLowerCase().trim()
    ) {
      this.init(nextProps.match.params.country);
    }

    // Handle active user change
    if (this.props.onlineusers !== nextProps.onlineusers) {
      this.mergeUserData(nextProps.onlineusers);
    }
  };

  init = async (country) => {
    if (country) {
      this.setState(
        {
          users: await this.props.getUsersPerCountry(country),
          country_code: country ? country.toLowerCase().trim() : null,
          country: country ? countryList().getLabel(country) : null,
        },
        async () => {
          let countryChat = await this.props.getCountryChat(
            this.state.country_code
          );

          console.log(countryChat);

          if (!countryChat) {
            console.log("Country chat does not exist, creating a new one");

            let userIDs = [];

            this.state.users.map((u) => {
              userIDs = [...userIDs, u.id];
            });

            this.props.createChat(this.state.country_code + " Chat", userIDs);

            this.setState({
              countryChat: await this.props.getCountryChat(
                this.state.country_code
              ),
            });
          } else {
            this.setState({ countryChat });
          }
        }
      );
    }
  };

  calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);

    const timeAgo = new TimeAgo("en-US");

    return timeAgo.format(timestamp);
  };

  // Get moff of country
  getMoff = (users) => {
    const found = users.map((user, i) => {
      if (user.data.badges.includes("moff")) {
        return user;
      } else {
        return null;
      }
    });

    // Remove all null from array
    const filtered = found.filter(function (el) {
      return el != null;
    });

    // check if there are any results left
    if (filtered.length > 0) {
      // Return result
      return (
        <div className="memberlist moffs">
          {filtered.map((found, f) => {
            return (
              <MDBCard className="text-left" key="f">
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    {this.getPicture(
                      found.data.skin,
                      found.id,
                      f,
                      found.data.sith_name
                    )}
                    <span className="pl-2">
                      {found.data.title} {found.data.sith_name}
                      {found.status && found.status.state === "offline" ? (
                        <span className="d-block small text-muted">
                          Last seen{" "}
                          {this.calculateTimeAgo(found.status.last_changed)}
                        </span>
                      ) : (
                        <span className="d-block small text-success">
                          Currently online
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="small text-muted">
                    {found.data.title.toLowerCase().trim() === "darth" && (
                      <MDBIcon
                        icon="angle-double-up"
                        className={
                          found.data.badges.includes("moff")
                            ? "pr-1 amber-text"
                            : "pr-1"
                        }
                      />
                    )}
                    {found.data.title}
                  </span>
                </div>
                <span className="d-block small text-info my-1">
                  {found.data.department}
                </span>
                {found.data.donations && (
                  <div>
                    <MDBBadge pill color="amber" className="mt-2">
                      <MDBIcon icon="dollar-sign" /> Supporter
                    </MDBBadge>
                  </div>
                )}
              </MDBCard>
            );
          })}
        </div>
      );
    } else {
      return <p className="small text-muted">No Moff yet</p>;
    }
  };

  // Get user profile picture
  getPicture = (skin, uid, index, name) => {
    switch (skin) {
      case "gold":
        return (
          <MDBAvatar
            className={
              this.getStatus(uid)
                ? "mx-auto white online"
                : "mx-auto white offline"
            }
            key={index}
          >
            <img src={goldUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "light":
        return (
          <MDBAvatar
            className={
              this.getStatus(uid)
                ? "mx-auto white online"
                : "mx-auto white offline"
            }
            key={index}
          >
            <img src={lightUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "bronze":
        return (
          <MDBAvatar
            className={
              this.getStatus(uid)
                ? "mx-auto white online"
                : "mx-auto white offline"
            }
            key={index}
          >
            <img src={bronzeUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "dark":
        return (
          <MDBAvatar
            className={
              this.getStatus(uid)
                ? "mx-auto white online"
                : "mx-auto white offline"
            }
            key={index}
          >
            <img src={darkUserIMG} alt={name} />
          </MDBAvatar>
        );
      default:
        return (
          <MDBAvatar
            className={
              this.getStatus(uid)
                ? "mx-auto white online"
                : "mx-auto white offline"
            }
            key={index}
          >
            <img src={defaultUserIMG} alt={name} />
          </MDBAvatar>
        );
    }
  };

  // Returns either a red circle for offline or a green circle for online
  getStatus = (uid) => {
    if (this.props.onlineusers) {
      let userStatusData = this.props.onlineusers.filter(
        (o) => o.uid === uid
      )[0];

      if (userStatusData) {
        if (userStatusData?.state === "online") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  // Merge user data with their online status
  mergeUserData = (onlineusers) => {
    // If users and status data is defined
    if (this.state.users && onlineusers.length > 0) {
      let usersWithStatus = this.state.users.map((u) => {
        let newUser;

        // Get the status of the user
        let userStatusData = onlineusers.filter((o) => o.uid === u.id)[0];

        // If the status is defined
        if (userStatusData) {
          // Write status into user object
          newUser = {
            ...u,
            status: {
              state: userStatusData.state ? userStatusData.state : "offline",
              last_changed: userStatusData.last_changed
                ? userStatusData.last_changed
                : 1577836800000,
            },
          };
        } else {
          // Write default value and make user offline
          newUser = {
            ...u,
            status: {
              state: "offline",
              last_changed: 1577836800000,
            },
          };
        }

        return newUser;
      });

      // Sort by online status
      /*usersWithStatus.sort((a, b) =>
        a.status.state > b.status.state
          ? -1
          : b.status.state > a.status.state
          ? 1
          : 0
      );*/

      let online = [];
      let offline = [];

      usersWithStatus.forEach((user, i) => {
        if (user.status.state === "online") {
          online = [...online, user];
        } else {
          offline = [...offline, user];
        }
      });

      offline.length > 0 &&
        offline.sort((a, b) =>
          a.status.last_changed > b.status.last_changed
            ? -1
            : b.status.last_changed > a.status.last_changed
            ? 1
            : 0
        );

      const result = online.concat(offline);

      this.setState({ users: result });
    }
  };

  render() {
    const { auth, profile } = this.props;
    const { users, country_code, country } = this.state;

    // Redirect unauthorized users
    if (auth.uid === undefined) return <Redirect to="/login" />;

    if (users && this.props.onlineusers && !users[0].status) {
      this.mergeUserData(this.props.onlineusers);
    }

    return (
      <MDBContainer id="country" className="text-white pt-5 mt-5">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`${country} - SithCult`}</title>
          <link
            rel="canonical"
            href={"https://sithcult.com/c/" + country_code}
          />
        </Helmet>
        <MDBRow>
          <MDBCol md="4">
            <MDBCard className="text-center">
              <MDBCardBody>
                {country_code && (
                  <div className="text-center flag mb-3">
                    <ReactCountryFlag svg countryCode={country_code} />
                  </div>
                )}
                <p className="lead font-weight-bold mb-0">{country}</p>
                <p className="text-muted basic small">{country}</p>
                {users && (
                  <>
                    <p className="mb-2 title moff">
                      <MDBIcon icon="angle-up" /> Moff
                    </p>
                    {users && this.getMoff(users)}
                    <p className="mt-2 mb-2 title members">
                      <MDBIcon icon="users" /> Members
                    </p>
                    <p className="mb-2 small text-muted">
                      Membercount: {users && users.length}
                    </p>
                    <div className="card-columns memberlist">
                      {users &&
                        users.map((user, i) => {
                          return (
                            <MDBCard className="text-left" key={i}>
                              <div className="d-flex justify-content-between">
                                <div className="d-flex align-items-center">
                                  {this.getPicture(
                                    user.data.skin,
                                    user.id,
                                    i,
                                    user.data.sith_name
                                  )}
                                  <span className="pl-2">
                                    {user.data.title} {user.data.sith_name}
                                    {user.status &&
                                    user.status.state === "offline" ? (
                                      <span className="d-block small text-muted">
                                        Last seen{" "}
                                        {this.calculateTimeAgo(
                                          user.status.last_changed
                                        )}
                                      </span>
                                    ) : (
                                      <span className="d-block small text-success">
                                        Currently online
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <span className="small text-muted">
                                  {user.data.title.toLowerCase().trim() ===
                                    "darth" && (
                                    <MDBIcon
                                      icon="angle-double-up"
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
                              <span className="d-block small text-info my-1">
                                {user.data.department}
                              </span>
                              {user.data.donations && (
                                <div>
                                  <MDBBadge pill color="amber" className="mt-2">
                                    <MDBIcon icon="dollar-sign" /> Supporter
                                  </MDBBadge>
                                </div>
                              )}
                            </MDBCard>
                          );
                        })}
                    </div>
                  </>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="8">
            <MDBCard>
              <MDBCardBody>
                {profile && country_code && profile.isLoaded ? (
                  <>
                    {profile.address?.country.toLowerCase().trim() ===
                      country_code.toLowerCase().trim() ||
                    profile.title.toLowerCase().trim() === "darth" ? (
                      <>
                        {this.state.countryChat && (
                          <Chat
                            chatDetails={this.state.countryChat}
                            currentUser={auth.uid}
                            users={this.state.users}
                            hasJoined={
                              this.state.countryChat.users.includes(auth.uid)
                                ? true
                                : false
                            }
                          />
                        )}
                        {this.state.countryChat &&
                          !this.state.countryChat.users.includes(auth.uid) && (
                            <MDBBtn
                              color="red"
                              disabled
                              onClick={() => {
                                this.props.joinChat(
                                  auth.uid,
                                  this.state.countryChat.id,
                                  this.state.countryChat.users
                                );
                                this.init(this.props.match?.params?.country);
                              }}
                            >
                              Join chat
                            </MDBBtn>
                          )}
                      </>
                    ) : (
                      <>
                        <p className="lead">
                          You are not part of this district.
                        </p>
                        <Link
                          to={
                            "/c/" +
                            profile.address?.country?.toLowerCase().trim()
                          }
                        >
                          <MDBBtn color="red">
                            Go back to{" "}
                            {countryList().getLabel(
                              profile.address?.country.toLowerCase().trim()
                            )}
                          </MDBBtn>
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <MDBProgress material preloader className="placeholder" />
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    authErrorCode: state.auth.authErrorCode,
    authErrorDetails: state.auth.authErrorDetails,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    onlineusers: state.user.onlineusers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUsersPerCountry: (cc) => dispatch(getUsersPerCountry(cc)),
    getOnlineUsers: () => dispatch(getOnlineUsers()),
    getCountryChat: (countryid) => dispatch(getCountryChat(countryid)),
    createChat: (name, users) => dispatch(createChat(name, users)),
    joinChat: (uid, chid, curUsers) => dispatch(joinChat(uid, chid, curUsers)),
  };
};
//#endregion

//#region > Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CountryPage));
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
