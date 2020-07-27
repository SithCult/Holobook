//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { withRouter, Link } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardUp,
  MDBAvatar,
  MDBAlert,
  MDBBtn,
  MDBView,
  MDBMask,
  MDBBadge,
  MDBInput,
  MDBIcon,
  MDBTooltip,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";

//> Redux Firebase
// Actions for posts
import { removePost } from "../../../store/actions/postActions";
// Connect
import { connect } from "react-redux";
//#endregion

//#region > Data
const blogPosts = [
  {
    title: "Hello there",
    tags: [],
    author: { name: "Alcolyte Theralun", uid: "deLaXAnEWpa6rFST1wps7acQSz32" },
    timestamp: 1594097874599,
    titleImage: "https://mdbootstrap.com/img/Photos/Slides/img%20(142).jpg",
    lead:
      "Lorem Ipsum better hope that there are no 'tapes' of our conversations before he starts leaking to the press! Trump Ipsum is calling for a total and complete shutdown of Muslim text entering your website. I will write some great placeholder text – and nobody writes better placeholder text than me, believe me – and I’ll write it very inexpensively. I will write some great, great text on your website’s Southern border, and I will make Google pay for that text. Mark my words.",
  },
  {
    title: "Hello there2",
    author: { name: "Alcolyte Theralun", uid: "deLaXAnEWpa6rFST1wps7acQSz32" },
    timestamp: 1594197875599,
    lead:
      "Does everybody know that pig named Lorem Ipsum? She's a disgusting pig, right? I know words. I have the best words. I think the only difference between me and the other placeholder text is that I’m more honest and my words are more beautiful.",
  },
  {
    title: "Hello there3",
    author: { name: "Alcolyte Theralun", uid: "deLaXAnEWpa6rFST1wps7acQSz32" },
    timestamp: 1594297876599,
    titleImage: "https://mdbootstrap.com/img/Photos/Slides/img%20(142).jpg",
    lead:
      "I know words. I have the best words. Some people have an ability to write placeholder text... It's an art you're basically born with. You either have it or you don't.",
  },
];
//#endregion

//#region > Components
class BlogList extends React.Component {
  // This function removes all spaces and unifies the strings.
  unifyString = (string) => {
    return string.trim().toLowerCase().replace(new RegExp(" ", "g"), "-");
  };

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  shortenString = (string, length) => {
    if (string.split(" ").length > length) {
      return string.split(" ").splice(0, length).join(" ") + "...";
    } else {
      return string;
    }
  };

  render() {
    const { auth } = this.props;

    if (blogPosts && auth) {
      let result = blogPosts.map((post, i) => {
        return (
          <MDBRow key={i}>
            <MDBCol lg="5">
              <MDBView className="rounded z-depth-2 mb-lg-0 mb-4" hover waves>
                <img className="img-fluid" src={post.titleImage} alt="" />
                <a href="#!">
                  <MDBMask overlay="white-slight" />
                </a>
              </MDBView>
            </MDBCol>
            <MDBCol lg="7">
              {post.tags &&
                post.tags.map((tag, t) => (
                  <a href="#!" key={t} className={tag.color}>
                    <h6 className="font-weight-bold mb-3">
                      <MDBIcon icon={tag.icon} className="pr-2" />
                      {tag.name}
                    </h6>
                  </a>
                ))}
              <h3 className="font-weight-bold mb-3 p-0">
                <strong>{post.title}</strong>
              </h3>
              <p>{this.shortenString(post.lead, 24)}</p>
              <p>
                by
                <a href="#!">
                  <strong> {post.author.name}</strong>
                </a>
                , {this.formatDate(post.timestamp)}
              </p>
              <MDBBtn
                color="amber"
                size="md"
                className="waves-light "
                onClick={() =>
                  this.props.history.push(
                    "/holonet/" +
                      this.formatDate(post.timestamp) +
                      "-" +
                      this.unifyString(post.title)
                  )
                }
              >
                Read more
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        );
      });

      return result;
    } else {
      return false;
    }
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
  return {};
};
//#endregion

//#region > Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BlogList));
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
