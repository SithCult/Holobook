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
// Actions for blog posts
import { loadBlogPosts } from "../../../store/actions/blogActions";
// Connect
import { connect } from "react-redux";

//> CSS
import "./bloglist.scss";
//#endregion

//#region > Components
class BlogList extends React.Component {
  state = { amount: 5 };

  componentDidMount = () => {
    this.props.loadBlogPosts(this.state.amount);
  };

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
    const { auth, posts } = this.props;

    console.log(posts);

    if (posts && auth) {
      let result = posts.map((post, i) => {
        return (
          <Link
            to={
              "/holonet/" +
              moment(post.data.timestamp).format("YYYY-MM-DD") +
              "-" +
              this.unifyString(post.data.title)
            }
            key={i}
          >
            <div key={i} className="blog-item">
              <div className="blog-img-container">
                <div
                  className="blog-img d-inline-block"
                  style={{ backgroundImage: `url("${post.data.titleImage}")` }}
                ></div>
              </div>

              <div className="d-inline-block blog-item-body">
                {post.data.tags &&
                  post.data.tags.map((tag, t) => (
                    <MDBBadge
                      pill
                      color="default"
                      key={t}
                      className="mr-1 ml-1"
                    >
                      {tag}
                    </MDBBadge>
                  ))}
                <p className="h4-responsive font-weight-bold">
                  <strong>{post.data.title}</strong>
                </p>
                <p className="mb-1">{this.shortenString(post.data.lead, 24)}</p>
                <p className="text-muted small">
                  by{" "}
                  <strong className="text-white">
                    {post.data.author.name}
                  </strong>
                  , {moment(post.data.timestamp).format("DD.MM.YYYY")}
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
    posts: state.blog.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { loadBlogPosts: (amount) => dispatch(loadBlogPosts(amount)) };
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
