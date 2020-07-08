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
  getMessages,
  stopGettingMessages,
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
  MDBSpinner,
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
    newGroupName: "",
  };

  // Init on mount
  componentDidMount = () => {
    this.init();
  };

  componentWillReceiveProps = (nextprops) => {
    /*
     * If the chats don't exist right now but will exist in the next props,
     * start message handler for the chats
     */
    if (!this.props.chats && nextprops.chats) {
      nextprops.chats.map((c) => {
        this.props.getMessages(c.id);
      });
    }

    // Sort the chats
    if (nextprops.chats && nextprops.chatMessages) {
      this.sortChats(nextprops.chats, nextprops.chatMessages);
    }
  };

  // If component unmounts, kill the listeners
  componentWillUnmount() {
    this.props.chats.map((c) => {
      stopGettingMessages(c.id);
    });
  }

  // Init chat page
  init = async () => {
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

  // Sort the chats by their latest message
  sortChats = (chats, messages) => {
    let order = [];

    // Get newest messages form chats
    chats.map((c) => {
      let co = messages[c.id];

      if (co) {
        order = [...order, { ...co[co.length - 1], chat: c }];
      } else {
        order = [...order, { mid: c.id, data: { sentTimestamp: 0 }, chat: c }];
      }
    });

    // Put sorted array of messages into state
    this.setState({
      order: order.sort((a, b) =>
        a.data && b.data
          ? a.data.sentTimestamp < b.data.sentTimestamp
            ? 1
            : -1
          : -1
      ),
    });
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

  // Toggle modal
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  // Search user by name and show results
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
      newChatCreateError: undefined,
    });
  };

  // Adds member from searchMember to selected users for a chat
  selectMember = (user) => {
    this.setState({
      searchMemberInput: "",
      searchMemberResults: [],
      selectedUsers: [...this.state.selectedUsers, user],
      newChatCreateError: undefined,
    });
  };

  // Removes member from the selected users
  removeMember = (id) => {
    let selectedUsers = this.state.selectedUsers;

    selectedUsers = selectedUsers.filter(function (obj) {
      return obj.id !== id;
    });

    this.setState({
      selectedUsers,
      newChatCreateError: undefined,
    });
  };

  // Retrieves UID from selectedUsers users
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

  getUserByUid = (uid) => {
    const users = this.state.users;

    let result = null;

    users.forEach((user) => {
      if (user.id === uid) {
        result = user;
      }
    });

    return result;
  };

  createChat = async (name, users) => {
    // Check users are present
    if (name && users.length > 1) {
      // Check if the group name has more than 2 characters
      if (name.length > 2) {
        if (await this.props.createChat(name, users)) {
          this.setState(
            {
              newChatCreateError: undefined,
              selectedUsers: [],
              modal: false,
              showAllSearchMemberResults: false,
              newGroupName: "",
            },
            () => {
              this.init();
            }
          );
        } else {
          this.setState({
            newChatCreateError: 1,
          });
        }
      }
    }
  };

  render() {
    const { auth, chats, profile } = this.props;

    // Redirect unauthorized users
    if (auth.uid === undefined) return <Redirect to="/login" />;

    // Preset first selected chat
    if (
      chats &&
      chats.length > 0 &&
      !this.state.selectedChat &&
      this.state.order
    ) {
      this.setState({
        selectedChat: this.state.order[0].chat,
      });
    }

    return (
      <>
        <MDBContainer id="chats" className="text-white pt-5 mt-5">
          <Helmet>
            <meta charSet="utf-8" />
            <title>{`Chat - SithCult`}</title>
            <link rel="canonical" href="https://sithcult.com/chat" />
          </Helmet>
          {!this.state.order ? (
            <div className="d-flex justify-content-center align-items center">
              <MDBSpinner red />
            </div>
          ) : (
            <MDBRow>
              <MDBCol lg="4">
                <div className="text-right mb-2">
                  <MDBBtn color="blue" size="md" onClick={this.toggle}>
                    <MDBIcon icon="plus" className="mr-2" />
                    Create chat
                  </MDBBtn>
                </div>
                {chats &&
                  this.state.order &&
                  this.state.order.map((item, i) => {
                    return (
                      <MDBCard
                        key={i}
                        className={
                          item.chat.id === this.state.selectedChat?.id
                            ? "clickable active"
                            : "clickable"
                        }
                        onClick={() =>
                          this.setState({ selectedChat: item.chat })
                        }
                      >
                        <MDBCardBody
                          className={
                            item.data &&
                            item.data.read &&
                            !item.data.read.includes(auth.uid)
                              ? "unread"
                              : undefined
                          }
                        >
                          <div className="d-flex justify-content-between">
                            {item.chat.name.length === 2 ? (
                              <div>
                                <div className="text-center flag">
                                  <ReactCountryFlag
                                    svg
                                    countryCode={item.chat.name}
                                  />
                                </div>
                                {countryList().getLabel(item.chat.name)}
                                <MDBIcon
                                  icon="users"
                                  className="ml-2 text-muted"
                                  size="sm"
                                />
                              </div>
                            ) : (
                              <p className="mb-0">
                                {item.chat.name.split("and").length === 2 ? (
                                  <>
                                    {item.chat.name
                                      .split("and")[1]
                                      ?.trim()
                                      .toLowerCase() ===
                                    profile.sith_name?.toLowerCase()
                                      ? item.chat.name.split("and")[0]
                                      : item.chat.name.split("and")[1]}
                                  </>
                                ) : (
                                  <span>
                                    {item.chat.name}
                                    <MDBIcon
                                      icon="users"
                                      className="ml-2 text-muted"
                                      size="sm"
                                    />
                                  </span>
                                )}
                              </p>
                            )}
                            {item.chat.users.length === 2 &&
                              item.chat.name.length !== 2 && (
                                <span className="blue-text small">
                                  Private chat
                                </span>
                              )}
                            {(item.chat.users.length > 2 ||
                              item.chat.name.length === 2) && (
                              <span className="text-muted small">
                                Group Chat
                              </span>
                            )}
                          </div>
                          <div className="text-muted small latest-message">
                            {item.data?.msg ? (
                              <>
                                <MDBIcon
                                  icon="angle-right"
                                  className="mr-1 ml-2"
                                />
                                {item.data && item.data.author && (
                                  <>
                                    {item.data.author.uid === auth.uid ? (
                                      <span className="blue-text">You: </span>
                                    ) : (
                                      <span className="blue-text">
                                        {
                                          this.getUserByUid(
                                            item.data.author.uid
                                          )?.data.sith_name
                                        }
                                        :{" "}
                                      </span>
                                    )}
                                  </>
                                )}
                                {item.data?.msg
                                  ? item.data.msg.length > 30
                                    ? item.data.msg.slice(0, 30) + "..."
                                    : item.data.msg
                                  : null}
                              </>
                            ) : (
                              <span>No messages yet</span>
                            )}
                          </div>
                          {item.chat.users.length !== 2 && (
                            <span className="text-muted small">
                              {item.chat.users.length}{" "}
                              {item.chat.users.length === 1
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
                {this.state.selectedChat && this.props.chatMessages && (
                  <Chat
                    key={this.state.selectedChat.id}
                    chatDetails={this.state.selectedChat}
                    chatMessages={
                      this.props.chatMessages[this.state.selectedChat.id]
                    }
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
          )}
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
              {this.state.newChatCreateError && (
                <>
                  {this.state.newChatCreateError === 1 && (
                    <p className="text-danger font-weight-bold d-block">
                      Chat already exists.
                    </p>
                  )}
                </>
              )}
              {this.state.selectedUsers.length === 1 && (
                <>
                  <MDBBtn
                    color="blue"
                    size="md"
                    className="m-0"
                    onClick={() =>
                      this.createChat(
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
                    disabled={
                      this.state.selectedUsers.length >= 10 ||
                      this.state.newGroupName?.length <= 2
                    }
                    onClick={() =>
                      this.createChat(this.state.newGroupName, this.getUsers())
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
    chatMessages: state.chat.chatMessages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChats: (uid) => dispatch(getChats(uid)),
    createChat: (name, users) => dispatch(createChat(name, users)),
    getMessages: (chid) => dispatch(getMessages(chid)),
    stopGettingMessages: (chid) => dispatch(stopGettingMessages(chid)),
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
