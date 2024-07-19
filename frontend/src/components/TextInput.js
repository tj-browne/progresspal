import React from "react";

const TextInput = ({name, onChange, label, type}) => {
    return (
        <div className="flex flex-col mb-2">
            <label className="text-white mt-1 mb-2">{label}</label>
            <input
                className="rounded-2xl h-9 p-3"
                type={type}
                name={name}
                onChange={onChange}
                required
            />
        </div>
    );
}

export default TextInput;