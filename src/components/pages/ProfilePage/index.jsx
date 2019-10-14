//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> Additional modules
// Fade In Animation
import FadeIn from 'react-fade-in';
// Country list
import countryList from 'react-select-country-list';
// Fetching
import axios from 'axios';

//> Redux
// Connect
import { connect } from 'react-redux';
// Actions
import { signOut } from '../../../store/actions/authActions';
import { 
  createPost,
  removePost,
  editPost,
  loadPosts,
  reportPost,
} from '../../../store/actions/postActions';

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
} from 'mdbreact';

//> Components
// To be added

//> CSS
import './profilepage.scss';

//> Images
// To be added

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
]

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
      icon: "meh-blank"
    }
  };

  componentDidMount = () => {
    // Get IP data once every page call
    this._getIPData();
    let basic = localStorage.getItem("language_basic");
    let visibility = localStorage.getItem("post_visibility");
    if(basic){
      this.setState({
        post_basic: basic === "true" ? true : false
      });
    }
    if(visibility){
      this.setState({
        post_visibility: visibility === "true" ? true : false
      });
    }
  }

  // Feeling handler
  handleFeeling = (event, feeling) => {
    this.setState({
      post_feeling: feeling
    });
  }
  removeFeeling = event => {
    this.setState({
      post_feeling: {
        name: "Feeling",
        icon: "meh-blank"
      }
    });
  }

  changeTextareaHandler = event => {
    event.target.style.overflow = 'hidden';
    event.target.style.height = 0;
    event.target.style.height = event.target.scrollHeight + 'px';

    // Check language
    let wordcount = event.target.value.split(' ').length;
    this._detectLanguage(event.target.value, wordcount);

    if(event.target.value.length <= 500){
      this.setState({
        post: event.target.value
      })
    }
  }

  getCountry = (address) => {
    let country = address ? countryList().getLabel(address.country) : null;
    return country;
  }

  _renderBadge = (badge, key) => {
    switch (badge.toLowerCase()) {
      case "founder":
        return (
          <MDBCol key={key}>
            <MDBBadge pill color="elegant-color">
            <MDBIcon icon="fire" className="pr-2"/>
            Founder
            </MDBBadge>
          </MDBCol>
        )
        break;
      case "member":
        return (
          <MDBCol key={key}>
            <MDBBadge pill color="red">
            <MDBIcon icon="user" className="pr-2"/>
            Member
            </MDBBadge>
          </MDBCol>
        )
        break;
      case "hand":
        return (
          <MDBCol key={key}>
            <MDBBadge pill color="gold">
            <MDBIcon fab icon="sith" className="pr-2"/>
            Hand of the Emperor
            </MDBBadge>
          </MDBCol>
        )
        break;
      default:
        break;
    }
  }

  getBadges = (badges) => {
    let result = "";

    if(badges){
      result = badges.map((badge, key) => {
        return this._renderBadge(badge, key)
      });
    }

    if(result === ""){
      return null;
    } else {
      return <MDBRow className="text-center badge-row">{result}</MDBRow>;
    }
  }

  createPost = (uid, title, name) => {
    let content = this.state.post;
    let characters = content.length;
    let author = {
      uid: uid,
      name: title + " " + name,
    };
    let timestamp = Date.now();
    let target = this.state.post_visibility;
    let wordcount = content.split(' ').length;
    let language = this.state.post_languages.length > 0 ? this.state.post_languages : null;
    let feeling = this.state.post_feeling.name.toLowerCase() === "feeling" ? null : this.state.post_feeling;
    let basic = this.state.post_basic;
    let ip = this.state.post_ip ? this.state.post_ip : null

    // Check if the content is English for a 
    if(target){
      if(language){
        if(language[0][0] !== "english"){
          console.log("do not post");
        }
      }
    }

    // Normalize data
    let data = {
      content: content.replace(/\r\n|\r|\n/g,"</br>"),
      details: {
        characters: characters,
        timestamp: timestamp,
        feeling: feeling,
        ip: ip,
      },
      target: target,
      language: language,
      basic: basic,
    }

    // Tell Firebase to create post
    this.props.createPost(data);
  }
  
  _getIPData = async () => {
    // Get country data from ipapi
    await axios.get('https://ipapi.co/json/').then((response) => {
        let data = response.data;
        this.setState({
            post_ip: data
        });
    }).catch((error) => {
        console.log(error);
    });
  }

  _detectLanguage = (text, words) => {
    if(words >= 5){
      const LanguageDetect = require('languagedetect');
      const lngDetector = new LanguageDetect();

      let results = lngDetector.detect(text.trim(),3);
      this.setState({
        post_languages: results
      }, () => this._getLanguageApproved());
    } else {
      return false;
    }
  }

  _getLanguageApproved = () => {
    if(this.state.post_visibility){
      if(this.state.post_languages.length > 0){
        if(this.state.post_languages[0][0] === "english"){
          if(!this.state.post_languageApproved){
            this.setState({
              post_languageApproved: true
            });
          }
        } else {
          if(this.state.post_languageApproved){
            this.setState({
              post_languageApproved: false
            });
          }
        }
      }else {
        if(!this.state.post_languageApproved){
          this.setState({
            post_languageApproved: true
          });
        }
      }
    }
  }

  render() {
    const { auth, profile } = this.props;
    
    console.log(auth, profile);

    console.log(this.state);

    return (
      <MDBContainer id="profile" className="pt-5 mt-5">
        <MDBRow>
          <MDBCol md="3">
            <MDBCard testimonial>
              <MDBCardUp className='red' />
              <MDBAvatar className='mx-auto white'>
                <img
                  src='https://mdbootstrap.com/img/Photos/Avatars/img%20%2810%29.jpg'
                  alt=''
                />
              </MDBAvatar>
              <MDBCardBody>
                <p className="lead font-weight-bold mb-0">{profile.title} {profile.sith_name}</p>
                <p className="text-muted">{this.getCountry(profile.address)}</p>
                {this.getBadges(profile.badges)}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="6">
            <MDBCard>
              <MDBCardBody>
                <h3>Greetings, {profile.title} {profile.sith_name}</h3>
                <MDBInput 
                type="textarea"
                label="What's on your mind?"
                name="post"
                outline
                className={this.state.post_basic && "basic narrow"}
                value={this.state.post}
                onChange={this.changeTextareaHandler}
                />
                <div>
                  <div className="d-inline post-settings">
                    <MDBTooltip
                      placement="top"
                      domElement
                      className="test"
                    >
                      <span
                      onClick={(e) => {
                        this.setState({
                          post_basic: !this.state.post_basic
                        }, () => localStorage.setItem("language_basic",this.state.post_basic))
                        }
                      }
                      >
                        <MDBIcon
                        icon="language"
                        size="lg"
                        className={this.state.post_basic && "text-gold"}
                        />
                      </span>
                      <span>
                        Toggle Imperial Basic
                      </span>
                    </MDBTooltip>
                    <MDBTooltip
                      placement="top"
                      domElement
                      className="test"
                    >
                      <span
                      onClick={(e) => {
                        this.setState({
                          post_visibility: !this.state.post_visibility
                        }, () => localStorage.setItem("post_visibility",this.state.post_visibility))
                        }
                      }
                      >
                        <MDBIcon
                        icon="globe-americas"
                        size="lg"
                        className={this.state.post_visibility && (this.state.post_languageApproved ? "text-gold" : "text-danger")}
                        />
                      </span>
                      <span>
                      Change visibility
                      </span>
                    </MDBTooltip>
                    
                  </div>
                  <small
                  className={this.state.post.length === 500 ? "text-danger float-right" : "float-right"}
                  >
                  {this.state.post.length} / 500
                  </small>
                </div>
                <div className="clearfix"/>
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
                        Posting to your cluster
                        {this.state.post_basic && " in Imperial Basic"}
                      </small>
                      <br/>
                      <small className="text-muted">
                        Please write English to post globally
                      </small>
                    </>
                  )}
                  </>
                ) : (
                  <small className="text-muted">
                  Posting to your cluster
                  {this.state.post_basic && " in Imperial Basic"}
                  </small>
                )}
                </div>
                <hr/>
                <div className="actions">
                  <MDBBtn
                  color="elegant"
                  rounded
                  disabled
                  >
                  <MDBIcon icon="image" className="pr-2" size="lg" />
                  Photo
                  </MDBBtn>
                  <MDBDropdown className="d-inline">
                    <MDBDropdownToggle caret color="elegant" rounded>
                      <MDBIcon 
                      far={this.state.post_feeling.name.toLowerCase() === "feeling"}
                      icon={this.state.post_feeling.icon}
                      className="pr-2"
                      size="lg"
                      />
                      {this.state.post_feeling.name}
                    </MDBDropdownToggle>
                    <MDBDropdownMenu color="danger">
                      <MDBDropdownItem 
                      className="remove"
                      onClick={event => this.removeFeeling(event)}
                      >
                      No feeling
                      <MDBIcon 
                      icon="times"
                      size="lg"
                      className="text-danger"
                      />
                      </MDBDropdownItem>
                    {feelings.map((feeling, i) => {
                      return(
                        <MDBDropdownItem 
                        key={i}
                        name={feeling.name}
                        className={this.state.post_feeling.name === feeling.name && "active"}
                        onClick={event => this.handleFeeling(event, feeling)}
                        >
                        <MDBIcon 
                        icon={feeling.icon}
                        size="lg"
                        className={this.state.post_feeling.name === feeling.name && "text-gold"}
                        />
                        {feeling.name}
                        </MDBDropdownItem>
                      )
                    })}
                    </MDBDropdownMenu>
                  </MDBDropdown>
                  <MDBBtn
                  color="elegant"
                  rounded
                  disabled
                  >
                  <MDBIcon icon="user-plus" className="pr-2" size="lg" />
                  Tag
                  </MDBBtn>
                </div>
                {this.state.post.length > 0 &&
                <FadeIn>
                <div className="text-right">
                  {(profile.title.toLowerCase() === "darth") &&
                    <MDBBtn
                    color="red"
                    rounded
                    outline
                    >
                      <MDBIcon fab icon="sith" className="pr-2" size="lg" />
                      Post als SithCult
                    </MDBBtn>
                  }
                  <MDBBtn
                  color="elegant"
                  rounded
                  onClick={this.createPost}
                  >
                    <MDBIcon icon="paper-plane" className="pr-2" size="lg" />
                    Post
                  </MDBBtn>
                </div>
                </FadeIn>
                }
              </MDBCardBody>
            </MDBCard>
            {false &&
            <MDBAlert color="danger" className="my-2">
              <h4 className="alert-heading">Directive</h4>
              <MDBRow>
                <MDBCol md="auto" className="align-self-center">
                  <MDBIcon icon="exclamation-triangle" size="2x" />
                </MDBCol>
                <MDBCol>
                  <p className="m-0">
                  To the weapons! The Jedi have bombed the Imperial Base Omega-Theta on Balmorra. 
                  Report to your local chief of operations!
                  </p>
                </MDBCol>
              </MDBRow>
            </MDBAlert>
            }
            <MDBAlert color="success" className="my-2">
              <MDBRow>
                <MDBCol>
                  <h4 className="alert-heading">Welcome to our closed Beta!</h4>
                  <p>Please note, that this is an <strong>early Beta version</strong> of Holobook. 
                  Only certain features are working - some are not yet functional.</p>
                </MDBCol>
                <MDBCol md="auto" className="align-self-center">
                  <MDBBtn color="success" rounded>
                    <MDBIcon icon="check" />
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </MDBAlert>
          </MDBCol>
          <MDBCol md="3">

          </MDBCol>

        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
    createPost: (newPost) => dispatch(createPost(newPost)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProfilePage);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */
