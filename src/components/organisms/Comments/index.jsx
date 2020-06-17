//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional libraries
// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";

// Flags for countries
import ReactCountryFlag from "react-country-flag";

// Country name by country code
import { getName } from "country-list";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBSpinner,
  MDBBadge,
} from "mdbreact";

//> Redux Firebase
// Actions for comments
import {
  createComment,
  editComment,
  loadComments,
} from "../../../store/actions/commentActions";

// Connect
import { connect } from "react-redux";

// Comment element
import { Comment } from "../../molecules";
//#endregion

class Comments extends React.Component {
  state = {
    username: "",
    avatar: "",
    isUploading: false,
    progress: 0,
    avatarURL: "",
    basic: true,
  };

  render() {
    const { items } = this.props;

    return (
      <>
        {items &&
          items.length > 0 &&
          items.map((comment, i) => {
            console.log(comment);
            return (
              <>
                {!comment.data.cid && (
                  <Comment comment={comment.data} key={i} />
                )}
                {items.map((subcomm, subkey) => {
                  if (subcomm.data.cid === comment.id) {
                    console.log(subcomm.data.cid, comment.id);
                    return (
                      <Comment
                        comment={subcomm.data}
                        key={subkey}
                        subcomm
                      ></Comment>
                    );
                  }
                })}
              </>
            );
          })}
      </>
    );
  }
}

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
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(Comments);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
