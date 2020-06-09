//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional
// Stripe
import StripeCheckout from "react-stripe-checkout";

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
  MDBIframe,
} from "mdbreact";

//> CSS
import "./donate.scss";

class DonatePage extends React.Component {
  state = {
    reached: 500,
    selectedAmount: 25,
  };

  onToken = (token) => {
    fetch("/save-stripe-token", {
      method: "POST",
      body: JSON.stringify(token),
    }).then((response) => {
      response.json().then((data) => {
        alert(`We are in business, ${data.email}`);
      });
    });
  };

  render() {
    return (
      <MDBContainer className="white-text mt-5 pt-5" id="donate">
        <div className="text-center mb-5">
          <h2 className="font-weight-bold mb-3">Support our cause</h2>
          <MDBProgress
            material
            value={(100 / 10000) * this.state.reached}
            className="mt-s"
            animated={true}
          />
          <div className="d-flex justify-content-between align-items-center">
            <h3>
              Reached:{" "}
              <small className="text-danger font-weight-bold">
                € {this.state.reached},-
              </small>{" "}
              / € 10.000,-
            </h3>
            <MDBBtn color="danger" size="md">
              Support
            </MDBBtn>
          </div>
        </div>
        <MDBRow>
          <MDBCol md="4">
            <div className="embed-responsive embed-responsive-16by9 z-depth-1-half">
              <MDBIframe src="https://www.youtube.com/embed/z_okR9xjTzg" />
            </div>
            <p className="lead mt-4 mb-0">Fixed amount</p>
            <div className="d-flex justify-content-between">
              <MDBBtn
                color={this.state.selectedAmount === 10 ? "blue" : "indigo"}
                onClick={() => this.setState({ selectedAmount: 10 })}
              >
                <MDBIcon icon="euro-sign" />
                10
              </MDBBtn>
              <MDBBtn
                color={this.state.selectedAmount === 25 ? "blue" : "indigo"}
                onClick={() => this.setState({ selectedAmount: 25 })}
              >
                <MDBIcon icon="euro-sign" />
                25
              </MDBBtn>
              <MDBBtn
                color={this.state.selectedAmount === 50 ? "blue" : "indigo"}
                onClick={() => this.setState({ selectedAmount: 50 })}
              >
                <MDBIcon icon="euro-sign" />
                50
              </MDBBtn>
            </div>
            <div className="d-flex justify-content-between">
              <MDBBtn
                color={this.state.selectedAmount === 100 ? "blue" : "indigo"}
                onClick={() => this.setState({ selectedAmount: 100 })}
              >
                <MDBIcon icon="euro-sign" />
                100
              </MDBBtn>
              <MDBBtn
                color={this.state.selectedAmount === 250 ? "blue" : "indigo"}
                onClick={() => this.setState({ selectedAmount: 250 })}
              >
                <MDBIcon icon="euro-sign" />
                250
              </MDBBtn>
              <MDBBtn
                color={this.state.selectedAmount === 500 ? "blue" : "indigo"}
                onClick={() => this.setState({ selectedAmount: 500 })}
              >
                <MDBIcon icon="euro-sign" />
                500
              </MDBBtn>
            </div>
            <p className="lead mt-4 mb-0">Custom amounts</p>
            <div className="form-group">
              <label htmlFor="formGroupExampleInput">
                <small>€ 5,- to € 5000,-</small>
              </label>
              <input
                type="number"
                min="5"
                max="5000"
                value={this.state.selectedAmount}
                onChange={(e) =>
                  this.setState({
                    selectedAmount: e.target.value,
                  })
                }
                onBlur={(e) =>
                  this.setState({
                    selectedAmount:
                      e.target.value >= 5 && e.target.value <= 5000
                        ? parseInt(e.target.value)
                        : 5,
                  })
                }
                className="form-control"
                id="formGroupExampleInput"
              />
            </div>
            <hr />
            <MDBBtn color="blue">
              <MDBIcon fab icon="paypal" />
              PayPal
            </MDBBtn>
            <StripeCheckout
              name="Support our cause" // the pop-in header title
              description="We do not store any information." // the pop-in header subtitle
              ComponentClass="div"
              panelLabel="Donate" // prepended to the amount in the bottom pay button
              amount={this.state.selectedAmount * 100} // cents
              currency="EUR"
              stripeKey={process.env.REACT_APP_SHOPIFY}
              email=" "
              // Note: Enabling either address option will give the user the ability to
              // fill out both. Addresses are sent as a second parameter in the token callback.
              shippingAddress
              allowRememberMe // "Remember Me" option (default true)
              token={this.onToken} // submit callback
              // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
              // you are using multiple stripe keys
              reconfigureOnUpdate={false}
            >
              <MDBBtn color="purple">
                <MDBIcon fab icon="stripe" />
                Stripe
              </MDBBtn>
            </StripeCheckout>
          </MDBCol>
          <MDBCol md="8">
            <p>
              <strong>Who will benefit?</strong>
              <br />
              Humanity. All members of Sith Cult and beyond who long for a Sith
              Imperial society.
            </p>
            <p>
              <strong>What will the funds be used for?</strong>
              <br />
              We will use our gained ressources to
              <br />- further promote SithCult
              <br />- provide international SithCult clusters with funds to
              create banners and flyer
              <br /> - expand our Social Network "Holobook" to provide a
              platform for all members
              <br />- create Uniforms, Sith robes and more for our members
              <br />- create more content like Short films
              <br />- create a new news show (in English)
            </p>
            <p>
              <strong>How soon do we need this funds?</strong>
              <br />
              Every single donation helps our oganisation! We strave for
              progress. Progress that can not be achieved without ressources. We
              would like to see progress as soon as possible.
            </p>
            <p>
              <strong>What does your support mean to us?</strong>
              <br />
              With supporting our cause, we are one step closer to international
              presence and building our Sith Imperial society.
            </p>
            <p>
              <strong>What rewards will you get?</strong>
              <br />
              You will receive a "Founder" and "Phase 1" badge in our social
              network "Holobook", along with 200 reputation and 10.000 virtual
              Imperial credits on Holobook. This can be used to gain higher
              ranks and make others feel your presence and influence. Every
              supporter will receive a personal certificate which will reflect
              your passion for Sith Cult and the Sith Empire.
            </p>
            <p>
              <strong>What's next?</strong>
              <br />
              After completing Phase 1, we will have a stronger international
              presence. We will be able to take part on conventions to reach
              even more people and support local clusters in your area. Phase 2
              will see the return of the Imperial Youth, a program to educate
              the youth and train them in the way of the Sith anlongside with
              even greater presence and Sith robes for all our members. ... and
              remember.
              <br />
              <br />
              The Dark Side will guide your path. Always.
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default DonatePage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
