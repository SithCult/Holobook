//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBFooter,
    MDBRow,
    MDBCol,
    MDBContainer,
} from 'mdbreact';

class Footer extends React.Component{
    render(){
        return(
            <MDBFooter color="sithcult-red" className="font-small pt-4 mt-4">
                <MDBContainer className="text-center text-md-left">
                    <MDBRow>
                    <MDBCol md="6">
                        <h5 className="title">SithCult</h5>
                        <p>
                        SithCult is a worldwide Star Wars fan organization 
                        comprised of and operated by Star Wars fans.
                        </p>
                    </MDBCol>
                    <MDBCol md="3">
                        <h5 className="title">Useful links</h5>
                        <ul>
                        <li className="list-unstyled">
                            <a 
                            href="http://starwars.wikia.com/wiki/Main_Page"
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            Wookiepedia
                            </a>
                        </li>
                        <li className="list-unstyled">
                            <a 
                            href="https://www.501st.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            501st Legion
                            </a>
                        </li>
                        <li className="list-unstyled">
                            <a 
                            href="https://www.patreon.com/sithcult"
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            Support of on Patreon
                            </a>
                        </li>
                        </ul>
                    </MDBCol>
                    <MDBCol md="3">
                        <h5 className="title">Contact</h5>
                        <ul>
                        <li className="list-unstyled">
                            <a href="mailto:center@sithcult.com">center@sithcult.com</a>
                        </li>
                        </ul>
                    </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <div className="footer-copyright text-center py-3">
                    <MDBContainer>
                    <p>SithCult is a worldwide Star Wars fan-club organization comprised of 
                    and operated by Star Wars fans. While it is not sponsored by Lucasfilm Ltd., 
                    it it follows generally accepted ground rules for Star Wars fan groups. Star 
                    Wars, its characters, costumes, and all associated items are the intellectual 
                    property of Lucasfilm. © & ™ Lucasfilm Ltd. All rights reserved.</p>
                    </MDBContainer>
                    <MDBContainer fluid>
                        &copy; {new Date().getFullYear()} Copyright: SithCult
                    </MDBContainer>
                </div>
            </MDBFooter>
        );
    }
}

export default Footer;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
