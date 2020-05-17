//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Link } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBContainer, MDBBtn, MDBAlert, MDBIcon } from "mdbreact";

//> Redux
// Connect
import { connect } from "react-redux";

//> CSS
import "./messagepage.scss";

//> Images
// To be added

class MessagePage extends React.Component {
  render() {
    const { auth, profile } = this.props;

    return (
      <MDBContainer id="message" className="py-5 my-5 text-center text-white">
        {this.props.location.pathname === "/about" && (
          <>
            <h2>
              Thank you for visiting our web application
              <MDBIcon icon="heart" className="pink-text ml-2" />
            </h2>
            <p className="lead mt-3 mb-3">
              This application is being created and maintained by Star Wars fans
              all over the world.
              <br />
              We are a <strong>non-profit</strong>, <strong>open source</strong>{" "}
              Social Network designed for Star Wars fans.
            </p>
            <a
              href="https://github.com/SithCult"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MDBBtn color="white">
                <MDBIcon fab icon="github" className="mr-1" />
                GitHub
              </MDBBtn>
            </a>
            <div className="mt-5 text-left">
              <h2 className="mb-4">Contact information</h2>
              <p className="lead font-weight-bold mb-0">Head Engineer</p>
              <small className="text-muted">
                Department of Media Technology and Software Development
              </small>
              <p className="mt-2">
                Christian Aichner
                <br />
                Emailwerkstraße 29
                <br />
                A-9523 Landskron
              </p>
              <p>
                <a
                  className="underlined px-2"
                  href="mailto:center@sithcult.com"
                >
                  E-Mail us
                </a>
              </p>
            </div>
          </>
        )}
        {this.props.location.pathname === "/privacy/me" && (
          <>
            <h2>
              Your personal data
              <MDBIcon icon="heart" className="pink-text ml-2" />
            </h2>
            <p className="lead mt-3 mb-3">
              This application is being created and maintained by Star Wars fans
              all over the world.
              <br />
              We are a <strong>non-profit</strong>, <strong>open source</strong>{" "}
              Social Network designed for Star Wars fans.
            </p>
            <a
              href="https://github.com/SithCult"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MDBBtn color="white">
                <MDBIcon fab icon="github" className="mr-1" />
                GitHub
              </MDBBtn>
            </a>
            <div className="mt-5 text-left personal-data">
              {auth.uid !== undefined ? (
                <>
                  <h2 className="mb-0">What data do we have of you?</h2>
                  <p className="lead text-muted mb-4">
                    Only you can see this information.
                  </p>
                  <p>
                    Your name is <span>{profile.full_name}</span>.
                  </p>
                  {profile.address && profile.address.address ? (
                    <p>
                      Your address is <span>{profile.address.address}</span> in{" "}
                      <span>{profile.zip + " " + profile.city}</span>
                    </p>
                  ) : (
                    <p>You did not share your personal address information.</p>
                  )}
                  <p>
                    You live in a country with the country code of{" "}
                    <span>{profile.address && profile.address.country}</span>.
                  </p>
                  <p>
                    Your E-Mail is <span>{profile.email}</span>.
                  </p>
                  <p>
                    Your Sith name and title is{" "}
                    <span>{profile.title + " " + profile.sith_name}</span>.
                  </p>
                </>
              ) : (
                <h2 className="mb-4 text-center">
                  Please log in to experience this feature.
                </h2>
              )}
            </div>
          </>
        )}
        {this.props.location.pathname === "/privacy" && (
          <>
            <h2>
              The safety of your data is important to us
              <MDBIcon icon="heart" className="pink-text ml-2" />
            </h2>
            <p className="lead mt-3 mb-3">
              This application is being created and maintained by Star Wars fans
              all over the world.
              <br />
              We are a <strong>non-profit</strong>, <strong>open source</strong>{" "}
              Social Network designed for Star Wars fans.
            </p>
            <a
              href="https://github.com/SithCult"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MDBBtn color="white">
                <MDBIcon fab icon="github" className="mr-1" />
                GitHub
              </MDBBtn>
            </a>
            <div className="mt-5 text-left">
              <h2 className="mb-4">Privacy Policy for www.sithcult.com</h2>
              <div class="preview">
                <p>
                  At SithCult, accessible from www.sithcult.com, one of our main
                  priorities is the privacy of our visitors. This Privacy Policy
                  document contains types of information that is collected and
                  recorded by SithCult and how we use it.
                </p>
                <p>
                  If you have additional questions or require more information
                  about our Privacy Policy, do not hesitate to contact us.
                </p>
                <p>
                  This Privacy Policy applies only to our online activities and
                  is valid for visitors to our website with regards to the
                  information that they shared and/or collect in SithCult. This
                  policy is not applicable to any information collected offline
                  or via channels other than this website.
                </p>
                <h2>Consent</h2>
                <p>
                  By using our website, you hereby consent to our Privacy Policy
                  and agree to its terms.
                </p>
                <h2>Information we collect</h2>
                <p>
                  The personal information that you are asked to provide, and
                  the reasons why you are asked to provide it, will be made
                  clear to you at the point we ask you to provide your personal
                  information.
                </p>
                <p>
                  If you contact us directly, we may receive additional
                  information about you such as your name, email address, phone
                  number, the contents of the message and/or attachments you may
                  send us, and any other information you may choose to provide.
                </p>
                <p>
                  When you register for an Account, we may ask for your contact
                  information, including items such as name, address and email
                  address number.
                </p>
                <h2>How we use your information</h2>
                <p>
                  We use the information we collect in various ways, including
                  to:
                </p>
                <ul>
                  <li>Provide, operate, and maintain our webste</li>
                  <li>Improve, personalize, and expand our webste</li>
                  <li>Understand and analyze how you use our webste</li>
                  <li>
                    Develop new products, services, features, and functionality
                  </li>
                  <li>
                    Communicate with you, either directly or through one of our
                    partners, including for customer service, to provide you
                    with updates and other information relating to the webste,
                    and for marketing and promotional purposes
                  </li>
                  <li>Send you emails</li>
                  <li>Find and prevent fraud</li>
                </ul>
                <h2>Log Files</h2>
                <p>
                  SithCult follows a standard procedure of using log files.
                  These files log visitors when they visit websites. All hosting
                  companies do this and a part of hosting services' analytics.
                  The information collected by log files include internet
                  protocol (IP) addresses, browser type, Internet Service
                  Provider (ISP), date and time stamp, referring/exit pages, and
                  possibly the number of clicks. These are not linked to any
                  information that is personally identifiable. The purpose of
                  the information is for analyzing trends, administering the
                  site, tracking users' movement on the website, and gathering
                  demographic information. Our Privacy Policy was created with
                  the help of the Privacy Policy Generator and the Privacy
                  Policy Template.
                </p>
                <h2>Cookies and Web Beacons</h2>
                <p>
                  Like any other website, SithCult uses 'cookies'. Unlike
                  others, we do not store any personal data in cookies, which
                  could be tracked to an individual user.
                </p>
                <h2>Advertising Partners Privacy Policies</h2>
                <p>
                  You may consult this list to find the Privacy Policy for each
                  of the advertising partners of SithCult.
                </p>
                <p>
                  Third-party ad servers or ad networks uses technologies like
                  cookies, JavaScript, or Web Beacons that are used in their
                  respective advertisements and links that appear on SithCult,
                  which are sent directly to users' browser. They automatically
                  receive your IP address when this occurs. These technologies
                  are used to measure the effectiveness of their advertising
                  campaigns and/or to personalize the advertising content that
                  you see on websites that you visit.
                </p>
                <p>
                  Note that SithCult has no access to or control over these
                  cookies that are used by third-party advertisers.
                </p>
                <h2>Third Party Privacy Policies</h2>
                <p>
                  SithCult's Privacy Policy does not apply to other advertisers
                  or websites. Thus, we are advising you to consult the
                  respective Privacy Policies of these third-party ad servers
                  for more detailed information. It may include their practices
                  and instructions about how to opt-out of certain options. You
                  may find a complete list of these Privacy Policies and their
                  links here: Privacy Policy Links.
                </p>
                <p>
                  You can choose to disable cookies through your individual
                  browser options. To know more detailed information about
                  cookie management with specific web browsers, it can be found
                  at the browsers' respective websites. What Are Cookies?
                </p>
                <h2>
                  CCPA Privacy Rights (Do Not Sell My Personal Information)
                </h2>
                <p>
                  Under the CCPA, among other rights, California consumers have
                  the right to:
                </p>
                <p>
                  Request that a business that collects a consumer's personal
                  data disclose the categories and specific pieces of personal
                  data that a business has collected about consumers.
                </p>
                <p>
                  Request that a business delete any personal data about the
                  consumer that a business has collected.
                </p>
                <p>
                  Request that a business that sells a consumer's personal data,
                  not sell the consumer's personal data.
                </p>
                <p>
                  If you make a request, we have one month to respond to you. If
                  you would like to exercise any of these rights, please contact
                  us.
                </p>
                <h2>GDPR Data Protection Rights</h2>
                <p>
                  We would like to make sure you are fully aware of all of your
                  data protection rights. Every user is entitled to the
                  following:
                </p>
                <p>
                  The right to access – You have the right to request copies of
                  your personal data. We may charge you a small fee for this
                  service.
                </p>
                <p>
                  The right to rectification – You have the right to request
                  that we correct any information you believe is inaccurate. You
                  also have the right to request that we complete the
                  information you believe is incomplete.
                </p>
                <p>
                  The right to erasure – You have the right to request that we
                  erase your personal data, under certain conditions.
                </p>
                <p>
                  The right to restrict processing – You have the right to
                  request that we restrict the processing of your personal data,
                  under certain conditions.
                </p>
                <p>
                  The right to object to processing – You have the right to
                  object to our processing of your personal data, under certain
                  conditions.
                </p>
                <p>
                  The right to data portability – You have the right to request
                  that we transfer the data that we have collected to another
                  organization, or directly to you, under certain conditions.
                </p>
                <p>
                  If you make a request, we have one month to respond to you. If
                  you would like to exercise any of these rights, please contact
                  us.
                </p>
                <h2>Children's Information</h2>
                <p>
                  Another part of our priority is adding protection for children
                  while using the internet. We encourage parents and guardians
                  to observe, participate in, and/or monitor and guide their
                  online activity.
                </p>
                <p>
                  SithCult does not knowingly collect any Personal Identifiable
                  Information from children under the age of 13. If you think
                  that your child provided this kind of information on our
                  website, we strongly encourage you to contact us immediately
                  and we will do our best efforts to promptly remove such
                  information from our records.
                </p>
                <Link to="/privacy/me">
                  <MDBBtn color="yellow">My data</MDBBtn>
                </Link>
              </div>
            </div>
          </>
        )}
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

export default connect(mapStateToProps)(MessagePage);

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
