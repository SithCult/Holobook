//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional
// Enables PayPal integration
import { PayPalButton } from "react-paypal-button-v2";
// Date/Time formatting
import moment from "moment";
// Enables CONFETTI!
import Confetti from "react-confetti";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBBadge,
  MDBInput,
  MDBIcon,
  MDBProgress,
  MDBIframe,
  MDBTypography,
  MDBBox,
  MDBSpinner,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
} from "mdbreact";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import {
  updateBadgesDonate,
  writeDonation,
  getDonations,
} from "../../../store/actions/userActions";
import { writeDonationMessage } from "../../../store/actions/donMsgActions";

//> CSS
import "./donate.scss";
//#endregion

//#region > Global functions
const formatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
//#endregion

//#region > Components
class DonatePage extends React.Component {
  state = {
    selectedAmount: 25,
    customAmount: false,
    success: false,
    donationgoal: 5000,
    reached: 0,
    savedMessage: false,
    loading: false,
  };

  componentDidMount = () => {
    this.initDonations();

    // Window size
    this.setState({
      width: window.screen.width,
      height: window.screen.height,
    });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.donations) {
      this.calculateCurrent(nextProps.donations);
    }
  };

  initDonations = () => {
    this.props.getDonations();
  };

  // Calculate current reached donations from array of all donations
  calculateCurrent = (donations) => {
    let sum = 0;

    donations.map((donation) => {
      sum += parseInt(donation.amount);
    });

    if (!this.state.reached) {
      this.setState({
        reached: sum,
      });
    }
  };

  // Calculate the percentual completion of a progressbar
  calculateProgressBarValue(amount, maximum = this.state.donationgoal) {
    return (100 / maximum) * amount;
  }

  render() {
    const { auth, profile, donations, selectedDonation } = this.props;

    return (
      <MDBContainer className="white-text mt-5 pt-5" id="donate">
        <Confetti
          width={this.state.width}
          height={this.state.height}
          recycle={false}
          initialVelocityY={80}
          numberOfPieces={1000}
          run={this.state.success}
          gravity={0.3}
          className="confetti"
        />
        {this.state.loading && (
          <div className="loadingscreen">
            <MDBSpinner red size="lg" />
          </div>
        )}
        {this.state.success ? (
          <div className="text-center thankyou">
            <MDBProgress
              material
              value={this.calculateProgressBarValue(this.state.oldReached)}
              className="old"
              animated={true}
            />
            <MDBProgress
              material
              value={this.calculateProgressBarValue(this.state.reached)}
              className="new"
              animated={true}
            />
            <h2 className="font-weight-bold mb-1">
              Thank you for supporting us!{" "}
              <MDBIcon icon="heart" className="pink-text" />
            </h2>
            <p className="lead">
              You have been added to the global list of supporters.
            </p>
            <MDBBadge pill color="white" className="mr-2">
              <MDBIcon icon="fire" className="pr-2" />
              Founder
            </MDBBadge>
            <MDBBadge pill color="orange" className="mr-2">
              <MDBIcon fab icon="sith" className="pr-2" />
              Phase 1
            </MDBBadge>
            <MDBRow className="my-4 d-flex justify-content-center">
              <MDBCol md="4">
                <MDBCard className="text-dark text-left">
                  <MDBCardBody>
                    <div className="d-flex justify-content-between">
                      <p className="font-weight-bold">
                        {profile.sithname
                          ? profile.title + " " + profile.sith_name
                          : "Unknown Sith"}
                      </p>
                      <p className="text-muted">Just now</p>
                    </div>
                    <div>
                      {!this.state.savedMessage ? (
                        <MDBInput
                          type="textarea"
                          label="Your Message (Optional)"
                          rows="2"
                          id="donmsginput"
                          maxLength="250"
                          outline
                          onChange={(e) => {
                            this.setState({
                              donationmessage: e.target.value,
                            });
                          }}
                        />
                      ) : (
                        <p>{this.state.donationmessage}</p>
                      )}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="indigo-text mb-0" id="donamountdisplay">
                        <MDBIcon icon="dollar-sign" />{" "}
                        <span className="font-weight-bold">
                          {formatter.format(this.state.selectedAmount) + "-"}
                        </span>
                      </h3>
                      {!this.state.savedMessage && (
                        <MDBBtn
                          size="md"
                          id="savemsgbtn"
                          disabled={!this.state.donationmessage}
                          color="green"
                          onClick={() => {
                            if (selectedDonation) {
                              this.setState({ savedMessage: true }, () =>
                                this.props.writeDonationMessage(
                                  selectedDonation,
                                  this.state.donationmessage
                                )
                              );
                            }
                          }}
                        >
                          Share your story
                        </MDBBtn>
                      )}
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            <MDBBtn
              color="white"
              onClick={() => {
                this.setState({
                  success: false,
                  savedMessage: false,
                  donationmessage: "",
                });
                this.initDonations();
              }}
            >
              Go back to main page
            </MDBBtn>
          </div>
        ) : (
          <>
            <div className="text-center">
              {auth?.uid && profile && profile.isLoaded ? (
                <>
                  <h2 className="font-weight-bold mb-1">
                    Contribute to our cause
                  </h2>
                  <p className="lead mb-3">{`${profile.title} ${profile.sith_name}`}</p>
                </>
              ) : (
                <>
                  <h2 className="font-weight-bold mb-4">
                    Contribute to our cause
                  </h2>
                </>
              )}
              <MDBProgress
                material
                value={this.calculateProgressBarValue(this.state.reached)}
                className="mt-s"
                animated={true}
              />
              <div className="d-flex justify-content-between align-items-center">
                <h3>
                  <small className="text-danger font-weight-bold">
                    $ {formatter.format(this.state.reached) + "-"}
                  </small>{" "}
                  / $ {formatter.format(this.state.donationgoal) + "-"}
                </h3>
              </div>
            </div>
            <MDBRow className="mt-3">
              <MDBCol md="4">
                <div className="embed-responsive embed-responsive-16by9 z-depth-1-half mb-3">
                  <MDBIframe src="https://www.youtube.com/embed/z_okR9xjTzg" />
                </div>
                {!this.state.customAmount ? (
                  <>
                    <MDBBtn
                      color="white"
                      size="md"
                      onClick={() => this.setState({ customAmount: true })}
                    >
                      <MDBIcon fab icon="sith" />
                      Custom amount
                    </MDBBtn>
                    <p className="lead mt-2 mb-0">Fixed amount</p>
                    <div className="d-flex justify-content-between">
                      <MDBBtn
                        color={
                          this.state.selectedAmount === 10 ? "indigo" : "blue"
                        }
                        onClick={() => this.setState({ selectedAmount: 10 })}
                      >
                        <MDBIcon icon="dollar-sign" />
                        10
                      </MDBBtn>
                      <MDBBtn
                        color={
                          this.state.selectedAmount === 25 ? "indigo" : "blue"
                        }
                        onClick={() => this.setState({ selectedAmount: 25 })}
                      >
                        <MDBIcon icon="dollar-sign" />
                        25
                      </MDBBtn>
                      <MDBBtn
                        color={
                          this.state.selectedAmount === 50 ? "indigo" : "blue"
                        }
                        onClick={() => this.setState({ selectedAmount: 50 })}
                      >
                        <MDBIcon icon="dollar-sign" />
                        50
                      </MDBBtn>
                    </div>
                    <div className="d-flex justify-content-between">
                      <MDBBtn
                        color={
                          this.state.selectedAmount === 100 ? "indigo" : "blue"
                        }
                        onClick={() => this.setState({ selectedAmount: 100 })}
                      >
                        <MDBIcon icon="dollar-sign" />
                        100
                      </MDBBtn>
                      <MDBBtn
                        color={
                          this.state.selectedAmount === 250 ? "indigo" : "blue"
                        }
                        onClick={() => this.setState({ selectedAmount: 250 })}
                      >
                        <MDBIcon icon="dollar-sign" />
                        250
                      </MDBBtn>
                      <MDBBtn
                        color={
                          this.state.selectedAmount === 500 ? "indigo" : "blue"
                        }
                        onClick={() => this.setState({ selectedAmount: 500 })}
                      >
                        <MDBIcon icon="dollar-sign" />
                        500
                      </MDBBtn>
                    </div>
                  </>
                ) : (
                  <>
                    <MDBBtn
                      color="white"
                      size="md"
                      onClick={() =>
                        this.setState({
                          customAmount: false,
                          selectedAmount: 25,
                        })
                      }
                    >
                      <MDBIcon icon="dollar-sign" />
                      Fixed amount
                    </MDBBtn>
                    <p className="lead mt-2 mb-0">Custom amount</p>
                    <div className="form-group">
                      <label htmlFor="formGroupExampleInput">
                        <small>$ 5,- to $ 5000,-</small>
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
                  </>
                )}
                <MDBCard className="mt-4">
                  <MDBCardBody>
                    <PayPalButton
                      amount={this.state.selectedAmount}
                      // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                      onClick={() => {
                        this.setState({ loading: true });
                      }}
                      onSuccess={(details, data) => {
                        this.setState(
                          {
                            success: true,
                            loading: false,
                            oldReached: this.state.reached,
                            reached:
                              this.state.reached + this.state.selectedAmount,
                          },
                          () => {
                            window.scrollTo(0, 0);

                            if (auth.uid) {
                              this.props.updateBadgesDonate(
                                profile.badges,
                                details,
                                profile.credits,
                                profile.reputation,
                                profile.sith_name
                              );
                            } else {
                              this.props.writeDonation(
                                this.state.selectedAmount
                              );
                            }
                          }
                        );
                      }}
                      onCancel={() =>
                        this.setState({ loading: false, success: false })
                      }
                      options={{
                        clientId: process.env.REACT_APP_PAYPAL,
                      }}
                    />
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="8">
                <p>
                  <strong>Who will benefit?</strong>
                  <br />
                  {profile.sith_name &&
                    "You, " + profile.title + " " + profile.sith_name + ". "}
                  Humanity. All members of Sith Cult and beyond who long for a
                  Sith Imperial society.
                </p>
                <p>
                  <strong>What will the funds be used for?</strong>
                  <br />
                  We will use our gained ressources to
                  <br />- further promote SithCult
                  <br />- provide international SithCult clusters with funds to
                  create banners and flyers
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
                  progress. Progress that can not be achieved without
                  ressources. We would like to see progress as soon as possible.
                </p>
                <p>
                  <strong>What does your support mean to us?</strong>
                  <br />
                  With supporting our cause, we are one step closer to
                  international presence and building our Sith Imperial society.
                </p>
                <p>
                  <strong>
                    What <span className="orange-text">rewards</span> will you
                    get?
                  </strong>
                  <br />
                  When logged in, you will receive a "Founder" and "Phase 1"
                  badge in our social network "Holobook", along with{" "}
                  {Math.round(this.state.selectedAmount / 2)} reputation and{" "}
                  {Math.round(this.state.selectedAmount * 9)} virtual Imperial
                  credits on Holobook. This can be used to gain higher ranks and
                  make others feel your presence and influence. Every supporter
                  will receive a personal certificate which will reflect their
                  passion for Sith Cult and the Sith Empire.
                </p>
                <div className="mb-3">
                  <MDBBadge pill color="white" className="mr-2">
                    <MDBIcon icon="fire" className="pr-2" />
                    Founder
                  </MDBBadge>
                  <MDBBadge pill color="orange" className="mr-2">
                    <MDBIcon fab icon="sith" className="pr-2" />
                    Phase 1
                  </MDBBadge>
                  <div className="mt-3">
                    <span className="text-white d-block">
                      <MDBIcon icon="medal" className="pr-2" />{" "}
                      {Math.round(this.state.selectedAmount / 2)} Reputation
                    </span>
                    <span className="text-white d-block">
                      <MDBIcon fab icon="sith" className="pr-2" />{" "}
                      {Math.round(this.state.selectedAmount * 9)} Imperial
                      credits
                    </span>
                  </div>
                </div>
                <p>
                  <strong>What's next?</strong>
                  <br />
                  After completing Phase 1, we will have a stronger
                  international presence. We will be able to take part on
                  conventions to reach even more people and support local
                  clusters in your area. Phase 2 will see the return of the
                  Imperial Youth, a program to educate the youth and train them
                  in the way of the Sith anlongside with even greater presence
                  and Sith robes for all our members. <br />
                  <br />
                  ... and remember. The Dark Side will guide your path. Always.
                </p>
              </MDBCol>
            </MDBRow>
            <MDBRow className="my-4 d-flex justify-content-center">
              {donations &&
                []
                  .concat(donations)
                  .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
                  .map((donation, i) => {
                    return (
                      <MDBCol md="4" key={i} className="mb-4">
                        <MDBCard className="text-dark text-left">
                          <MDBCardBody>
                            <div className="d-flex justify-content-between">
                              <div className="font-weight-bold">
                                <p className="mb-0">
                                  {donation.sith_name}{" "}
                                  {donation.hash ? (
                                    <MDBPopover
                                      placement="right"
                                      domElement
                                      clickable
                                      popover
                                      tag="span"
                                      id="popper1"
                                    >
                                      <span>
                                        <MDBIcon
                                          icon="award"
                                          className="green-text ml-1 clickable"
                                        />
                                      </span>
                                      <div>
                                        <MDBPopoverHeader className="green-text font-weight-bold">
                                          Verified contribution
                                        </MDBPopoverHeader>
                                        <MDBPopoverBody>
                                          <div className="align-items-center m-0">
                                            This contribution has been{" "}
                                            <strong>verified.</strong>
                                            <br />
                                            <small className="word-break-all">
                                              <code>{donation.hash}</code>
                                            </small>
                                          </div>
                                        </MDBPopoverBody>
                                      </div>
                                    </MDBPopover>
                                  ) : (
                                    <MDBPopover
                                      placement="right"
                                      domElement
                                      clickable
                                      popover
                                      tag="span"
                                      id="popper1"
                                    >
                                      <span>
                                        <MDBIcon
                                          icon="award"
                                          className="grey-text ml-1 clickable"
                                        />
                                      </span>
                                      <div>
                                        <MDBPopoverHeader>
                                          Not verified
                                        </MDBPopoverHeader>
                                        <MDBPopoverBody>
                                          <div>
                                            We can not verify the contribution
                                            based on the transaction hash.
                                            <br />
                                            <small className="word-break-all">
                                              <code>NULL</code>
                                            </small>
                                          </div>
                                        </MDBPopoverBody>
                                      </div>
                                    </MDBPopover>
                                  )}
                                </p>
                              </div>
                              <p className="text-muted">
                                {moment
                                  .unix(donation.timestamp / 1000)
                                  .format("MMM Do YY")}
                              </p>
                            </div>
                            {donation.msg && (
                              <MDBTypography blockquote>
                                <MDBBox tag="p" mb={0}>
                                  <small>{donation.msg}</small>
                                </MDBBox>
                                <MDBBox
                                  tag="footer"
                                  mb={3}
                                  className="blockquote-footer"
                                >
                                  <cite title="Source Title">
                                    <small>{donation.sith_name}</small>
                                  </cite>
                                </MDBBox>
                              </MDBTypography>
                            )}
                            <div>
                              <h3 className="indigo-text mb-0">
                                <MDBIcon icon="dollar-sign" />{" "}
                                <span className="font-weight-bold">
                                  {formatter.format(donation.amount) + "-"}
                                </span>
                              </h3>
                            </div>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    );
                  })}
            </MDBRow>
          </>
        )}
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
    donations: state.user.donations,
    selectedDonation: state.user.selectedDonation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBadgesDonate: (badges, details, credits, reputation, sith_name) =>
      dispatch(
        updateBadgesDonate(badges, details, credits, reputation, sith_name)
      ),
    writeDonation: (amount) => dispatch(writeDonation(amount)),
    getDonations: () => dispatch(getDonations()),
    writeDonationMessage: (uid, msg) =>
      dispatch(writeDonationMessage(uid, msg)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(DonatePage);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
