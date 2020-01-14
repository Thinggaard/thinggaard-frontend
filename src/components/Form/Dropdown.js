// File created : 12-04-2019 12:32
import React from 'react';
import './Dropdown.css';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const Dropdown = (
    {
        selected,
        onChange,
        placeholder = "vælg",
        selectedClass = "",
        className = "",
        options = [],
    }) => {

    return (
        <div className={"w-100"}>
            <Select
                className={"w-100 text-center"}
                value={selected}
                onChange={(e) => {
                    onChange({value: e.target.value, label: e.target.name})
                }}
                displayEmpty
                inputProps={{
                    name: 'select',
                }}
                classes={{
                    root: selectedClass,
                    select: selectedClass + " my-0 border-0",
                    selectMenu: 'grey-select ' + className,
                }}
                MenuProps={{PopoverClasses: {paper: "grey-select"}}}
            >
                <MenuItem key={placeholder} value={-1} disabled selected={selected === -1}>
                    {placeholder}
                </MenuItem>
                {
                    options.map((option, i) => (
                        <MenuItem
                            name={option.label} key={i} value={option.value}
                            className={option.itemClass ? option.itemClass : ""}
                            selected={option.value === selected}
                        >
                            {option.label ? option.label : option.value}
                        </MenuItem>
                    ))
                }
            </Select>
        </div>

    );
};

export default Dropdown;
