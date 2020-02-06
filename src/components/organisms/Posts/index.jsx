//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> Additional libraries
// Calculate time ago
import TimeAgo from 'javascript-time-ago';
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en';

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
// Connect
import { connect } from 'react-redux';

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";

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
  }

  componentDidUpdate() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
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

  getPosts = () => {
    console.log(this.props);
    let posts = this.props.posts;
    if(posts){
      let result = posts.map((post, key) => {
        return(
          <MDBCard className="mb-3 post" key={key}>
            <MDBCardBody>
              <MDBRow>
                <MDBCol className="flex-center">
                  <div className="p-2">
                    <img 
                    src={defaultUserIMG}
                    className="rounded-circle avatar-img align-self-center mr-0"/>
                  </div>
                  <div className="p-2 author-info">
                    <div>{post.author}</div>
                    {post.details.feeling &&
                      <i className="feeling">
                      <MDBIcon icon={post.details.feeling.icon} className="pl-1" size="lg" />
                      - is feeling {post.details.feeling.name}
                      </i>
                    }
                    <small className="text-muted d-block">
                    {post.details.ip &&
                      <>
                      <MDBIcon icon="map-marker-alt" className="pr-1"/>
                      {post.details.ip.country_name}
                      {" | "}
                      </>
                    }
                      <MDBIcon
                      icon="language"
                      className={post.basic ? "text-gold" : ""}
                      />
                    {" | "}
                      <MDBIcon
                      icon="globe-americas"
                      className={post.target ? "text-gold" : ""}
                      />
                    </small>
                  </div>
                  <div className="ml-auto p-2 mb-auto">
                    <small className="text-muted">
                    {this._calculateTimeAgo(post.timestamp)}
                    </small>
                  </div>
                </MDBCol>
              </MDBRow>
              <div className="p-3">
                <p 
                dangerouslySetInnerHTML={{__html: post.content}}
                className={(post.basic && this.state.basic) ? "basic hand" : ""}
                >
                </p>
                {post.basic &&
                <small
                className="px-1 underlined"
                onClick={() => this.setState({basic: !this.state.basic})}
                >
                {this.state.basic ? (
                  "Translate"
                ) : (
                  "Back to basic"
                )}
                </small>
                }                
                {post.image &&
                  <div className="p-4">
                    <img 
                    className="img-fluid w-100 h-auto"
                    src={post.image}
                    alt={"Uploaded image by "+post.author}
                    />
                  </div>
                }
              </div>
              <div className="px-2 bottom">
              {this.alreadyLiked(post.likes) ? (
                <>
                <MDBIcon 
                fab
                icon="sith"
                className="text-white p-2"
                onClick={() => {
                  this.props.unlikePost(post.id, this.props.auth.uid, post.likes);
                  this.props.load(this.props.posts.length);
                }}
                size="lg"
                />
                {post.likes && post.likes.length}
                </>
              ) : (
                <>
                <MDBIcon 
                fab
                icon="sith"
                className="text-muted p-2"
                onClick={() => {
                  this.props.likePost(post.id, this.props.auth.uid, post.likes);
                  this.props.load(this.props.posts.length);
                }}
                size="lg"
                />
                {post.likes && post.likes.length}
                </>
              )}
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
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    postLoading: state.post.likeError,
    liked: state.post.liked,
    unliked: state.post.unliked,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    likePost: (uniqueID, user, likes) => dispatch(likePost(uniqueID, user, likes)),
    unlikePost: (uniqueID, user, likes) => dispatch(unlikePost(uniqueID, user, likes)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Posts);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */
