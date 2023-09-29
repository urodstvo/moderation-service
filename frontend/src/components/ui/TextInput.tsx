const TextInput = ({placeholder, validated = false, name} : {name: string, placeholder: string, validated?: boolean}) => {
    return (
        <>
        <div className="input-container">
            <div className="input-content">
                <input type="text" placeholder=" " required name={name}/>
                <div className="input-placeholder" placeholder={placeholder}></div>
            </div>
            {validated && <div className="input-validation-text">
                validate info like as A-Z, a-z, 0-9, _+*- and maybe e.t.c.
            </div> }
        </div>
        </>
    );
};

export default TextInput;