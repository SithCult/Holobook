//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// React Prop Types
import PropTypes from "prop-types";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBtn,
  MDBBadge,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBCard,
  MDBModalFooter,
  MDBAvatar,
} from "mdbreact";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import {
  getMessages,
  writeMessage,
  stopGettingMessages,
  leaveChat,
  joinChat,
} from "../../../store/actions/chatActions";
import { getAllUsers } from "../../../store/actions/userActions";
import {
  createNotification,
  removeNotifications,
} from "../../../store/actions/notificationActions";

//> Components
import { MessageItem } from "../../molecules";

//> Additional Libraries
// Country list
import countryList from "react-select-country-list";

//> CSS
import "./chat.scss";

//> Images
import defaultUserIMG from "../../../assets/images/default.gif";
import goldUserIMG from "../../../assets/images/gold.gif";
import lightUserIMG from "../../../assets/images/light.gif";
import bronzeUserIMG from "../../../assets/images/bronze.gif";
import darkUserIMG from "../../../assets/images/dark.gif";
//#endregion

//#region > Components
class Chat extends React.Component {
  constructor(props) {
    super(props);

    // DOM References
    this.messagesEndRef = React.createRef();
    this.inputRef = React.createRef();

    // State
    this.state = {
      message: "",
      focussed: true,
      leaveModal: false,
      addUserModal: false,
      selectedUsers: [],
    };
  }

  componentDidMount = async () => {
    this.setState(
      {
        allUsers: this.props.allUsers
          ? this.props.allUsers
          : await this.props.getAllUsers(),
        message: JSON.parse(localStorage.getItem(this.props.chatDetails.id))
          ? JSON.parse(localStorage.getItem(this.props.chatDetails.id))
          : "",
      },
      () => {
        // Check if user is part of chat
        if (this.props.hasJoined) {
          this.getMsg();
          this.inputRef.current.focus();
        }
      }
    );

    window.addEventListener("blur", () => this.setState({ focussed: false }));
    window.addEventListener("focus", () => this.setState({ focussed: true }));
  };

  componentWillReceiveProps = (nextProps) => {
    this.props.chatDetails &&
      this.state.focussed &&
      this.props.removeNotifications(this.props.chatDetails.id);

    if (this.props.hasJoined === false && nextProps.hasJoined === true) {
      this.getMsg();
    }
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    localStorage.setItem(
      this.props.chatDetails.id,
      JSON.stringify(this.state.message)
    );
  }

  getMsg = () => {
    // Get messages of chat
    this.props.getMessages(this.props.chatDetails.id);
    // Scroll to bottom of chat
    this.scrollToBottom();
  };

  scrollToBottom = () => {
    const scroll =
      this.messagesEndRef.current.scrollHeight -
      this.messagesEndRef.current.clientHeight;

    this.messagesEndRef.current.scrollTo(0, scroll);
  };

  changeHandler = (e) => {
    e.target.style.overflow = "hidden";
    e.target.style.height = 0;
    e.target.style.height = e.target.scrollHeight + "px";

    if (e.target.value.length <= 500) {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  keyPressHandler = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();

      this.createMessage();
    }
  };

  // Create a new message
  createMessage = () => {
    const newMsg = { chid: this.props.chatDetails.id, msg: this.state.message };

    // Check if message is empty
    if (newMsg.msg?.trim()) {
      this.props.writeMessage(newMsg);
      this.props.createNotification(
        newMsg,
        this.props.chatDetails.users,
        this.props.chatDetails.name
      );
      this.setState({ message: "" }, () => this.inputRef.current.focus());
    }
  };

  leaveChat = async () => {
    const { currentUser, chatDetails } = this.props;

    if (
      (await this.props.leaveChat(currentUser, chatDetails)) &&
      this.props.refreshChats
    ) {
      this.props.writeMessage({
        chid: this.props.chatDetails.id,
        msg: "User Left the Chat",
      });
      this.props.refreshChats();
      this.toggleLeave();
    }
  };

  addUserToChat = () => {
    const { chatDetails } = this.props;
    const { selectedUsers } = this.state;

    const selectedUserIDs = selectedUsers.map((u) => {
      return u.id;
    });

    this.props.joinChat(selectedUserIDs, chatDetails.id, chatDetails.users);

    let msgString = "";
    console.log(selectedUsers);

    if (selectedUsers.length === 1) {
      msgString = selectedUsers[0].data.sith_name;
    } else {
      msgString = "multiple users";
    }

    this.props.writeMessage({
      chid: this.props.chatDetails.id,
      msg: "Added " + msgString + " to the Chat",
    });
    this.toggleAddUser();
  };

  deleteChat = () => {};

  toggleAddUser = () => {
    this.setState({ addUserModal: !this.state.addUserModal });
  };

  toggleLeave = () => {
    this.setState({ leaveModal: !this.state.leaveModal });
  };

  // Search user by name and show results
  searchMember = (input) => {
    const allUsers = this.state.allUsers;

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

  render() {
    const { chatDetails, currentUser, hasJoined, chatMessages } = this.props;

    return (
      <div className="chat" key={chatDetails.id}>
        <div className="chat-menu">
          {chatDetails.users.length > 2 && chatDetails.name.length > 2 && (
            <>
              <MDBBtn color="amber" size="sm" onClick={this.toggleLeave}>
                Leave Chat
              </MDBBtn>
              <MDBBtn color="blue" size="sm" onClick={this.toggleAddUser}>
                Add user
              </MDBBtn>
            </>
          )}
        </div>
        <div className="chat-container" ref={this.messagesEndRef}>
          {hasJoined ? (
            <>
              {chatMessages &&
              chatMessages[chatDetails.id] &&
              this.state.allUsers &&
              chatMessages[chatDetails.id].length > 0 ? (
                <>
                  {chatMessages[chatDetails.id].map((item, i) => {
                    if (item.data.visible) {
                      return (
                        <MessageItem
                          msg={item.data.msg}
                          key={i}
                          mid={item.mid}
                          chid={chatDetails.id}
                          uid={currentUser}
                          read={item.data.read}
                          chatUsers={chatDetails.users}
                          timestamp={item.data.sentTimestamp}
                          reverse={
                            item.data.author?.uid === currentUser ? true : false
                          }
                          spacing={
                            i > 0
                              ? item.data.sentTimestamp - 300000 >
                                chatMessages[chatDetails.id][i - 1].data
                                  .sentTimestamp
                                ? true
                                : false
                              : true
                          }
                          author={
                            this.state.allUsers.filter(
                              (u) => u.id === item.data.author.uid
                            )[0]
                          }
                          focussed={this.state.focussed}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </>
              ) : (
                <>
                  {chatMessages &&
                  chatMessages[chatDetails.id] &&
                  this.state.allUsers ? (
                    <div className="text-center mt-5">
                      <MDBBadge pill className="mb-1" color="success">
                        Welcome to your new chat.
                      </MDBBadge>
                      <p className="text-muted small">
                        This service is provided for and by SithCult.
                      </p>
                      <p>There are no messages to show yet.</p>
                    </div>
                  ) : null}
                </>
              )}
            </>
          ) : (
            <div className="text-center mt-5">
              <MDBBadge pill className="mb-1" color="danger">
                You are not part of this chat.
              </MDBBadge>
              <p className="text-muted small">
                This service is provided for and by SithCult.
              </p>
              <p>All messages are hidden from you.</p>
            </div>
          )}
          <></>
        </div>
        <div className="send">
          <div className="d-flex align-items-center">
            <textarea
              type="text"
              className="form-control"
              name="message"
              value={this.state.message}
              onChange={this.changeHandler}
              onKeyDown={this.keyPressHandler}
              onKeyUp={this.keyPressHandler}
              ref={this.inputRef}
            />
            <MDBBtn
              color="blue"
              className="d-inline-flex"
              onClick={this.createMessage}
              disabled={!hasJoined || this.state.message === ""}
            >
              Send
            </MDBBtn>
          </div>
        </div>
        {this.state.leaveModal && (
          <MDBModal
            id="add-chat"
            size="md"
            isOpen={this.state.leaveModal}
            toggle={this.toggleLeave}
          >
            <MDBModalBody className="mb-0">
              <p className="font-weight-bold">Warning</p>
              <p className="">Do you really want to leave the chat?</p>
              {chatDetails.users.length > 1 ? (
                <MDBBtn color="amber" onClick={this.leaveChat}>
                  Yes
                </MDBBtn>
              ) : (
                <MDBBtn color="danger" onClick={this.deleteChat}>
                  Yes (Chat will be deleted)
                </MDBBtn>
              )}
              <MDBBtn color="blue" onClick={this.toggleLeave}>
                No
              </MDBBtn>
            </MDBModalBody>
          </MDBModal>
        )}

        {this.state.addUserModal && (
          <MDBModal
            id="add-chat"
            size="md"
            isOpen={this.state.addUserModal}
            toggle={this.toggleAddUser}
          >
            <MDBModalBody className="mb-0">
              <p className="font-weight-bold">Add users to chat</p>
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
              {this.state.selectedUsers.length > 0 && (
                <>
                  <MDBBtn
                    color="blue"
                    size="md"
                    className="m-0"
                    disabled={
                      [...this.state.selectedUsers, ...chatDetails.users]
                        .length >= 10
                    }
                    onClick={() => this.addUserToChat()}
                  >
                    Add users to chat
                  </MDBBtn>
                  {[...this.state.selectedUsers, ...chatDetails.users].length >=
                  10 ? (
                    <span className="d-block small text-muted mt-2">
                      You have reached the max. number of participant for your
                      group chat.
                    </span>
                  ) : (
                    <span className="d-block small text-muted mt-2">
                      You can add up to{" "}
                      {10 -
                        [...this.state.selectedUsers, ...chatDetails.users]
                          .length}{" "}
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
                onClick={this.toggleAddUser}
              >
                <MDBIcon icon="times" className="pr-2" />
                Cancel
              </MDBBtn>
            </MDBModalFooter>
          </MDBModal>
        )}
      </div>
    );
  }
}
//#endregion

//#region > PropTypes
Chat.propTypes = {
  chatDetails: PropTypes.object.isRequired,
  currentUser: PropTypes.string.isRequired,
  hasJoined: PropTypes.bool.isRequired,
};
//#endregion

//#region > Functions
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    chatMessages: state.chat.chatMessages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: (chid) => dispatch(getMessages(chid)),
    writeMessage: (msg) => dispatch(writeMessage(msg)),
    getAllUsers: () => dispatch(getAllUsers()),
    leaveChat: (uid, chatDetails) => dispatch(leaveChat(uid, chatDetails)),
    joinChat: (uid, chatDetails, curUsers) =>
      dispatch(joinChat(uid, chatDetails, curUsers)),
    stopGettingMessages: (chid) => dispatch(stopGettingMessages(chid)),
    createNotification: (details, recipients, chatName) =>
      dispatch(createNotification(details, recipients, chatName)),
    removeNotifications: (chid) => dispatch(removeNotifications(chid)),
  };
};
//#endregion

//#region > Exports
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
