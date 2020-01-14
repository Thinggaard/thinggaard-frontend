import {Component} from 'react';

export default class extends Component {

    resizeCallback = () => {
        this.props.callback();
    };

    componentDidMount() {
        window.addEventListener("resize", this.resizeCallback);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeCallback);
    }

    render() {
        return null
    }
}
