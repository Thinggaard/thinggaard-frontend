import React from "react";

const MultiButtonSelect = ({
   choices, selected, setSelected, idKey, titleKey, btnClass = "btn-outline-light", selectedClass = "btn-light"
}) => {

    const toggleSelection = (id) => {
        id = id+"";
        if (selected.includes(id)) setSelected(p => p.filter(x => x !== id));
        else setSelected(p => [...p, id]);
    };

    return (
        <>
            {choices.map((x, i) => {

                const isSelected = selected.includes(x[idKey]+"");

                return (
                    <button
                        onClick={() => toggleSelection(x[idKey])}
                        key={i}
                        className={"multi-button btn mr-3 mb-3 " + (isSelected ? selectedClass : btnClass)}
                    >
                        {x[titleKey]}
                    </button>
                )

            })}
        </>
    )
};

export default MultiButtonSelect;
