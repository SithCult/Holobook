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

class Posts extends React.Component {

  _calculateTimeAgo = (timestamp) => {
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US');

    return timeAgo.format(timestamp);
  }

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
                    src="https://mdbootstrap.com/img/Photos/Avatars/img%20%2810%29.jpg"
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
                    <MDBIcon icon="map-marker-alt" className="pr-1"/>
                      {post.details.ip.country_name}
                    {" | "}
                      <MDBIcon
                      icon="language"
                      className={post.basic ? "text-gold" : undefined}
                      />
                    {" | "}
                      <MDBIcon
                      icon="globe-americas"
                      className={post.target ? "text-gold" : undefined}
                      />
                    </small>
                  </div>
                  <div className="ml-auto p-2 mb-auto text-muted">
                    {this._calculateTimeAgo(post.timestamp)}
                  </div>
                </MDBCol>
              </MDBRow>
              <div className="p-3">
                <p 
                dangerouslySetInnerHTML={{__html: post.content}}
                className={post.basic ? "basic narrow" : undefined}
                ></p>
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