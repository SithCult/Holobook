//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> Additional libraries
// Calculate time ago
import TimeAgo from 'javascript-time-ago';
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en';
// Flags for countries
import ReactCountryFlag from "react-country-flag";

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
} from 'mdbreact';

//> Redux Firebase
// Actions for posts
import { 
  createPost,
  removePost,
  editPost,
  loadPosts,
  reportPost,
  likePost,
  unlikePost,
} from "../../../store/actions/postActions";
// Getting user information
import { 
  getUser,
  clearUser,
} from "../../../store/actions/userActions";
// Connect
import { connect } from 'react-redux';

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";

class Posts extends React.Component {

  state = {
    username: "",
    avatar: "",
    isUploading: false,
    progress: 0,
    avatarURL: "",
    basic: true,
  };

  _calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US');

    return timeAgo.format(timestamp);
  }

  componentDidMount() {
    document.addEventListener('scroll', this.trackScrolling);
    this.interval = setInterval(() => this.props.load(this.props.posts.length), 30000);
  }

  componentDidUpdate() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
    clearInterval(this.interval);
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById('profile');
    if (this.isBottom(wrappedElement)) {
      document.removeEventListener('scroll', this.trackScrolling);
      this.props.update();
    }
  };

  alreadyLiked = (list) => {
    let uid = this.props.auth.uid;
    if(Array.isArray(list)){
      if(list.length > 0){
        let res = list.map((item, i) => {
          console.log(item.uid, uid, item.uid === uid);
          if(item.uid === uid){
            return true;
          } else {
            return false;
          }
        });
        if(res.includes(true)){
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  handlePopoverChange = (open) => {
    console.log(open);
    if(!open){
      this.props.clearUser();
    }
  }

  getPosts = () => {
    console.log(this.props);
    const { posts, auth, receivedUser } = this.props;

    if(posts && auth){
      let result = posts.map((post, key) => {
        /*let liked = false;
        let likedRes = post.data.likes.map((like, i) => {
          // Check if user has liked this post
          if(like.uid === auth.uid){
            return true;
          } else {
            return false;
          }
        });
        if(likedRes.includes(true)){
          liked = true;
        }*/
        let translate = false;

        return(
          <MDBCard className="mb-3 post" key={key}>
            <MDBCardBody className={post.data.skin ? post.data.skin : ""}>
              <MDBRow>
                <MDBCol className="flex-center">
                  <div className="p-2">
                    {(() => {
                      switch(post.data.skin) {
                        case "gold":
                          return(
                            <img 
                            src={goldUserIMG}
                            className="rounded-circle avatar-img align-self-center mr-0"
                            />
                          );
                        case "light":
                          return(
                            <img 
                            src={lightUserIMG}
                            className="rounded-circle avatar-img align-self-center mr-0"
                            />
                          );
                        case "bronze":
                          return(
                            <img 
                            src={bronzeUserIMG}
                            className="rounded-circle avatar-img align-self-center mr-0"
                            />
                          );
                        default:
                          return(
                            <img 
                            src={defaultUserIMG}
                            className="rounded-circle avatar-img align-self-center mr-0"
                            />
                          );
                      }
                    })()}
                  </div>
                  <div className="p-2 author-info">
                    <MDBPopover
                      placement="top"
                      popover
                      clickable
                      domElement
                      className="furtherInfo"
                      onChange={this.handlePopoverChange}
                    >
                      <div 
                      className="clickable"
                      onClick={() => this.props.getUser(post.data.author.uid)}
                      >
                      {post.data.author.name}
                      </div>
                      <div>
                      {receivedUser !== true && receivedUser !== undefined ? (
                        <>
                        {receivedUser !== false ? (
                          <>
                            <MDBPopoverHeader className="flex-center">
                            <div>
                            {receivedUser.title+" "+receivedUser.sith_name}
                            <small className="text-muted d-block blue-text">{receivedUser.department}</small>
                            </div>
                            <div className="ml-auto p-2 mb-auto">
                              <small className="text-muted">
                              <MDBIcon icon="medal" className="purple-text mr-1" />
                              {receivedUser.reputation}
                              </small>
                            </div>
                            </MDBPopoverHeader>
                            <MDBPopoverBody>
                              <div>
                              {(() => {
                                return receivedUser.badges.map((badge, i) => {
                                  switch(badge) {
                                    case "founder":
                                      return(
                                        <MDBBadge pill color="elegant-color" key={i}>
                                        <MDBIcon icon="fire" className="pr-2"/>
                                        Founder
                                        </MDBBadge>
                                      );
                                    case "member":
                                      return(
                                        <MDBBadge pill color="red" key={i}>
                                        <MDBIcon icon="user" className="pr-2"/>
                                        Council
                                        </MDBBadge>
                                      );
                                    case "historic":
                                      return(
                                        <MDBBadge pill color="orange" key={i}>
                                        <MDBIcon icon="book" className="pr-2"/>
                                        Historic
                                        </MDBBadge>
                                      );
                                    default:
                                      return null;
                                  }
                                })
                              })()}
                              <div className="flex-center text-left my-2">
                                <ReactCountryFlag 
                                svg 
                                className="mr-1"
                                countryCode={receivedUser.address.country}
                                />
                                Base of Operation
                              </div>
                              </div>
                            </MDBPopoverBody>
                          </>
                        ) : (
                          <>
                            <MDBPopoverHeader>
                            <div>
                            User not found
                            </div>
                            </MDBPopoverHeader>
                            <MDBPopoverBody>
                              This person is no longer a member of SithCult.
                            </MDBPopoverBody>
                          </>
                        )}
                        </>
                      ) : (
                        <MDBPopoverBody className="text-center">
                          <div>
                          <MDBSpinner />
                          </div>
                          <div>
                          Receiving current status
                          </div>
                        </MDBPopoverBody>
                      )
                      }
                      </div>
                    </MDBPopover>
                    {post.data.details.feeling &&
                      <i className="feeling">
                      <MDBIcon icon={post.data.details.feeling.icon} className="pl-1" size="lg" />
                      - is feeling {post.data.details.feeling.name}
                      </i>
                    }
                    <small className="text-muted d-block">
                    {post.data.details.ip &&
                      <>
                      <MDBIcon icon="map-marker-alt" className="pr-1"/>
                      {post.data.details.ip.country_name}
                      {" | "}
                      </>
                    }
                      <MDBIcon
                      icon="language"
                      className={post.data.basic ? "text-gold" : ""}
                      />
                    {" | "}
                      <MDBIcon
                      icon="globe-americas"
                      className={post.data.target ? "text-gold" : ""}
                      />
                    </small>
                  </div>
                  <div className="ml-auto p-2 mb-auto">
                    <small className="text-muted">
                    {this._calculateTimeAgo(post.data.timestamp)}
                    </small>
                    {post.data.skin &&
                    <div className="skin-label">
                      <small className={post.data.skin+"-label"}>
                        {post.data.skin} Edition
                      </small>
                    </div>
                    }
                  </div>
                </MDBCol>
              </MDBRow>
              <div className="p-3">
                <p 
                dangerouslySetInnerHTML={{__html: post.data.content}}
                className={(post.data.basic && this.state.basic !== post.id) ? "basic hand" : ""}
                >
                </p>
                {post.data.basic &&
                <div className="toggle-basic">
                  {this.state.basic !== post.id ? (
                    <small
                    className="clickable"
                    onClick={() => this.setState({basic: post.id})}
                    >
                    Translate
                    </small>
                  ) : (
                    <small
                    className="clickable"
                    onClick={() => this.setState({basic: 0})}
                    >
                    Show original
                    </small>
                  )}
                </div>
                
                }                
                {post.data.image &&
                  <div className="p-4">
                    <img 
                    className="img-fluid w-100 h-auto"
                    src={post.data.image}
                    alt={"Uploaded image by "+post.data.author}
                    />
                  </div>
                }
              </div>
              <div className="px-2 bottom">
              {this.alreadyLiked(post.data.likes) ? (
                <>
                <MDBIcon 
                fab
                icon="sith"
                className="text-white p-2"
                onClick={() => {
                  this.props.unlikePost(post.id, this.props.auth.uid, post.data.likes);
                  this.props.load(this.props.posts.length);
                }}
                size="lg"
                />
                <span className="text-muted">
                {post.data.likes.length !== 0 ? (
                  <>
                  {post.data.likes.length+" "}
                  {post.data.likes.length > 1 ? (
                    "approves"
                  ) : (
                    "approve"
                  )}
                  </>
                ) : (
                  "0 approves"
                )}
                </span>
                </>
              ) : (
                <>
                <MDBIcon 
                fab
                icon="sith"
                className="text-muted p-2"
                onClick={() => {
                  this.props.likePost(post.id, this.props.auth.uid, post.data.likes);
                  this.props.load(this.props.posts.length);
                }}
                size="lg"
                />
                <span className="text-muted">
                {post.data.likes.length !== 0 ? (
                  <>
                  {post.data.likes.length+" "}
                  {post.data.likes.length > 1 ? (
                    "approves"
                  ) : (
                    "approve"
                  )}
                  </>
                ) : (
                  "0 approves"
                )}
                </span>
                </>
              )}
              {false && auth.uid === post.data.author.uid &&
                <div className="ml-auto p-2 mb-auto">
                  <small 
                  className="clickable"
                  onClick={() => this.props.removePost(auth.uid, post)}
                  >
                  Delete post
                  </small>
                </div>
              }
              </div>
              <div className="card-footer mt-3">
                <p className="text-muted">Comments to be added soon</p>
              </div>
            </MDBCardBody>
          </MDBCard>
        )
      });
      return result;
    } else {
      return false;
    }
  }

  render(){
    return(
      <>
      {this.getPosts()}
      </>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    postLoading: state.post.likeError,
    liked: state.postliked,
    unliked: state.post.unliked,
    receivedUser: state.user.receivedUser,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    likePost: (uniqueID, user, likes) => dispatch(likePost(uniqueID, user, likes)),
    getUser: (uid) => dispatch(getUser(uid)),
    clearUser: () => dispatch(clearUser()),
    unlikePost: (uniqueID, user, likes) => dispatch(unlikePost(uniqueID, user, likes)),
    removePost: (uid, postID) => dispatch(removePost(uid, postID)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Posts);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */
