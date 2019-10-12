//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> Additional modules
// Fade In Animation
import FadeIn from 'react-fade-in';
// Country list
import countryList from 'react-select-country-list';

//> Redux
// Connect
import { connect } from 'react-redux';
// Actions
import { signOut } from '../../../store/actions/authActions';

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
} from 'mdbreact';

//> Components
// To be added

//> CSS
import './profilepage.scss';

//> Images
// To be added

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    post_charlength: 0,
    post: "",
    post_basic: false,
  };

  componentDidMount = () => {
    let basic = localStorage.getItem("language_basic");
    if(basic){
      this.setState({
        post_basic: basic === "true" ? true : false
      });
    }
  }

  changeTextareaHandler = event => {
    event.target.style.overflow = 'hidden';
    event.target.style.height = 0;
    event.target.style.height = event.target.scrollHeight + 'px';



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

  render() {
    const { auth, profile } = this.props;

    console.log(auth, profile);

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
                        <MDBIcon icon="language" size="lg" />
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
                      <span>
                        <MDBIcon far icon="eye" size="lg" />
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
                <hr/>
                <div className="actions">
                  <MDBBtn
                  color="elegant"
                  rounded
                  >
                  <MDBIcon icon="image" className="pr-2" size="lg" />
                  Photo
                  </MDBBtn>
                  <MDBBtn
                  color="elegant"
                  rounded
                  >
                  <MDBIcon far icon="smile" className="pr-2" size="lg" />
                  Feeling
                  </MDBBtn>
                  <MDBBtn
                  color="elegant"
                  rounded
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
    signOut: () => dispatch(signOut())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProfilePage);

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */
