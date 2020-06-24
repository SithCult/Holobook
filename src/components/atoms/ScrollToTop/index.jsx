//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { withRouter } from "react-router-dom";
//#endregion

//#region > Components
class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}
//#endregion

//#region > Exports
export default withRouter(ScrollToTop);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
