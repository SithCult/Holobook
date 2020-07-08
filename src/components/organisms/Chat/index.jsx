//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// React Prop Types
import PropTypes from "prop-types";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBBadge } from "mdbreact";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import {
  getMessages,
  writeMessage,
  stopGettingMessages,
} from "../../../store/actions/chatActions";
import { getAllUsers } from "../../../store/actions/userActions";

//> Components
import { MessageItem } from "../../molecules";

//> CSS
import "./chat.scss";
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
    };
  }

  componentDidMount = async () => {
    this.setState(
      {
        allUsers: this.props.allUsers
          ? this.props.allUsers
          : await this.props.getAllUsers(),
      },
      () => {
        // Check if user is part of chat
        if (this.props.hasJoined) {
          // Get messages of chat
          this.props.getMessages(this.props.chatDetails.id);

          // Scroll to bottom of chat
          this.scrollToBottom();
        }
      }
    );
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount = () => {
    // Stop getting messages for certain chat (close listener)
    this.props.stopGettingMessages(this.props.chatDetails.id);
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

      this.setState({ message: "" }, () => this.inputRef.current.focus());
    }
  };

  render() {
    const { chatDetails, currentUser, hasJoined, chatMessages } = this.props;

    return (
      <div className="chat" key={chatDetails.id}>
        <div className="chat-container" ref={this.messagesEndRef}>
          {hasJoined ? (
            <>
              {chatMessages &&
              this.state.allUsers &&
              chatMessages.length > 0 ? (
                <>
                  {chatMessages.map((item, i) => {
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
                                chatMessages[i - 1].data.sentTimestamp
                                ? true
                                : false
                              : true
                          }
                          author={
                            this.state.allUsers.filter(
                              (u) => u.id === item.data.author.uid
                            )[0]
                          }
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </>
              ) : (
                <>
                  {chatMessages && this.state.allUsers ? (
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
    chatMessages: state.chat.chatMessages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMessages: (chid) => dispatch(getMessages(chid)),
    writeMessage: (msg) => dispatch(writeMessage(msg)),
    getAllUsers: () => dispatch(getAllUsers()),
    stopGettingMessages: (chid) => dispatch(stopGettingMessages(chid)),
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
