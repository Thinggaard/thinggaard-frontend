import {Component} from 'react';

class Interval extends Component {

    state = {
        iterations: 0
    };

    i = null;

    componentDidMount() {
        const {callback, interval} = this.props;
        this.i = setInterval(() => {
            callback(this.state.iterations + 1);
            this.setState(prev => ({iterations: prev.iterations + 1}))
        }, interval);
    }

    componentWillUnmount() {
        clearInterval(this.i)
    }

    render() {
        return null
    }
}

export default Interval;
