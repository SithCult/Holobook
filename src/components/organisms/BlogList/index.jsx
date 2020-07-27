//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { withRouter, Link } from "react-router-dom";

//> Additional
// Date/Time formatting
import moment from "moment";

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

//> CSS
import "./bloglist.scss";
//#endregion

//#region > Data
const blogPosts = [
  {
    title: "Anima being studied in Austrian lab",
    tags: [],
    author: { name: "Alcolyte Theralun", uid: "deLaXAnEWpa6rFST1wps7acQSz32" },
    timestamp: 1594097874599,
    titleImage: "https://mdbootstrap.com/img/Photos/Slides/img%20(142).jpg",
    lead:
      "Lorem Ipsum better hope that there are no 'tapes' of our conversations before he starts leaking to the press! Trump Ipsum is calling for a total and complete shutdown of Muslim text entering your website. I will write some great placeholder text – and nobody writes better placeholder text than me, believe me – and I’ll write it very inexpensively. I will write some great, great text on your website’s Southern border, and I will make Google pay for that text. Mark my words.",
  },
  {
    title: "How to defeat the ideas of the Jedi on a day to day basis",
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
          <Link
            to={
              "/holonet/" +
              moment(post.timestamp).format("YYYY-MM-DD") +
              "-" +
              this.unifyString(post.title)
            }
          >
            <div key={i} className="blog-item">
              <div className="blog-img-container">
                <div
                  className="blog-img d-inline-block"
                  style={{ backgroundImage: `url("${post.titleImage}")` }}
                ></div>
              </div>

              <div className="d-inline-block blog-item-body">
                {post.tags &&
                  post.tags.map((tag, t) => (
                    <p className="font-weight-bold mb-1">
                      <MDBIcon icon={tag.icon} className="pr-2" />
                      {tag.name}
                    </p>
                  ))}
                <p className="h4-responsive font-weight-bold">
                  <strong>{post.title}</strong>
                </p>
                <p className="mb-1">{this.shortenString(post.lead, 24)}</p>
                <p className="text-muted small">
                  by <strong className="text-white">{post.author.name}</strong>,{" "}
                  {moment(post.timestamp).format("DD.MM.YYYY")}
                </p>
              </div>
            </div>
          </Link>
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
