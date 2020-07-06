//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBInput, MDBIcon } from "mdbreact";

//> Redux Firebase
// Actions for comments
import { lel } from "../../../store/actions/chatActions";

// Connect
import { connect } from "react-redux";

//> Components

//> CSS
import "./comments.scss";
//#endregion

//#region > Components
class Comments extends React.Component {
  state = {
    comment: "",
  };

  render() {
    return <div className="chatbox"></div>;
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    comments: state.comment.comments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadComments: () => dispatch(loadComments()),
    createComment: (comment) => dispatch(createComment(comment)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
