import React from "react";

function InputField({ type, placeholder, value, onChange }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="border p-2 w-full mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={value}
            onChange={onChange}
        />
    );
}

export default InputField;
