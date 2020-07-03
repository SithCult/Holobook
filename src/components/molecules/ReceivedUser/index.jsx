//#region > Imports
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

//> CSS
import "./receiveduser.scss";
//#endregion

//#region > Components
class ReceivedUser extends React.Component {
  render() {
    const { receivedUser, name } = this.props;

    return (
      <MDBPopover
        placement="top"
        popover
        clickable
        domElement
        className="furtherInfo"
      >
        <div className="clickable name">{name}</div>
        <div>
          {receivedUser !== true && receivedUser !== undefined ? (
            <>
              {receivedUser !== false ? (
                <>
                  <MDBPopoverHeader className="flex-center">
                    <div>
                      {receivedUser.title + " " + receivedUser.sith_name}
                      <small className="d-block blue-text">
                        {receivedUser.department}
                      </small>
                    </div>
                    <div className="ml-auto p-2 mb-auto">
                      <small>
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
                                  <MDBIcon icon="award" className="pr-2" />
                                  Founder
                                </MDBBadge>
                              );
                            case "council":
                              return (
                                <MDBBadge pill color="red" key={i}>
                                  <MDBIcon icon="fire" className="pr-2" />
                                  Council
                                </MDBBadge>
                              );
                            case "hand":
                              return (
                                <MDBBadge pill color="secondary" key={i}>
                                  <MDBIcon fab icon="sith" className="pr-2" />
                                  Hand of the Emperor
                                </MDBBadge>
                              );
                            case "historic":
                              return (
                                <MDBBadge pill color="orange" key={i}>
                                  <MDBIcon icon="book" className="pr-2" />
                                  Historic
                                </MDBBadge>
                              );
                            case "moff":
                              return (
                                <MDBBadge pill color="info" key={i}>
                                  <MDBIcon icon="angle-up" className="pr-2" />
                                  Moff
                                </MDBBadge>
                              );
                            case "phase1":
                              return (
                                <MDBBadge pill color="amber" key={i}>
                                  <MDBIcon
                                    icon="dollar-sign"
                                    className="pr-2"
                                  />
                                  Phase 1 Contributor
                                </MDBBadge>
                              );
                            default:
                              return null;
                          }
                        });
                      })()}
                      <hr className="my-2" />
                      <div className="flex-center text-left my-2 text-white">
                        <ReactCountryFlag
                          svg
                          className="mr-2"
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
        </div>
      </MDBPopover>
    );
  }
}
//#endregion

//#region > Exports
export default ReceivedUser;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
