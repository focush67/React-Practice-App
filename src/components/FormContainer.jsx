import React from "react";

export default function FormContainer({ title, onSubmit, children, footer }) {
    const isLogin = title.toLowerCase() === "login";
    const buttonColor = isLogin ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600";

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="shadow-md p-6 rounded-lg w-full max-w-md border border-gray-300 dark:border-gray-700 transition-all">
                <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    {children}
                    <button
                        type="submit"
                        className={`p-3 w-full rounded-md font-medium text-white transition duration-200 ${buttonColor}`}
                    >
                        {title}
                    </button>
                </form>
                {footer && <div className="mt-3 text-center text-sm">{footer}</div>}
            </div>
        </div>
    );
}
