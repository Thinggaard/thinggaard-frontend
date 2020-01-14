// File created : 13-08-2019 14:14
import {Component} from 'react';

class KeyPressListener extends Component {

    state = {
        counter: 0
    };

    onKey = e => {
        this.props.callback(e, this.state.counter + 1);
        this.setState(prev => ({counter: prev.counter + 1}))
    };

    componentDidMount() {
        const {type = "keydown"} = this.props;
        window.addEventListener(type, this.onKey);
    }

    componentWillUnmount() {
        const {type = "keydown"} = this.props;
        window.removeEventListener(type, this.onKey);
    }

    render() {
        return null
    }
}

export default KeyPressListener;
