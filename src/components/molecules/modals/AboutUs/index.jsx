//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
  MDBIframe,
} from "mdbreact";

//> CSS
import "./aboutus.scss";

class ModalPage extends React.Component {
  state = {
    modal11: false,
  };

  toggle = (nr) => () => {
    let modalNumber = "modal" + nr;
    this.setState({
      [modalNumber]: !this.state[modalNumber],
    });
  };

  render() {
    return (
      <>
        <MDBBtn onClick={this.toggle(11)} color="danger">
          What is SithCult?
        </MDBBtn>
        <MDBModal
          id="youtube"
          size="lg"
          isOpen={this.state.modal11}
          toggle={this.toggle(11)}
        >
          <MDBModalBody className="mb-0 p-0">
            <div className="embed-responsive embed-responsive-16by9 z-depth-1-half">
              <MDBIframe src="https://www.youtube.com/embed/z_okR9xjTzg" />
            </div>
          </MDBModalBody>
          <MDBModalFooter className="justify-content-center text-dark">
            <span className="mr-4">Spread the word!</span>
            <a
              href="https://www.facebook.com/SithCult"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MDBBtn tag="a" size="sm" floating social="fb">
                <MDBIcon fab icon="facebook-f" />
              </MDBBtn>
            </a>
            <a
              href="https://twitter.com/SithCult"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MDBBtn tag="a" size="sm" floating social="tw">
                <MDBIcon fab icon="twitter" />
              </MDBBtn>
            </a>
            <a
              href="https://www.youtube.com/channel/UCfT8DgkL6NcyqafU5Y3Te9A?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MDBBtn tag="a" size="sm" floating social="yt">
                <MDBIcon fab icon="youtube" />
              </MDBBtn>
            </a>
            <a
              href="https://www.instagram.com/sithcult.international/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MDBBtn tag="a" size="sm" floating color="elegant">
                <MDBIcon fab icon="instagram" />
              </MDBBtn>
            </a>
            <MDBBtn
              color="danger"
              outline
              rounded
              size="md"
              className="ml-4"
              onClick={this.toggle(11)}
            >
              <MDBIcon icon="times" className="pr-2" />
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </>
    );
  }
}

export default ModalPage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
