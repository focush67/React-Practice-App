import { useEffect } from "react";

const useServiceWorker = () => {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => console.log("✅ Service Worker Registered", reg))
                .catch((err) => console.log("❌ Service Worker Error", err));
        }
    }, []);
};

export default useServiceWorker;
