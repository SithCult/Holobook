//> Firebase
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

// Import secret credentials
import config from "./fbConfig.js";

// Init Firebase
firebase.initializeApp(config);

// Init analytics
if (config.measurementId) {
  firebase.analytics();
}

// timestampsInSnapshots: true already enabled by default
firebase.firestore();

export default firebase;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
