import React, {Component} from 'react';
import "../Form.css";
import "./RadioButton.css"

export default class FormCheckBoxes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            field: props.field,
            onChange: props.onChange,
            className: props.className,
            status: props.status,
            size: "medium",
            chosenValue: -1,
        }
    }

    sizeClass = () => {
        switch (this.state.size) {
            case "small" :
                return "col-12 col-md-6 col-lg-4";
            case "medium" :
                return "col-12 col-lg-6";
            default : //large
                return "col-12";
        }
    };

    changeValue(i, params) {
        this.setState({chosenValue: i}, () => this.props.onChange(i, params));
    }

    render() {
        return (
            <div
                className={`form-group ${this.sizeClass()} ${this.state.field.cssClass} ${this.state.field.visibility !== "visible" || this.state.field.type === "hidden" ? "d-none" : ""}`}>
                <label>
                    {this.state.field.label} {this.state.field.isRequired && <span className="text-danger">*</span>}
                </label>
                {
                    this.state.field.choices.map((choice, i) => (
                        <div className="input-group radio-button-group mb-2" key={i}>
                            <input type="radio" value={choice.value} checked={this.props.selected === choice.value}
                                   onChange={e => this.props.onChange(e.target.value)}/>
                            {choice.value}
                        </div>
                    ))
                }
                <small className="form-text text-muted">{this.state.field.description}</small>
            </div>

        );
    }
};
