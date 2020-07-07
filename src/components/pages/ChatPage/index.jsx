//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Redirect from Router
import { Link, Redirect, withRouter } from "react-router-dom";
// Meta tags
import { Helmet } from "react-helmet";

//> Additional libraries
// Calculate time ago
import TimeAgo from "javascript-time-ago";
// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";
// Flags for countries
import ReactCountryFlag from "react-country-flag";
// Country list
import countryList from "react-select-country-list";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import {
  getUsersPerCountry,
  getOnlineUsers,
} from "../../../store/actions/userActions";
import {
  getCountryChat,
  createChat,
  joinChat,
  getChats,
} from "../../../store/actions/chatActions";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBAvatar,
  MDBBadge,
  MDBProgress,
} from "mdbreact";

//> Components
import { Chat } from "../../organisms";
import { RankItem } from "../../atoms";

//> CSS
import "./chatpage.scss";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";
//#endregion

//#region > Components
class ChatPage extends React.Component {
  state = {
    selectedChat: null,
  };

  componentDidMount = () => {
    const { auth } = this.props;

    if (auth.uid) {
      this.props.getChats(this.props.auth.uid);
    }
  };

  render() {
    const { auth, profile, chats } = this.props;

    // Redirect unauthorized users
    if (auth.uid === undefined) return <Redirect to="/login" />;

    // Preset first selected chat
    if (chats && !this.state.selectedChat) {
      this.setState({
        selectedChat: chats[0],
      });
    }

    console.log(chats);

    return (
      <MDBContainer id="chats" className="text-white pt-5 mt-5">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`Chat - SithCult`}</title>
          <link rel="canonical" href="https://sithcult.com/chat" />
        </Helmet>
        <MDBRow>
          <MDBCol lg="4">
            <div className="text-right mb-2">
              <MDBBtn color="blue" size="md">
                <MDBIcon icon="plus" className="mr-2" />
                Create chat
              </MDBBtn>
            </div>
            {chats &&
              chats.map((chat, i) => {
                return (
                  <MDBCard
                    key={i}
                    className={
                      chat.id === this.state.selectedChat?.id
                        ? "clickable active"
                        : "clickable"
                    }
                    onClick={() => this.setState({ selectedChat: chat })}
                  >
                    <MDBCardBody>
                      <div className="d-flex justify-content-between">
                        {chat.name.length === 2 ? (
                          <div>
                            <div className="text-center flag">
                              <ReactCountryFlag svg countryCode={chat.name} />
                            </div>
                            {countryList().getLabel(chat.name)}
                          </div>
                        ) : (
                          chat.name
                        )}
                        {(chat.users.length > 2 || chat.name.length === 2) && (
                          <span className="text-muted small">Group Chat</span>
                        )}
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                );
              })}
          </MDBCol>
          <MDBCol lg="8">
            {this.state.selectedChat && (
              <Chat
                key={this.state.selectedChat.id}
                chatDetails={{
                  id: this.state.selectedChat.id,
                  data: this.state.selectedChat,
                }}
                currentUser={auth.uid}
                hasJoined={
                  this.state.selectedChat.users.includes(auth.uid)
                    ? true
                    : false
                }
              />
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
    authError: state.auth.authError,
    authErrorCode: state.auth.authErrorCode,
    authErrorDetails: state.auth.authErrorDetails,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    chats: state.chat.chats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChats: (uid) => dispatch(getChats(uid)),
    createChat: (name, users) => dispatch(createChat(name, users)),
    joinChat: (uid, chid, curUsers) => dispatch(joinChat(uid, chid, curUsers)),
  };
};
//#endregion

//#region > Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChatPage));
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
