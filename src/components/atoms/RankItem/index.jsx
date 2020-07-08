//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// React Prop Types
import PropTypes from "prop-types";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBIcon,
} from "mdbreact";

//> CSS
import "./rankitem.scss";
//#endregion

//#region > Components
class RankItem extends React.Component {
  getRank = (rank) => {
    switch (rank) {
      case "hand":
        return <MDBIcon fab icon="sith" className="purple-text" />;
      case "moff":
        return <MDBIcon icon="angle-up" className="blue-text" />;
      case "grandmoff":
        return <MDBIcon icon="angle-double-up" className="blue-text" />;
      default:
        return null;
    }
  };

  render() {
    const { rank } = this.props;

    return (
      <MDBPopover
        placement="bottom"
        popover
        clickable
        domElement
        className="rankInfo"
      >
        <div className="clickable name d-inline ml-1">{this.getRank(rank)}</div>
        <div>
          <MDBPopoverHeader className="flex-center">
            <div className="text-dark basic hand">Rank information</div>
          </MDBPopoverHeader>
          <MDBPopoverBody>
            <div>
              {(() => {
                switch (rank) {
                  case "hand":
                    return (
                      <div>
                        <p className="lead font-weight-bold mb-0">
                          Hand of the Emperor
                        </p>
                        <p className="mb-2 basic">Hand of the Emperor</p>
                        <p className="text-muted mb-1">
                          The Hand of the Emperor is the enforcer of our
                          Emperor's commands and visions. The highest political
                          power within SithCult.
                        </p>
                      </div>
                    );
                  case "moff":
                    return (
                      <div>
                        <p className="lead font-weight-bold mb-0">Moff</p>
                        <p className="mb-2 basic">Moff</p>
                        <p className="text-muted mb-1">
                          A moff is the representative of a cluster (country)
                          and has the sole power over all members in this area.
                          He directly reports to the Grandmoffs in his area.
                        </p>
                      </div>
                    );
                  case "grandmoff":
                    return (
                      <div>
                        <p className="lead font-weight-bold mb-0">Grandmoff</p>
                        <p className="mb-2 basic">Grandmoff</p>
                        <p className="text-muted mb-1">
                          A Grandmoff is the representative of a network of
                          clusters. He has the sole power over all members in
                          this area and commands Moffs. He directly reports to
                          the Dark Council.
                        </p>
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          </MDBPopoverBody>
        </div>
      </MDBPopover>
    );
  }
}
//#endregion

//#region > PropTypes
RankItem.propTypes = {
  rank: PropTypes.string.isRequired,
};
//#endregion

//#region > Exports
export default RankItem;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
