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

//> Additional Components
import { OnlineUsers, BlogEditor } from "../../molecules";
import { BlogList } from "../../organisms";

//> Additional modules
// Country list
import countryList from "react-select-country-list";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import holocronIcon from "../../../assets/images/icons/holocron.png";
import darkUserIMG from "../../../assets/images/dark.gif";

//> SCSS
import "./blogviewpage.scss";
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
    content:
      "I know words. I have the best words. Some people have an ability to write placeholder text... It's an art you're basically born with. You either have it or you don't. Does everybody know that pig named Lorem Ipsum? She's a disgusting pig, right? I know words. I have the best words. I think the only difference between me and the other placeholder text is that I’m more honest and my words are more beautiful. Lorem Ipsum better hope that there are no 'tapes' of our conversations before he starts leaking to the press! Trump Ipsum is calling for a total and complete shutdown of Muslim text entering your website. I will write some great placeholder text – and nobody writes better placeholder text than me, believe me – and I’ll write it very inexpensively. I will write some great, great text on your website’s Southern border, and I will make Google pay for that text. Mark my words.",
  },
  {
    title: "Hello there2",
    author: { name: "Alcolyte Theralun", uid: "deLaXAnEWpa6rFST1wps7acQSz32" },
    timestamp: 1594197875599,
    lead:
      "Does everybody know that pig named Lorem Ipsum? She's a disgusting pig, right? I know words. I have the best words. I think the only difference between me and the other placeholder text is that I’m more honest and my words are more beautiful.",
    content:
      "I know words. I have the best words. Some people have an ability to write placeholder text... It's an art you're basically born with. You either have it or you don't. Does everybody know that pig named Lorem Ipsum? She's a disgusting pig, right? I know words. I have the best words. I think the only difference between me and the other placeholder text is that I’m more honest and my words are more beautiful. Lorem Ipsum better hope that there are no 'tapes' of our conversations before he starts leaking to the press! Trump Ipsum is calling for a total and complete shutdown of Muslim text entering your website. I will write some great placeholder text – and nobody writes better placeholder text than me, believe me – and I’ll write it very inexpensively. I will write some great, great text on your website’s Southern border, and I will make Google pay for that text. Mark my words.",
  },
  {
    title: "Hello there3",
    author: { name: "Alcolyte Theralun", uid: "deLaXAnEWpa6rFST1wps7acQSz32" },
    timestamp: 1594297876599,
    titleImage: "https://mdbootstrap.com/img/Photos/Slides/img%20(142).jpg",
    lead:
      "I know words. I have the best words. Some people have an ability to write placeholder text... It's an art you're basically born with. You either have it or you don't.",
    content:
      "I know words. I have the best words. Some people have an ability to write placeholder text... It's an art you're basically born with. You either have it or you don't. Does everybody know that pig named Lorem Ipsum? She's a disgusting pig, right? I know words. I have the best words. I think the only difference between me and the other placeholder text is that I’m more honest and my words are more beautiful. Lorem Ipsum better hope that there are no 'tapes' of our conversations before he starts leaking to the press! Trump Ipsum is calling for a total and complete shutdown of Muslim text entering your website. I will write some great placeholder text – and nobody writes better placeholder text than me, believe me – and I’ll write it very inexpensively. I will write some great, great text on your website’s Southern border, and I will make Google pay for that text. Mark my words.",
  },
];
//#endregion

//#region > Components
class BlogViewPage extends React.Component {
  state = {};

  componentDidMount() {
    const post = this.props.match.params.post;

    const postdetails = post.split("-");

    const date = [postdetails[0], postdetails[1], postdetails[2]].join("-");

    let titleArr = [];

    for (let index = 3; index < postdetails.length; index++) {
      titleArr = [...titleArr, postdetails[index]];
    }

    const title = titleArr.join("-");

    console.log(
      blogPosts.filter(
        (bp) =>
          this.formatDate(bp.timestamp) === date &&
          this.unifyString(bp.title) === title
      )[0]
    );

    this.setState({
      post: blogPosts.filter(
        (bp) =>
          this.formatDate(bp.timestamp) === date &&
          this.unifyString(bp.title) === title
      )[0],
    });
  }

  getCountry = (address) => {
    let country = address ? countryList().getLabel(address.country) : null;

    return country;
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

  unifyString = (string) => {
    return string.trim().toLowerCase().replace(new RegExp(" ", "g"), "-");
  };

  render() {
    const { profile } = this.props;

    if (this.state.post) {
      return (
        <>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{"SithCult - Holonet"}</title>
            <link
              rel="canonical"
              href={`https://sithcult.com/holonet/ ${this.props.match.params.post}`}
            />
          </Helmet>
          <MDBContainer id="blogview">
            <MDBRow>
              <MDBCol md="10">
                <MDBCard reverse>
                  <MDBView hover cascade waves>
                    <img
                      src={this.state.post.titleImage}
                      alt=""
                      className="img-fluid"
                    />
                    <MDBMask overlay="white-slight" className="waves-light" />
                  </MDBView>
                  <MDBCardBody cascade className="text-center">
                    <h2 className="font-weight-bold">
                      {this.state.post.title}
                    </h2>
                    <p>
                      Written by
                      <strong> {this.state.post.author.name} </strong>,{" "}
                      {this.formatDate(this.state.post.timestamp)}
                    </p>
                    {this.state.post.tags &&
                      this.state.post.tags.map((tag, t) => (
                        <a href="#!" key={t} className={tag.color}>
                          <h6 className="font-weight-bold mb-3">
                            <MDBIcon icon={tag.icon} className="pr-2" />
                            {tag.name}
                          </h6>
                        </a>
                      ))}
                  </MDBCardBody>
                </MDBCard>
                <MDBContainer className="mt-5 white-text">
                  <h3>{this.state.post.lead}</h3>
                  {this.state.post.content}
                </MDBContainer>
              </MDBCol>
              <MDBCol md="2">
                <MDBCard className="award text-center">
                  <MDBCardBody>
                    <p className="lead mb-1">Get rewards</p>
                    <p className="small text-muted mb-1">
                      Contribute to SithCult and achieve greatness.
                    </p>
                    <Link to="/contribute">
                      <MDBBtn color="blue" size="md">
                        <MDBIcon icon="hand-holding-usd" className="mr-2" />
                        Contribute to SithCult
                      </MDBBtn>
                    </Link>
                  </MDBCardBody>
                </MDBCard>
                <MDBCard className="text-center mt-3">
                  <MDBCardBody>
                    <p className="lead mb-1">Your district</p>
                    <p className="small text-muted mb-1">
                      Get details about SithCult in your country.
                    </p>
                    {profile.isLoaded ? (
                      <Link
                        to={
                          "/c/" + profile.address?.country?.toLowerCase().trim()
                        }
                      >
                        <MDBBtn color="red" size="md">
                          <MDBIcon far icon="flag" className="mr-2" />
                          {profile.isLoaded ? (
                            <>{this.getCountry(profile.address)}</>
                          ) : (
                            <>
                              <span>Loading</span>
                            </>
                          )}
                        </MDBBtn>
                      </Link>
                    ) : (
                      <MDBBtn color="red" size="md" disabled={true}>
                        <MDBIcon far icon="flag" className="mr-2" />
                        <span>Loading</span>
                      </MDBBtn>
                    )}
                  </MDBCardBody>
                </MDBCard>
                <MDBCard className="mt-3">
                  <MDBCardBody>
                    <OnlineUsers />
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </>
      );
    } else {
      return <MDBSpinner></MDBSpinner>;
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
export default connect(mapStateToProps, mapDispatchToProps)(BlogViewPage);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
