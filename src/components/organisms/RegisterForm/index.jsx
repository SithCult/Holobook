//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBBtn,
} from 'mdbreact';

//> Images
import IMGgroup from '../../../assets/images/group.png';
import IMGlogo from '../../../assets/images/logo_white.png';

class HomePage extends React.Component {
  render() {
    return (
      <MDBContainer className="text-center text-white">
        <div className="mb-4">
          <img className="img-fluid" src={IMGlogo} alt="SithCult logo"/>
        </div>
        <MDBBtn 
        color="modern"
        >
        Already member? Log in
        </MDBBtn>
        <p className="lead mt-4">
        Become part of the world's largest Sith-Imperial organization.
        </p>
        <div>
          <img className="img-fluid" src={IMGgroup} alt="SithCult logo"/>
        </div>
      </MDBContainer>
    );
  }
}

export default HomePage;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
