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

  getPosts = () => {
    let posts = this.props.posts;
    if(posts){
      let result = posts.map((post, key) => {
        return(
          <MDBCard className="mb-3" key={key}>
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

export default Posts;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */
