import React from "react";

const RegionUnavailable = ({regions, speakerName, switchToQuestion}) => {

    return (
        <div className="my-2">
            <h5 className={"text-warning"}>Beklager! </h5>
            <p>
                Produktet af typen <strong>appetizer</strong> er kun tilgængeligt i:<br/>
                {regions}
            </p>

            <button type={"button"} onClick={switchToQuestion} className="btn btn-outline-primary w-100">
                Skriv til {speakerName}
            </button>

        </div>
    );
}

export default RegionUnavailable;