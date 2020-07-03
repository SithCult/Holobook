//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Meta tags
import { Helmet } from "react-helmet";

//> Components
// Organisms
import { RegisterForm } from "../../organisms";
//#endregion

//#region > Components
class HomePage extends React.Component {
  render() {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>SithCult - The Real Sith Empire</title>
          <link rel="canonical" href="https://sithcult.com/" />
        </Helmet>
        <RegisterForm />
      </>
    );
  }
}
//#endregion

//#region > Exports
export default HomePage;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
