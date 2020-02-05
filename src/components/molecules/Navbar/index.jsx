//> React
// Contains all the functionality necessary to define React components
import React from 'react';
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
    MDBContainer,
    MDBTooltip,
    MDBBtn,
    MDBIcon,
} from 'mdbreact';

//> Redux
// Connect
import { connect } from 'react-redux';
// Actions
import { signOut } from '../../../store/actions/authActions';

//> Images
// Logo
import IMGlogo from '../../../assets/images/logo_white_sm.png';


class Navbar extends React.Component{
  state = {
    collapseID: ""
  };

  toggleCollapse = (collapseID) => () =>
    this.setState((prevState) => ({
    collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));

  closeCollapse = (collapseID) => () => {
    window.scrollTo(0, 0);
    this.state.collapseID === collapseID && this.setState({ collapseID: "" });
  };

  render(){
    const overlay = (
    <div
      id="sidenav-overlay"
      style={{ backgroundColor: "transparent" }}
      onClick={this.toggleCollapse("mainNavbarCollapse")}
    />
    );

    const { collapseID } = this.state;

    const { auth, profile } = this.props;

    console.log(profile);

    return(
      <div>
        <MDBNavbar color="sithcult-dark" dark expand="md" fixed="top" scrolling>
          <MDBContainer>
            <MDBNavbarBrand href={!auth.uid ? "/" : "/me"} className="py-0 font-weight-bold">
              <img src={IMGlogo} height="50px" alt="SithCult Logo"/>
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
            {!auth.uid &&
              <Link to="/login">
                <MDBNavItem>
                  <MDBBtn 
                  color="yellow"
                  size="md"
                  outline
                  >
                  <MDBIcon icon="angle-right" className="pr-2" />
                  Already member? Log in
                  </MDBBtn>
                </MDBNavItem>
              </Link>
            }
            {auth.uid &&
              <>
                <div className="elegant-color py-2 px-3">
                  {profile.credits &&
                    <MDBTooltip
                      placement="bottom"
                      domElement
                      className="test"
                    >
                      <span>
                        <MDBIcon fab icon="sith" className="pr-2 orange-text" />
                        {profile.credits.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                      </span>
                    <span>
                    Imperial Credits
                    </span>
                    </MDBTooltip>
                  }
                  {profile.reputation &&
                    <MDBTooltip
                      placement="bottom"
                      domElement
                      className="test"
                    >
                      <span className="ml-3">
                        <MDBIcon icon="medal" className="pr-2 purple-text" />
                        {profile.reputation.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                      </span>
                    <span>
                    Reputation
                    </span>
                    </MDBTooltip>
                  }
                </div>
                <div className="mx-3" />
                <Link to="/">
                  <MDBBtn
                  size="md"
                  color="elegant"
                  onClick={this.props.signOut}
                  >
                  Logout
                  <MDBIcon icon="angle-right" className="ml-1"/>
                  </MDBBtn>
                </Link>
              </>
            }
            </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
      </MDBNavbar>
      {collapseID && overlay}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Navbar);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */
