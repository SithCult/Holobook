//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Link, Redirect } from "react-router-dom";
// Meta tags
import { Helmet } from "react-helmet";
//> Redux
// Connect
import { connect } from "react-redux";
// Blog actions
import { loadBlogPosts } from "../../../store/actions/blogActions";
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
  MDBBadge,
  MDBInput,
  MDBIcon,
  MDBView,
  MDBMask,
  MDBTooltip,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBSpinner,
} from "mdbreact";
// Country list
import countryList from "react-select-country-list";

//> Images
import logoImg from "../../../assets/images/logo_white.png";
//> SCSS
import "./blogviewpage.scss";
//#endregion

//#region > Components
class BlogViewPage extends React.Component {
  state = {};

  componentDidMount() {
    this.props.loadBlogPosts(-1);
  }

  componentDidUpdate = (prevProps) => {
    if (
      (!prevProps.blogPosts && this.props.blogPosts) ||
      prevProps.blogPosts != this.props.blogPosts
    ) {
      const post = this.props.match.params.post;
      const postdetails = post.split("-");
      const date = [postdetails[0], postdetails[1], postdetails[2]].join("-");

      let titleArr = [];

      for (let index = 3; index < postdetails.length; index++) {
        titleArr = [...titleArr, postdetails[index]];
      }

      const title = titleArr.join("-");

      this.setState({
        post: this.props.blogPosts.filter(
          (bp) =>
            this.formatDate(bp.data.timestamp) === date &&
            this.unifyString(bp.data.title) === title
        )[0]?.data,
      });
    }
  };

  getCountry = (address) => {
    let country = address ? countryList().getLabel(address.country) : null;

    return country;
  };

  formatDate(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  unifyString = (string) => {
    return string.trim().toLowerCase().replace(new RegExp(" ", "g"), "-");
  };

  render() {
    if (this.state.post) {
      return (
        <>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{this.state.post.title} - SithCult</title>
            <link
              rel="canonical"
              href={`https://sithcult.com/holonet/${this.props.match.params.post}`}
            />
          </Helmet>
          <MDBContainer id="blogview">
            <MDBBtn
              color="blue"
              onClick={() => this.props.history.push("/holonet")}
              className="d-inline-block d-sm-none mb-3 mx-auto w-100"
            >
              <MDBIcon icon="angle-left" className="mr-1" />
              Back
            </MDBBtn>
            <MDBRow>
              <MDBCol lg="12">
                <MDBCard reverse>
                  <MDBView>
                    <div
                      className="top-image w-100"
                      style={{
                        height: "300px",
                        backgroundImage: `url("${this.state.post.image}")`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                      }}
                    />
                    <MDBMask>
                      <img src={logoImg} alt="" className="logo" />
                      <MDBBtn
                        color="blue"
                        onClick={() => this.props.history.push("/holonet")}
                        className="d-sm-inline-block d-none"
                      >
                        <MDBIcon icon="angle-left" className="mr-1" />
                        Back
                      </MDBBtn>
                    </MDBMask>
                  </MDBView>
                  <MDBCardBody cascade className="text-center">
                    <h2 className="font-weight-bold">
                      {this.state.post.title}
                    </h2>
                    <p>{this.state.post.lead}</p>
                    <p className="small text-muted">
                      Written by <strong>{this.state.post.author.name}</strong>,{" "}
                      {this.formatDate(this.state.post.timestamp)}
                    </p>
                  </MDBCardBody>
                </MDBCard>
                <MDBContainer className="mt-5 white-text">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.state.post.content,
                    }}
                  ></div>
                  <hr />
                  <p className="small mb-1 d-inline-block mr-2 mb-0">Tags</p>
                  {this.state.post.tags &&
                    this.state.post.tags.map((tag, t) => (
                      <MDBBadge
                        pill
                        color="default"
                        key={t}
                        className="mr-1 ml-1 d-inline-block"
                      >
                        {tag}
                      </MDBBadge>
                    ))}
                </MDBContainer>
              </MDBCol>
            </MDBRow>
            <MDBBtn
              color="blue"
              onClick={() => this.props.history.push("/holonet")}
              className="d-inline-block d-sm-none mt-3 mx-auto w-100"
            >
              <MDBIcon icon="angle-left" className="mr-1" />
              Back
            </MDBBtn>
          </MDBContainer>
        </>
      );
    } else {
      return (
        <div className="text-center">
          <MDBSpinner />
        </div>
      );
    }
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    blogPosts: state.blog.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { loadBlogPosts: (amount) => dispatch(loadBlogPosts(amount)) };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(BlogViewPage);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
