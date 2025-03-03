// components/FCMWrapper.js
"use client"; // Mark as a Client Component
import React, { useEffect } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from "@/utils/firebase/firebase";
import useFcmToken from "@/utils/hooks/useFcmToken";
import {toast, ToastContainer} from "react-toastify";

function subscribeTokenToTopic(token, topic) {
    fetch('http://localhost:4000/api/user/subscribe-to-topic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, topic })
    }).then(response => {
        if (response.status < 200 || response.status >= 400) {
            throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
        }
        console.log('Subscribed to "' + topic + '"');
    }).catch(error => {
        console.error(error);
    });
}

const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        } else {
            console.log('Notification permission denied.');
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
};

const FCMWrapper = ({ children }) => {
    const { fcmToken, notificationPermissionStatus } = useFcmToken();

    // Request notification permission
    useEffect(() => {
        requestNotificationPermission().then(r => console.log(r));
    }, []);

    // Log the FCM token
    useEffect(() => {
        if (fcmToken) {
            console.log('FCM token:', fcmToken);
            // Subscribe to a topic
            subscribeTokenToTopic(fcmToken, 'all');
        }
    }, [fcmToken]);

    // Handle foreground messages
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground push notification received:', payload);
                // Handle the received push notification while the app is in the foreground
                // You can display a notification or update the UI based on the payload
                toast.success(
                    <div>
                        <strong>{payload.notification.title}</strong>
                        <p>{payload.notification.body}</p>
                    </div>
                    , {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
            return () => {
                unsubscribe(); // Unsubscribe from the onMessage event
            };
        }
    }, []);

    return <>
        <ToastContainer />
        {children}
    </>;
};

export default FCMWrapper;