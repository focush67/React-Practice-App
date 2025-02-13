const useNotifications = () => {
    const requestNotificationPermission = () => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    };

    return { requestNotificationPermission };
};

export default useNotifications;
