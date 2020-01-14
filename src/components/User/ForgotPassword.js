import TextInput from "../Form/GravityForm/TextInput";
import React, {useState} from "react";


const ForgotPassword = () => {

    const [username, setUsername] = useState("");

    return(
        <form style={{maxWidth: 800}} className="row" onSubmit={ e => {
            e.preventDefault();
        }}>
            <TextInput className={"col-12"} field={{type: "text", label: "Brugernavn/Email", visibility:"visible", isRequired:true}} onChange={setUsername}/>
            <div className="form-group col-12 w-100">
                <button className="btn btn-success form-control" type="submit">Gendan adgangskode</button>
            </div>
        </form>
    );
};

export default ForgotPassword;
