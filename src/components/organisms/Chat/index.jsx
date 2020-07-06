//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// React Prop Types
import PropTypes from "prop-types";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBInput, MDBIcon } from "mdbreact";

//> Redux
// Connect
import { connect } from "react-redux";
// Actions
import { getMessages, writeMessage } from "../../../store/actions/chatActions";

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

    // State
    this.state = {
      message: "",
    };
  }

  componentDidMount() {
    this.props.getMessages(this.props.chatDetails.id);

    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const scroll =
      this.messagesEndRef.current.scrollHeight -
      this.messagesEndRef.current.clientHeight;

    console.log(scroll);

    this.messagesEndRef.current.scrollTo(0, scroll);
  };

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // Create a new message
  createMessage = () => {
    const newMsg = { chid: this.props.chatDetails.id, msg: this.state.message };

    // Check if message is empty
    if (newMsg.msg) {
      this.props.writeMessage(newMsg);

      this.setState({ message: "" });
    }
  };

  render() {
    const { chatDetails, currentUser, hasJoined } = this.props;

    return (
      <div className="chat" key={chatDetails.id}>
        <div className="chat-container" ref={this.messagesEndRef}>
          {this.props.chatMessages &&
            this.props.chatMessages.map((item, i) => {
              if (item.data.visible) {
                return (
                  <MessageItem
                    msg={item.data.msg}
                    key={i}
                    mid={item.id}
                    read={item.data.read}
                    timestamp={item.data.sentTimestamp}
                    reverse={
                      item.data.author?.uid === currentUser ? true : false
                    }
                    author={
                      this.props.users.filter(
                        (u) => u.id === item.data.author.uid
                      )[0]
                    }
                  />
                );
              } else {
                return null;
              }
            })}
        </div>
        <div className="send">
          <div className="d-flex align-items-center">
            <textarea
              type="text"
              className="form-control"
              name="message"
              value={this.state?.message}
              onChange={this.changeHandler}
            />
            <MDBBtn
              color="blue"
              className="d-inline-flex"
              onClick={this.createMessage}
              disabled={!hasJoined}
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
