// File created : 24-04-2019 13:58
import React, {Component} from 'react';
import Chip from "@material-ui/core/Chip";

class ChipSelector extends Component {

    handleSelect = (x) => {
        const {
            selected, choices, updateSelection, customFieldToggle = () => {
            }
        } = this.props;
        if (selected.includes(x)) {
            const newlist = selected.filter(occasion => (
                occasion !== x
            ));
            updateSelection(newlist);
            if (x === choices.length - 1) customFieldToggle(false);
        } else {
            updateSelection(selected.concat([x]));
            if (x === choices.length - 1) customFieldToggle(true);
        }
    };

    render() {
        const {choices, selected} = this.props;
        return (
            <>
                {
                    choices.map((choice, i) => (
                        <Chip
                            className={`${selected.includes(choice) ? "bg-success text-light" : "bg-secondary"} p-2 mr-2 mb-2`}
                            key={i} label={choice}
                            onClick={() => {this.handleSelect(choice)}}
                        />
                    ))
                }
            </>
        );
    }
}

export default ChipSelector;
