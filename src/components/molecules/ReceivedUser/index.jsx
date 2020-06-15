//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional
// Flags for countries
import ReactCountryFlag from "react-country-flag";
// Country name by country code
import { getName } from "country-list";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBadge,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBSpinner,
  MDBIcon,
} from "mdbreact";

class ReceivedUser extends React.Component {
  handlePopoverChange = (open) => {
    if (!open) {
      this.props.clearUser();
    }
  };

  render() {
    const { receivedUser, author } = this.props;
    return (
      <MDBPopover
        placement="top"
        popover
        clickable
        domElement
        className="furtherInfo"
        onChange={this.handlePopoverChange}
      >
        <div
          className="clickable name"
          onClick={() => this.props.getUser(author.uid)}
        >
          {author.title} {author.name}
        </div>
        {receivedUser !== true && receivedUser !== undefined ? (
          <>
            {receivedUser !== false ? (
              <>
                <MDBPopoverHeader className="flex-center">
                  <div>
                    {receivedUser.title + " " + receivedUser.sith_name}
                    <small className="text-muted d-block blue-text">
                      {receivedUser.department}
                    </small>
                  </div>
                  <div className="ml-auto p-2 mb-auto">
                    <small className="text-muted">
                      <MDBIcon icon="medal" className="purple-text mr-1" />
                      {receivedUser.reputation}
                    </small>
                  </div>
                </MDBPopoverHeader>
                <MDBPopoverBody>
                  <div>
                    {(() => {
                      return receivedUser.badges.map((badge, i) => {
                        switch (badge) {
                          case "founder":
                            return (
                              <MDBBadge pill color="elegant-color" key={i}>
                                <MDBIcon icon="fire" className="pr-2" />
                                Founder
                              </MDBBadge>
                            );
                          case "member":
                            return (
                              <MDBBadge pill color="red" key={i}>
                                <MDBIcon icon="user" className="pr-2" />
                                Council
                              </MDBBadge>
                            );
                          case "historic":
                            return (
                              <MDBBadge pill color="orange" key={i}>
                                <MDBIcon icon="book" className="pr-2" />
                                Historic
                              </MDBBadge>
                            );
                          default:
                            return null;
                        }
                      });
                    })()}
                    <div className="flex-center text-left my-2">
                      <ReactCountryFlag
                        svg
                        className="mr-1"
                        countryCode={receivedUser.address.country}
                      />
                      {getName(receivedUser.address.country)}
                    </div>
                  </div>
                </MDBPopoverBody>
              </>
            ) : (
              <>
                <MDBPopoverHeader>
                  <div>User not found</div>
                </MDBPopoverHeader>
                <MDBPopoverBody>
                  This person is no longer a member of SithCult.
                </MDBPopoverBody>
              </>
            )}
          </>
        ) : (
          <MDBPopoverBody className="text-center">
            <div>
              <MDBSpinner />
            </div>
            <div>Receiving current status</div>
          </MDBPopoverBody>
        )}
      </MDBPopover>
    );
  }
}

export default ReceivedUser;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
