//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBIcon, MDBNavLink } from "mdbreact";
//#endregion

//#region > Functions
const NavLink = ({ to, title }) => {
  return (
    <MDBNavLink className="list-group-item list-group-item-action" to={to}>
      <h5
        style={{ margin: "0" }}
        className="justify-content-between d-flex align-items-center"
      >
        {title}
        <MDBIcon icon="angle-right" />
      </h5>
    </MDBNavLink>
  );
};
//#endregion

//#region > Exports
export default NavLink;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
