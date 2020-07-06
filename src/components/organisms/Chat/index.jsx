//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// React Prop Types
import PropTypes from "prop-types";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBInput, MDBIcon } from "mdbreact";

//> Components
import { MessageItem } from "../../molecules";

//> CSS
import "./chat.scss";
//#endregion

//#region > Components
class Chat extends React.Component {
  render() {
    const { chid, name, users, messages, currentUser } = this.props;

    console.log(chid, name, users, messages);

    return (
      <div className="chat" key={chid}>
        <div className="chat-container">
          {messages &&
            messages.map((item, i) => {
              console.log(item.author.uid, currentUser);
              if (item.visible) {
                return (
                  <MessageItem
                    msg={item.msg}
                    mid={item.mid}
                    author={item.author}
                    read={item.read}
                    reverse={item.author?.uid === currentUser ? true : false}
                  />
                );
              } else {
                return null;
              }
            })}
        </div>
        <div className="send">
          <div className="d-flex align-items-center">
            <textarea type="text" className="form-control" />
            <MDBBtn color="blue" className="d-inline-flex">
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
  chid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  users: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  currentUser: PropTypes.string.isRequired,
};
//#endregion

//#region > Exports
export default Chat;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
