//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Components
// Organisms
import { RegisterForm } from "../../organisms";

class HomePage extends React.Component {
	render() {
		return (
			<>
				<RegisterForm />
			</>
		);
	}
}

export default HomePage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
