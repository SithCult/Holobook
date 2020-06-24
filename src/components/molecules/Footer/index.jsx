//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Link } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBFooter, MDBRow, MDBCol, MDBContainer, MDBIcon } from "mdbreact";

//> Footer
import "./footer.scss";
//#endregion

//#region > Components
class Footer extends React.Component {
  render() {
    return (
      <MDBFooter color="sithcult-red" className="font-small pt-4 mt-4">
        <MDBContainer className="text-center text-md-left">
          <MDBRow>
            <MDBCol md="3">
              <h5 className="title">SithCult</h5>
              <p>
                SithCult is a worldwide Star Wars fan organization comprised of
                and operated by Star Wars fans.
              </p>
            </MDBCol>
            <MDBCol md="3">
              <h5 className="title">Public Services</h5>
              <ul>
                <Link to="/basic">
                  <li className="list-unstyled">Learn Imperial Basic</li>
                </Link>
              </ul>
            </MDBCol>
            <MDBCol md="3">
              <h5 className="title">Useful links</h5>
              <ul>
                <a
                  href="http://starwars.wikia.com/wiki/Main_Page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li className="list-unstyled">
                    Wookiepedia
                    <MDBIcon
                      icon="external-link-alt"
                      className="ml-1"
                      size="sm"
                    />
                  </li>
                </a>
                <a
                  href="https://www.501st.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li className="list-unstyled">
                    501st Legion
                    <MDBIcon
                      icon="external-link-alt"
                      className="ml-1"
                      size="sm"
                    />
                  </li>
                </a>
                <a
                  href="https://www.patreon.com/sithcult"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li className="list-unstyled">
                    Support us on Patreon
                    <MDBIcon
                      icon="external-link-alt"
                      className="ml-1"
                      size="sm"
                    />
                  </li>
                </a>
              </ul>
            </MDBCol>
            <MDBCol md="3">
              <h5 className="title">Contact</h5>
              <ul>
                <a href="mailto:center@sithcult.com">
                  <li className="list-unstyled">
                    center@sithcult.com
                    <MDBIcon
                      icon="external-link-alt"
                      className="ml-1"
                      size="sm"
                    />
                  </li>
                </a>
                <Link to="/about">
                  <li className="list-unstyled">About</li>
                </Link>
                <Link to="/privacy">
                  <li className="list-unstyled">Privacy</li>
                </Link>
              </ul>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <div className="footer-copyright text-center py-3">
          <MDBContainer>
            <p>
              SithCult is a worldwide Star Wars fan-club organization comprised
              of and operated by Star Wars fans. While it is not sponsored by
              Lucasfilm Ltd., it follows generally accepted ground rules for
              Star Wars fan groups. Star Wars, its characters, costumes, and all
              associated items are the intellectual property of Lucasfilm. © & ™
              Lucasfilm Ltd. All rights reserved.
            </p>
          </MDBContainer>
          <MDBContainer fluid>
            <div>
              &copy; {new Date().getFullYear()} Copyright: SithCult
              <p className="my-2 font-weight-bold">
                Made with
                <i
                  className="fas fa-heart pulse red-text ml-1 mr-1"
                  aria-hidden="true"
                ></i>
                by
                <a
                  href="https://www.aichner-christian.com"
                  target="_blank"
                  className="ml-1"
                  rel="noopener noreferrer"
                >
                  us
                </a>
                .
              </p>
            </div>
            <div className="">
              <small>
                Stable release
                {process.env.REACT_APP_VERSION && (
                  <>
                    <span className="pl-2 pr-2">·</span>
                    Version v{process.env.REACT_APP_VERSION}
                  </>
                )}
                <span className="pl-2 pr-2">·</span>
                <a
                  href="https://github.com/SithCult/Holobook"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MDBIcon fab icon="github" className="pr-2" />
                  View on GitHub
                </a>
                <span className="pl-2 pr-2">·</span>
                <a
                  href="https://github.com/SithCult/Holobook/issues/new?template=bug_report.md"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MDBIcon icon="bug" className="pr-2" />
                  Report bug
                </a>
              </small>
            </div>
          </MDBContainer>
        </div>
      </MDBFooter>
    );
  }
}
//#endregion

//#region > Exports
export default Footer;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
