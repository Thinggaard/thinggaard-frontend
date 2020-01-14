import React from 'react';
import Select from 'react-select';


class CitySelect extends React.Component {

    state = {
        selectedOption: null,
        options: this.props.options,
    };

    handleChange = (selectedOption) => {
        this.setState({selectedOption});
        this.props.onChange(
            selectedOption ? selectedOption.value : null,
            selectedOption ? selectedOption.label : null,
        )
    };

    customStyles = {

        control: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(0,0,0,0)',
            border: "none",
            textAlign: "center",
            padding: "0"
        }),

        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? '#ffffff' : '#bbbbbb',
            backgroundColor: "#3f3f3f",
        }),

        singleValue: (provided) => ({
            ...provided,
            color: '#ffffff',
            width: "96%",
            textAlign: "center",
            textTransform: "uppercase",
            fontSize: "32px",
            fontWeight: "600",
        }),

        placeholder: (provided) => ({
            ...provided,
            color: "#bbbbbb",
            width: "96%",
            textAlign: "center",
            textTransform: "uppercase",
            fontSize: "32px",
            fontWeight: "600"
        }),

        dropdownIndicator: () => ({
            display: "none"
        }),

        indicatorSeparator: () => ({
            display: "none",
            width: "0"
        }),

        clearIndicator: () => ({
            color: "#ffffff",
            margin: "5px",
            height: "25px",
            width: "25px"
        }),

        input: (provided) => ({
            ...provided,
            color: "#ffffff",
            width: "96%",
            textAlign: "center",
            textTransform: "uppercase",
            fontSize: "32px",
            fontWeight: "600"
        }),

        menu: (provided) => ({
            ...provided,
            backgroundColor: "#3f3f3f",
        }),

    };

    render() {
        const {selectedOption, options} = this.state;

        return (
            <Select
                value={selectedOption}
                onChange={this.handleChange}
                isClearable={true}
                options={options}
                styles={this.customStyles}
                placeholder={"INDTAST BY"}
            />
        );
    }
}

export default CitySelect;