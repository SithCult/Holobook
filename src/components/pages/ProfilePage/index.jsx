//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Link, Redirect } from "react-router-dom";

//> Additional modules
// Fade In Animation
import FadeIn from "react-fade-in";
// Country list
import countryList from "react-select-country-list";
// Fetching
import axios from "axios";
// Firebase
import firebase from "firebase";
// Uploading images
import FileUploader from "react-firebase-file-uploader";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { signOut } from "../../../store/actions/authActions";
import {
  createPost,
  removePost,
  editPost,
  loadPosts,
  loadAllPosts,
  reportPost,
} from "../../../store/actions/postActions";
import { loadComments } from "../../../store/actions/commentActions";

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
  MDBTooltip,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBProgress,
} from "mdbreact";

//> Components
import { Posts } from "../../organisms";

//> CSS
// Profile page
import "./profilepage.scss";
// Post
import "../../organisms/Posts/posts.scss";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import holocronIcon from "../../../assets/images/icons/holocron.png";
import darkUserIMG from "../../../assets/images/dark.gif";
//#endregion

//#region > Data
//> Data
// Feelings
const feelings = [
  { name: "great", icon: "smile-beam" },
  { name: "angry", icon: "angry" },
  { name: "silly", icon: "grin-tongue" },
  { name: "joyful", icon: "laugh" },
  { name: "loved", icon: "grin-hearts" },
  { name: "sad", icon: "sad-cry" },
  { name: "annoyed", icon: "tired" },
  { name: "hurt", icon: "frown" },
  { name: "funny", icon: "laugh-beam" },
  { name: "dead", icon: "dizzy" },
  { name: "flushed", icon: "flushed" },
];
//#endregion

//#region > Components
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    post_charlength: 0,
    post: "",
    post_basic: false,
    post_visibility: true,
    post_languages: [],
    post_languageApproved: true,
    post_feeling: {
      name: "Feeling",
      icon: "meh-blank",
    },
    postsVisible: 5,
    disablePostAsSithCult: true,
    warningBeta: false,
    showDeletedPosts: false,
    youtubeActive: false,
    youtubeLink: "",
  };

  componentDidMount = () => {
    let basic = localStorage.getItem("language_basic");
    let visibility = localStorage.getItem("post_visibility");
    if (basic) {
      this.setState({
        post_basic: basic === "true" ? true : false,
      });
    }
    if (visibility) {
      this.setState({
        post_visibility: visibility === "true" ? true : false,
      });
    }

    // Load posts
    this.refreshData();

    // Fetch new posts and comments every 60 seconds
    this.interval = setInterval(() => this.refreshData(), 60000);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  refreshData = () => {
    // Loads all comments
    this.props.loadComments();

    // Loads n posts, but 5 at minimum
    this.props.loadPosts(
      this.props?.posts?.length ? this.props.posts.length : 5
    );
  };

  loadMore = () => {
    // Prevent multiple loadings
    let posts = this.props.posts;

    // Check if posts have already loaded
    if (posts) {
      if (posts.length === this.state.postsVisible) {
        this.setState(
          {
            postsVisible: this.state.postsVisible + 5,
          },
          () => this.loadPosts(this.state.postsVisible)
        );
      }
    }
  };

  // Feeling handler
  handleFeeling = (event, feeling) => {
    this.setState({
      post_feeling: feeling,
    });
  };

  // Remove feeling
  removeFeeling = (event) => {
    this.setState({
      post_feeling: {
        name: "Feeling",
        icon: "meh-blank",
      },
    });
  };

  resetPostForm = () => {
    this.setState(
      {
        post_charlength: 0,
        post: "",
        post_languages: [],
        post_languageApproved: true,
        postImageURL: undefined,
        postImage: undefined,
        youtubeLink: undefined,
        youtubeLinkError: undefined,
        youtubeId: undefined,
        youtubeActive: false,
      },
      () => this.removeFeeling()
    );
  };

  changeTextareaHandler = (event) => {
    event.target.style.overflow = "hidden";
    event.target.style.height = 0;
    event.target.style.height = event.target.scrollHeight + "px";

    // Check language
    let wordcount = event.target.value.split(" ").length;

    this.detectLanguage(event.target.value, wordcount);

    if (event.target.value.length <= 500) {
      this.setState({
        post: event.target.value,
      });
    }
  };

  getCountry = (address) => {
    let country = address ? countryList().getLabel(address.country) : null;

    return country;
  };

  renderBadge = (badge, key) => {
    switch (badge.toLowerCase()) {
      case "founder":
        return (
          <MDBBadge pill color="elegant-color" key={key}>
            <MDBIcon icon="award" className="pr-2" />
            Founder
          </MDBBadge>
        );
      case "council":
        return (
          <MDBBadge pill color="red" key={key}>
            <MDBIcon icon="fire" className="pr-2" />
            Council
          </MDBBadge>
        );
      case "hand":
        return (
          <MDBBadge pill color="secondary" key={key}>
            <MDBIcon fab icon="sith" className="pr-2" />
            Hand of the Emperor
          </MDBBadge>
        );
      case "historic":
        return (
          <MDBBadge pill color="orange" key={key}>
            <MDBIcon icon="book" className="pr-2" />
            Historic
          </MDBBadge>
        );
      case "moff":
        return (
          <MDBBadge pill color="info" key={key}>
            <MDBIcon icon="angle-up" className="pr-2" />
            Moff
          </MDBBadge>
        );
      case "phase1":
        return (
          <MDBBadge pill color="amber" key={key}>
            <MDBIcon icon="dollar-sign" className="pr-2" />
            Phase 1 Contributor
          </MDBBadge>
        );
      default:
        break;
    }
  };

  getBadges = (badges) => {
    let result = "";

    if (badges) {
      result = badges.map((badge, key) => {
        return this.renderBadge(badge, key);
      });
    }

    if (result === "") {
      return null;
    } else {
      return result;
    }
  };

  createPost = () => {
    let content = this.state.post;
    let characters = content.length;
    let author = {
      uid: this.props.auth.uid,
      name: this.props.profile.title + " " + this.props.profile.sith_name,
      department: this.props.profile.department,
    };
    let skin = this.props.profile.skin;
    let timestamp = Date.now();
    let target = this.state.post_visibility;
    let wordcount = content.split(" ").length;
    let language =
      this.state.post_languages.length > 0 ? this.state.post_languages : null;
    let feeling =
      this.state.post_feeling.name.toLowerCase() === "feeling"
        ? null
        : this.state.post_feeling;
    let basic = this.state.post_basic;
    let youtubeId = this.state.youtubeId ? this.state.youtubeId : null;

    // Check if the content is English for a
    if (target) {
      if (language) {
        if (language[0][0] !== "english") {
          console.log("do not post - not english");
        }
      }
    }

    if (language && author) {
      // Normalize data
      let data = {
        content: content.replace(/\r\n|\r|\n/g, "</br>"),
        details: {
          characters,
          words: wordcount,
          avgWordLength: parseInt(characters) / parseInt(wordcount),
          feeling,
        },
        author,
        timestamp,
        target,
        skin: skin ? skin : "standard",
        language: {
          0: language[0][0],
          1: language[1][0],
          2: language[2][0],
        },
        basic: basic,
        youtubeId,
      };

      // Tell Firebase to create post
      this.setState(
        {
          postError: false,
        },
        () => {
          this.resetPostForm();
          this.props.createPost(data);
          this.loadPosts(this.state.postsVisible);
        }
      );
    } else {
      this.setState(
        {
          postError: "Please make sure to write at least 5 words.",
        },
        () => console.log("do not post - not enough chars or no author")
      );
    }
  };

  detectLanguage = (text, words) => {
    if (words >= 5) {
      const LanguageDetect = require("languagedetect");
      const lngDetector = new LanguageDetect();

      let results = lngDetector.detect(text.trim(), 3);
      this.setState(
        {
          post_languages: results,
        },
        () => this.getLanguageApproved()
      );
    } else {
      return false;
    }
  };

  getLanguageApproved = () => {
    if (this.state.post_visibility) {
      if (this.state.post_languages.length > 0) {
        if (this.state.post_languages[0][0] === "english") {
          if (!this.state.post_languageApproved) {
            this.setState({
              post_languageApproved: true,
            });
          }
        } else {
          if (this.state.post_languageApproved) {
            this.setState({
              post_languageApproved: false,
            });
          }
        }
      } else {
        if (!this.state.post_languageApproved) {
          this.setState({
            post_languageApproved: true,
          });
        }
      }
    }
  };

  loadPosts = (amount) => {
    if (localStorage.getItem("postOptions") === "showAll") {
      // Check if the user is authed to be shown all posts
      if (Array.isArray(this.props.profile.badges)) {
        // Check if the user is admin
        if (this.props.profile.badges.includes("Admin")) {
          // Load all posts (also invisible)
          this.setState(
            {
              showDeletedPosts: true,
            },
            () => this.props.loadAllPosts(amount)
          );
        } else {
          this.props.loadPosts(amount);
        }
      } else {
        this.props.loadPosts(amount);
      }
    } else {
      // Load posts normally
      this.setState(
        {
          showDeletedPosts: false,
        },
        () => this.props.loadPosts(amount)
      );
    }
  };

  handlePostVisibilityChange = (e) => {
    if (e.target.checked) {
      this.setState(
        {
          showDeletedPosts: true,
        },
        () => {
          localStorage.setItem("postOptions", "showAll");
          this.loadPosts(this.props.posts.length);
        }
      );
    } else {
      this.setState(
        {
          showDeletedPosts: false,
        },
        () => {
          localStorage.setItem("postOptions", "showNormal");
          this.loadPosts(this.props.posts.length);
        }
      );
    }
  };

  getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  onChangeYouTubeHandler = (e) => {
    const url = e.target.value;

    if (url.includes("youtube.com")) {
      const videoId = this.getYouTubeVideoId(url);

      if (videoId) {
        this.setState({
          youtubeLink: url,
          youtubeId: videoId,
          youtubeLinkError: false,
        });
      } else {
        this.setState({
          youtubeLink: url,
          youtubeId: false,
          youtubeLinkError: true,
        });
      }
    } else {
      this.setState({
        youtubeLink: url,
        youtubeId: false,
        youtubeLinkError: true,
      });
    }
  };

  render() {
    const { auth, profile, comments } = this.props;

    if (auth.uid === undefined) return <Redirect to="/login" />;

    if (profile.badges) {
      if (!this.state.postsInitialLoad) {
        this.setState(
          {
            postsInitialLoad: true,
          },
          () => this.loadPosts(this.state.postsVisible)
        );
      }
    }

    return (
      <MDBContainer id="profile" className="pt-5 mt-5">
        <MDBRow>
          <MDBCol md="3">
            <MDBCard testimonial>
              <MDBCardUp className="red" />
              {(() => {
                switch (profile.skin) {
                  case "gold":
                    return (
                      <MDBAvatar className="mx-auto white">
                        <img
                          src={goldUserIMG}
                          alt="Gold user profile picture"
                        />
                      </MDBAvatar>
                    );
                  case "light":
                    return (
                      <MDBAvatar className="mx-auto white">
                        <img
                          src={lightUserIMG}
                          alt="Light user profile picture"
                        />
                      </MDBAvatar>
                    );
                  case "bronze":
                    return (
                      <MDBAvatar className="mx-auto white">
                        <img
                          src={bronzeUserIMG}
                          alt="Bronze user profile picture"
                        />
                      </MDBAvatar>
                    );
                  case "dark":
                    return (
                      <MDBAvatar className="mx-auto white">
                        <img
                          src={darkUserIMG}
                          alt="Bronze user profile picture"
                        />
                      </MDBAvatar>
                    );
                  default:
                    return (
                      <MDBAvatar className="mx-auto white">
                        <img
                          src={defaultUserIMG}
                          alt="Default user profile picture"
                        />
                      </MDBAvatar>
                    );
                }
              })()}
              <MDBCardBody>
                <p className="lead font-weight-bold mb-0">
                  {profile.title} {profile.sith_name}
                </p>
                <p className="small text-info mb-0">{profile.department}</p>
                <p className="text-muted">{this.getCountry(profile.address)}</p>
                <div className="badge-row">
                  {this.getBadges(profile.badges)}
                </div>
                <p className="mt-3">
                  <small>{profile.status}</small>
                </p>
              </MDBCardBody>
            </MDBCard>
            <MDBCard className="mt-3 text-center">
              <MDBCardBody>
                <div className="mt-1 features">
                  <p className="lead mb-1">
                    <img
                      src={holocronIcon}
                      alt="Holocron icon"
                      className="mr-2"
                    />
                    My Holocrons
                    <img
                      src={holocronIcon}
                      alt="Holocron icon"
                      className="ml-2"
                    />
                  </p>
                  <p className="small text-muted mb-2">
                    Your holocrons contain valuable lessons and interactions
                    that can strengthen your connection to the force and
                    yourself.
                  </p>
                  <Link to="/basic">
                    <MDBBtn color="elegant" size="md">
                      <MDBIcon icon="book" className="mr-2" />
                      Imperial Basic Trainer
                    </MDBBtn>
                  </Link>
                  <MDBBtn color="black" size="md" disabled>
                    <MDBIcon icon="question" className="mr-2" />
                    Hidden
                  </MDBBtn>
                  <MDBBtn color="black" size="md" disabled>
                    <MDBIcon icon="question" className="mr-2" />
                    Hidden
                  </MDBBtn>
                  <MDBBtn color="black" size="md" disabled>
                    <MDBIcon icon="question" className="mr-2" />
                    Hidden
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="6">
            <MDBCard className="mb-3 newpost">
              <MDBCardBody>
                <h3>
                  Greetings, {profile.title} {profile.sith_name}
                </h3>
                <MDBInput
                  type="textarea"
                  label="What's on your mind?"
                  name="post"
                  outline
                  className={this.state.post_basic ? "basic hand" : undefined}
                  value={this.state.post}
                  onChange={this.changeTextareaHandler}
                />
                <div>
                  <div className="d-inline post-settings">
                    <MDBTooltip placement="top" domElement className="test">
                      <span
                        onClick={(e) => {
                          this.setState(
                            {
                              post_basic: !this.state.post_basic,
                            },
                            () =>
                              localStorage.setItem(
                                "language_basic",
                                this.state.post_basic
                              )
                          );
                        }}
                      >
                        <MDBIcon
                          icon="language"
                          size="lg"
                          className={
                            this.state.post_basic ? "text-gold" : undefined
                          }
                        />
                      </span>
                      <span>Toggle Imperial Basic</span>
                    </MDBTooltip>
                    <MDBTooltip placement="top" domElement className="test">
                      <span
                        onClick={(e) => {
                          this.setState(
                            {
                              post_visibility: !this.state.post_visibility,
                            },
                            () =>
                              localStorage.setItem(
                                "post_visibility",
                                this.state.post_visibility
                              )
                          );
                        }}
                      >
                        <MDBIcon
                          icon="globe-americas"
                          size="lg"
                          className={
                            this.state.post_visibility
                              ? this.state.post_languageApproved
                                ? "text-gold"
                                : "text-danger"
                              : undefined
                          }
                        />
                      </span>
                      <span>Change visibility</span>
                    </MDBTooltip>
                  </div>
                  <small
                    className={
                      this.state.post.length === 500
                        ? "text-danger float-right"
                        : "float-right"
                    }
                  >
                    {this.state.post.length} / 500
                  </small>
                </div>
                <div className="clearfix" />
                <div>
                  {this.state.post_visibility ? (
                    <>
                      {this.state.post_languageApproved ? (
                        <small className="text-gold">
                          Posting globally
                          {this.state.post_basic && " in Imperial Basic"}
                        </small>
                      ) : (
                        <>
                          <small className="text-danger">
                            Posting to your country
                            {this.state.post_basic && " in Imperial Basic"}
                          </small>
                          <br />
                          <small className="text-muted">
                            Please write English to post globally
                          </small>
                        </>
                      )}
                    </>
                  ) : (
                    <small className="text-muted">
                      Posting to your country
                      {this.state.post_basic && " in Imperial Basic"}
                    </small>
                  )}
                  {this.state.postError && (
                    <small className="text-danger d-block">
                      {this.state.postError}
                    </small>
                  )}
                </div>
                {this.state.postImageURL && (
                  <div className="pt-5 pl-5 pr-5 pb-2 text-center">
                    <img
                      className="img-fluid w-100 h-auto mb-3"
                      src={this.state.postImageURL}
                    />
                  </div>
                )}
                <hr />
                {this.state.postImageisUploading && (
                  <MDBProgress
                    material
                    value={this.state.postImageProgress}
                    className="my-s"
                  />
                )}
                <div className="actions">
                  <MDBBtn
                    color="elegant"
                    rounded
                    tag="label"
                    onClick={() =>
                      this.setState({
                        youtubeActive: !this.state.youtubeActive,
                      })
                    }
                  >
                    <MDBIcon
                      fab
                      icon="youtube"
                      className={
                        this.state.youtubeActive ? "pr-2 text-danger" : "pr-2"
                      }
                      size="lg"
                    />
                    YouTube
                  </MDBBtn>
                  <MDBDropdown className="d-inline">
                    <MDBDropdownToggle caret color="elegant" rounded>
                      <MDBIcon
                        far={
                          this.state.post_feeling.name.toLowerCase() ===
                          "feeling"
                        }
                        icon={this.state.post_feeling.icon}
                        className="pr-2"
                        size="lg"
                      />
                      {this.state.post_feeling.name}
                    </MDBDropdownToggle>
                    <MDBDropdownMenu color="danger">
                      <MDBDropdownItem
                        className="remove"
                        onClick={(event) => this.removeFeeling(event)}
                      >
                        No feeling
                        <MDBIcon
                          icon="times"
                          size="lg"
                          className="text-danger"
                        />
                      </MDBDropdownItem>
                      {feelings.map((feeling, i) => {
                        return (
                          <MDBDropdownItem
                            key={i}
                            name={feeling.name}
                            className={
                              this.state.post_feeling.name === feeling.name
                                ? "active"
                                : undefined
                            }
                            onClick={(event) =>
                              this.handleFeeling(event, feeling)
                            }
                          >
                            <MDBIcon
                              icon={feeling.icon}
                              size="lg"
                              className={
                                this.state.post_feeling.name === feeling.name
                                  ? "text-gold"
                                  : undefined
                              }
                            />
                            {feeling.name}
                          </MDBDropdownItem>
                        );
                      })}
                    </MDBDropdownMenu>
                  </MDBDropdown>
                  <MDBBtn color="elegant" rounded disabled>
                    <MDBIcon icon="user-plus" className="pr-2" size="lg" />
                    Tag
                  </MDBBtn>
                </div>
                {this.state.youtubeActive && (
                  <div className="youtube p-3">
                    <input
                      type="text"
                      name="youtube"
                      className="form-control"
                      value={this.state.youtubeLink}
                      onChange={(e) => this.onChangeYouTubeHandler(e)}
                      placeholder="YouTube Video Link"
                    />
                    {this.state.youtubeLinkError && (
                      <small className="text-danger">
                        It looks like your Link is not valid.
                      </small>
                    )}
                    {this.state.youtubeId && (
                      <div className="embed-responsive embed-responsive-16by9">
                        <iframe
                          className="embed-responsive-item"
                          src={
                            "//www.youtube.com/embed/" + this.state.youtubeId
                          }
                          frameborder="0"
                          allowfullscreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                )}
                {this.state.post.length > 0 && (
                  <FadeIn>
                    <div className="text-right send">
                      {/*profile.title.toLowerCase() === "darth" && (
                        <MDBBtn
                          color="red"
                          rounded
                          outline
                          disabled={this.state.disablePostAsSithCult}
                        >
                          <MDBIcon fab icon="sith" className="pr-2" size="lg" />
                          Post as SithCult
                        </MDBBtn>
                      )*/}
                      <MDBBtn color="elegant" rounded onClick={this.createPost}>
                        <MDBIcon
                          icon="paper-plane"
                          className="pr-2"
                          size="lg"
                        />
                        Post
                      </MDBBtn>
                    </div>
                  </FadeIn>
                )}
              </MDBCardBody>
            </MDBCard>
            {false && (
              <MDBAlert color="danger" className="my-2">
                <h4 className="alert-heading">Directive</h4>
                <MDBRow>
                  <MDBCol md="auto" className="align-self-center">
                    <MDBIcon icon="exclamation-triangle" size="2x" />
                  </MDBCol>
                  <MDBCol>
                    <p className="m-0">
                      To the weapons! The Jedi have bombed the Imperial Base
                      Omega-Theta on Balmorra. Report to your local chief of
                      operations!
                    </p>
                  </MDBCol>
                </MDBRow>
              </MDBAlert>
            )}
            {this.state.warningBeta && (
              <MDBAlert color="success" className="my-2">
                <MDBRow>
                  <MDBCol>
                    <h4 className="alert-heading">Welcome to our Beta!</h4>
                    <p>
                      Please note, that this is an{" "}
                      <strong>early Beta version</strong> of SithCult/ME.
                      <br />
                      Only very limited features are working yet.
                    </p>
                  </MDBCol>
                  <MDBCol md="auto" className="align-self-center">
                    <MDBBtn
                      color="success"
                      rounded
                      onClick={() => this.setState({ warningBeta: false })}
                    >
                      <MDBIcon icon="check" />
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBAlert>
            )}
            <div className="posts">
              <Posts
                posts={this.props.posts}
                comments={comments}
                update={this.loadMore}
                refreshData={this.refreshData}
              />
              {this.props.postLoading && (
                <div className="text-center spinners">
                  <div className="spinner-grow text-danger" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <div className="spinner-grow text-danger" role="status"></div>
                  <div className="spinner-grow text-danger" role="status"></div>
                </div>
              )}
            </div>
          </MDBCol>
          <MDBCol md="3">
            <MDBCard className="award text-center">
              <MDBCardBody>
                <p className="lead mb-1">Get rewards</p>
                <p className="small text-muted mb-1">
                  Contribute to SithCult and achieve greatness.
                </p>
                <Link to="/contribute">
                  <MDBBtn color="green" size="md">
                    <MDBIcon icon="hand-holding-usd" className="mr-2" />
                    Contribute to SithCult
                  </MDBBtn>
                </Link>
              </MDBCardBody>
            </MDBCard>
            {profile.badges &&
              Array.isArray(profile.badges) &&
              profile.badges.includes("Admin") && (
                <MDBCard className="mt-3">
                  <MDBCardBody>
                    <div className="admin-panel">
                      <p className="lead">Admin Panel</p>
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customSwitches"
                          readOnly
                          checked={this.state.showDeletedPosts}
                          onChange={this.handlePostVisibilityChange}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitches"
                        >
                          Show deleted posts
                        </label>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    posts: state.post.results,
    postLoading: state.post.loading,
    comments: state.comment.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (newPost) => dispatch(createPost(newPost)),
    loadPosts: (amount) => dispatch(loadPosts(amount)),
    loadAllPosts: (amount) => dispatch(loadAllPosts(amount)),
    loadComments: () => dispatch(loadComments()),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
