//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Link } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBContainer,
  MDBTooltip,
  MDBBtn,
  MDBIcon,
  MDBBadge,
} from "mdbreact";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { signOut } from "../../../store/actions/authActions";
import { disablePresenceHandler } from "../../../store/actions/userActions";

//> Images
// Logo
import IMGlogo from "../../../assets/images/logo_white_sm.png";

//> Organisms
import { NotifBox } from "../../organisms";

//> CSS
import "./navbar.scss";
//#endregion

//#region > Components
class Navbar extends React.Component {
  state = {
    collapseID: "",
  };

  toggleCollapse = (collapseID) => () =>
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : "",
    }));

  closeCollapse = (collapseID) => () => {
    window.scrollTo(0, 0);
    this.state.collapseID === collapseID && this.setState({ collapseID: "" });
  };

  signOut = () => {
    const uid = this.props.auth.uid;

    this.props.disablePresenceHandler(uid);
    this.props.signOut();
  };

  render() {
    const overlay = (
      <div
        id="sidenav-overlay"
        style={{ backgroundColor: "transparent" }}
        onClick={this.toggleCollapse("mainNavbarCollapse")}
      />
    );

    const { collapseID } = this.state;
    const { auth, profile } = this.props;

    return (
      <div>
        <MDBNavbar color="sithcult-dark" dark expand="md" fixed="top" scrolling>
          <MDBContainer>
            <MDBNavbarBrand
              href={!auth.uid ? "/" : "/me"}
              className="py-0 font-weight-bold"
            >
              <img src={IMGlogo} height="50px" alt="SithCult Logo" />
            </MDBNavbarBrand>
            <MDBNavbarToggler
              onClick={this.toggleCollapse("mainNavbarCollapse")}
            />
            <MDBCollapse
              id="mainNavbarCollapse"
              isOpen={this.state.collapseID}
              navbar
            >
              <MDBNavbarNav right className="text-white flex-center">
                {!auth.uid && (
                  <>
                    <Link to="/holonet">
                      <MDBNavItem>
                        <MDBBtn color="blue" size="md">
                          <MDBIcon icon="globe" className="pr-2" />
                          Holonet
                        </MDBBtn>
                      </MDBNavItem>
                    </Link>
                    <Link to="/login">
                      <MDBNavItem>
                        <MDBBtn color="yellow" size="md">
                          <MDBIcon icon="angle-right" className="pr-2" />
                          Log in
                        </MDBBtn>
                      </MDBNavItem>
                    </Link>
                  </>
                )}
                {auth.uid && (
                  <>
                    <Link to="/chat">
                      <MDBBtn
                        className="mr-2 text-white"
                        color="elegant"
                        size="md"
                      >
                        <MDBIcon far icon="comments" className="pr-2" />
                        Chats
                        {this.props.notifications &&
                          this.props.notifications.length > 0 && (
                            <MDBBadge color="red" pill className="ml-1">
                              {this.props.notifications.length}
                            </MDBBadge>
                          )}
                      </MDBBtn>
                    </Link>
                    <Link to="/me">
                      <MDBBtn
                        className="mr-2 text-white"
                        color="elegant"
                        size="md"
                      >
                        <MDBIcon far icon="user" className="pr-2" />
                        Profile
                      </MDBBtn>
                    </Link>
                    <div className="perks py-2 px-3">
                      {profile.credits && (
                        <MDBTooltip
                          placement="bottom"
                          domElement
                          className="test"
                        >
                          <span>
                            <MDBIcon
                              fab
                              icon="sith"
                              className="pr-2 orange-text"
                            />
                            {profile.credits
                              .toString()
                              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                          </span>
                          <span>Imperial Credits</span>
                        </MDBTooltip>
                      )}
                      {profile.reputation && (
                        <MDBTooltip
                          placement="bottom"
                          domElement
                          className="test"
                        >
                          <span className="ml-3">
                            <MDBIcon
                              icon="medal"
                              className="pr-2 purple-text"
                            />
                            {profile.reputation
                              .toString()
                              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                          </span>
                          <span>Reputation</span>
                        </MDBTooltip>
                      )}
                    </div>
                    <div className="mx-2" />
                    <MDBNavItem>
                      <MDBDropdown>
                        <MDBDropdownToggle nav>
                          <div className="d-none d-md-inline notify-bell">
                            <MDBIcon icon="bell" />
                            {this.props.notifications &&
                              this.props.notifications.length > 0 && (
                                <span className="counter">
                                  {this.props.notifications.length}
                                </span>
                              )}
                          </div>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-default">
                          <NotifBox notifications={this.props.notifications} />
                        </MDBDropdownMenu>
                      </MDBDropdown>
                    </MDBNavItem>
                    <div className="mx-2" />
                    <Link to="/">
                      <MDBBtn size="md" color="elegant" onClick={this.signOut}>
                        Logout
                        <MDBIcon icon="angle-right" className="ml-1" />
                      </MDBBtn>
                    </Link>
                  </>
                )}
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
        {collapseID && overlay}
      </div>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
    disablePresenceHandler: (uid) => dispatch(disablePresenceHandler(uid)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
