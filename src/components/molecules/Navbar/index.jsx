//> React
// Contains all the functionality necessary to define React components
import React from 'react';

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
          <MDBContainer fluid={auth.uid}>
            <MDBNavbarBrand href={!auth.uid ? "/" : "/holobook"} className="py-0 font-weight-bold">
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
            <MDBNavbarNav right className="text-white">
            {!auth.uid &&
              <MDBNavItem>
                <MDBBtn 
                color="modern"
                >
                <MDBIcon icon="key" className="pr-2" />
                Already member? Log in
                </MDBBtn>
              </MDBNavItem>
            }
            {auth.uid &&
              <>
                {profile.credits &&
                  <span>
                    <MDBIcon fab icon="sith" className="pr-2 orange-text" />
                    {profile.credits.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                  </span>
                }
                {profile.reputation &&
                  <span className="ml-3">
                    <MDBIcon icon="medal" className="pr-2 purple-text" />
                    {profile.reputation.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}
                  </span>
                }
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
