import React, {Component} from "react";
import ReactPixel from "react-facebook-pixel";

export default function asyncComponent(importComponent) {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null
            };
        }

        async componentDidMount() {
            const {default: component} = await importComponent();

            this.setState({
                component: component
            });
        }

        render(x) {
            const C = this.state.component;
            !! C && ReactPixel.pageView();

            return C ? <C {...this.props} /> : null;
        }
    }

    return AsyncComponent;
}
