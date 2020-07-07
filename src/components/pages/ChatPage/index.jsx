//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Redirect from Router
import { Redirect, withRouter } from "react-router-dom";
// Meta tags
import { Helmet } from "react-helmet";

//> Additional libraries
// Flags for countries
import ReactCountryFlag from "react-country-flag";
// Country list
import countryList from "react-select-country-list";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { getAllUsers } from "../../../store/actions/userActions";
import {
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
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBBadge,
  MDBAvatar,
} from "mdbreact";

//> Components
import { Chat } from "../../organisms";

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
    selectedUsers: [],
    modal: false,
    showAllSearchMemberResults: false,
  };

  componentDidMount = async () => {
    const { auth } = this.props;

    if (auth.uid) {
      this.setState(
        {
          users: await this.props.getAllUsers(),
        },
        () => this.props.getChats(this.props.auth.uid)
      );
    }
  };

  // Get user profile picture
  getPicture = (skin, uid, index, name) => {
    switch (skin) {
      case "gold":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={goldUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "light":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={lightUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "bronze":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={bronzeUserIMG} alt={name} />
          </MDBAvatar>
        );
      case "dark":
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={darkUserIMG} alt={name} />
          </MDBAvatar>
        );
      default:
        return (
          <MDBAvatar className="mx-auto white" key={index}>
            <img src={defaultUserIMG} alt={name} />
          </MDBAvatar>
        );
    }
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  searchMember = (input) => {
    const allUsers = this.state.users;

    let results = [];

    if (input) {
      allUsers.forEach((user) => {
        // Check if input matches any user and exclude own user
        if (
          user.data.sith_name.toLowerCase().includes(input.toLowerCase()) &&
          user.id !== this.props.auth.uid
        ) {
          // Check if user is not already selected
          const selectedUsers = this.state.selectedUsers;
          let found = false;

          selectedUsers.forEach((selected) => {
            if (selected.id === user.id) {
              found = true;
            }
          });

          if (!found) {
            results = [...results, user];
          }
        }
      });
    }

    this.setState({
      searchMemberResults: results,
      searchMemberInput: input,
      showAllSearchMemberResults: false,
    });
  };

  selectMember = (user) => {
    this.setState({
      searchMemberInput: "",
      searchMemberResults: [],
      selectedUsers: [...this.state.selectedUsers, user],
    });
  };

  removeMember = (id) => {
    let selectedUsers = this.state.selectedUsers;

    selectedUsers = selectedUsers.filter(function (obj) {
      return obj.id !== id;
    });

    this.setState({
      selectedUsers,
    });
  };

  getUsers = () => {
    const selectedUsers = this.state.selectedUsers;

    if (selectedUsers) {
      let result = [];

      selectedUsers.forEach((user) => {
        result = [...result, user.id];
      });

      result = [...result, this.props.auth.uid];

      return result;
    } else {
      return false;
    }
  };

  render() {
    const { auth, chats } = this.props;

    // Redirect unauthorized users
    if (auth.uid === undefined) return <Redirect to="/login" />;

    // Preset first selected chat
    if (chats && !this.state.selectedChat) {
      this.setState({
        selectedChat: chats[0],
      });
    }

    console.log(this.state);

    return (
      <>
        <MDBContainer id="chats" className="text-white pt-5 mt-5">
          <Helmet>
            <meta charSet="utf-8" />
            <title>{`Chat - SithCult`}</title>
            <link rel="canonical" href="https://sithcult.com/chat" />
          </Helmet>
          <MDBRow>
            <MDBCol lg="4">
              <div className="text-right mb-2">
                <MDBBtn color="blue" size="md" onClick={this.toggle}>
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
                            <p className="mb-0">
                              {chat.name.split(" ").length === 3
                                ? chat.name.split(" ")[2]
                                : chat.name}
                            </p>
                          )}
                          {chat.users.length === 2 &&
                            chat.name.length !== 2 && (
                              <span className="blue-text small">
                                Private chat
                              </span>
                            )}
                          {(chat.users.length > 2 ||
                            chat.name.length === 2) && (
                            <span className="text-muted small">Group Chat</span>
                          )}
                        </div>
                        {chat.users.length !== 2 && (
                          <span className="text-muted small">
                            {chat.users.length}{" "}
                            {chat.users.length === 1
                              ? "participant"
                              : "participants"}
                          </span>
                        )}
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
                  allUsers={this.state.users ? this.state.users : null}
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
        {this.state.modal && (
          <MDBModal
            id="add-chat"
            size="md"
            isOpen={this.state.modal}
            toggle={this.toggle}
          >
            <MDBModalBody className="mb-0">
              <p className="font-weight-bold">Create new chat</p>
              {this.state.selectedUsers.length > 1 && (
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Group Chat name"
                  value={this.state.newGroupName}
                  onChange={(e) =>
                    this.setState({ newGroupName: e.target.value })
                  }
                />
              )}
              <p className="mb-0">Participants</p>
              <div className="my-2">
                {this.state.selectedUsers &&
                  this.state.selectedUsers.map((user, i) => {
                    return (
                      <MDBBadge pill color="elegant" key={i}>
                        {user.data.sith_name}
                        <MDBIcon
                          icon="minus"
                          className="ml-2 text-danger clickable"
                          onClick={() => this.removeMember(user.id)}
                        />
                      </MDBBadge>
                    );
                  })}
              </div>
              <input
                type="text"
                className="form-control mb-3"
                value={this.state.searchMemberInput}
                onChange={(e) => this.searchMember(e.target.value)}
                placeholder="Search member"
              />
              <div className="card-columns">
                {this.state.searchMemberResults &&
                  this.state.searchMemberResults.splice(0, 6).map((user, i) => {
                    console.log(user);
                    return (
                      <MDBCard
                        className="text-left clickable"
                        key={i}
                        onClick={() => this.selectMember(user)}
                      >
                        <div className="d-flex justify-content-between">
                          <div className="d-flex align-items-center">
                            {this.getPicture(
                              user.data.skin,
                              user.id,
                              i,
                              user.data.sith_name
                            )}
                            <span className="pl-2">
                              {user.data.sith_name}
                              <span className="d-block small blue-text">
                                {countryList().getLabel(user.data.country)}
                              </span>
                            </span>
                          </div>
                          <span className="small text-muted">
                            <span className="ml-1">{user.data.title}</span>
                          </span>
                        </div>
                        <span className="d-block small text-info my-1">
                          {user.data.department}
                        </span>
                        {user.data.donations && (
                          <div>
                            <MDBBadge pill color="amber" className="mt-2">
                              <MDBIcon icon="dollar-sign" /> Supporter
                            </MDBBadge>
                          </div>
                        )}
                      </MDBCard>
                    );
                  })}
              </div>
              {this.state.searchMemberResults &&
                this.state.searchMemberResults.length > 6 && (
                  <p className="text-muted small">
                    and {this.state.searchMemberResults.length - 6} more
                  </p>
                )}
              {this.state.selectedUsers.length === 1 && (
                <>
                  <MDBBtn
                    color="blue"
                    size="md"
                    className="m-0"
                    onClick={() =>
                      this.props.createChat(
                        this.props.profile.sith_name +
                          " and " +
                          this.state.selectedUsers[0].data.sith_name,
                        this.getUsers()
                      )
                    }
                  >
                    Start Chat with {this.state.selectedUsers[0].data.sith_name}
                  </MDBBtn>
                  <span className="d-block small text-muted mt-2">
                    Or add at least one more to create a new{" "}
                    <strong>group chat</strong>.
                  </span>
                </>
              )}
              {this.state.selectedUsers.length > 1 && (
                <>
                  <MDBBtn
                    color="blue"
                    size="md"
                    className="m-0"
                    disabled={this.state.selectedUsers.length >= 10}
                    onClick={() =>
                      this.props.createChat(
                        this.state.newGroupName,
                        this.getUsers()
                      )
                    }
                  >
                    Start group chat
                  </MDBBtn>
                  {this.state.selectedUsers.length >= 10 ? (
                    <span className="d-block small text-muted mt-2">
                      You have reached the max. number of participant for your
                      group chat.
                    </span>
                  ) : (
                    <span className="d-block small text-muted mt-2">
                      You can add up to {10 - this.state.selectedUsers.length}{" "}
                      more people in your group chat.
                    </span>
                  )}
                </>
              )}
            </MDBModalBody>
            <MDBModalFooter className="justify-content-center text-dark">
              <MDBBtn
                color="black"
                rounded
                size="md"
                className="ml-4"
                onClick={this.toggle}
              >
                <MDBIcon icon="times" className="pr-2" />
                Cancel
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        )}
      </>
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
    getAllUsers: () => dispatch(getAllUsers()),
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
