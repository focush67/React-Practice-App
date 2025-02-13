import React from "react";

const InputField = React.memo(({ type = "text", label, placeholder, value = "", onChange, ...rest }) => {
    return (
        <div className="mb-2">
            {label && <label className="block mb-1">{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-2"
                value={value}
                onChange={onChange}
                {...rest}
            />
        </div>
    );
});

export default InputField;
