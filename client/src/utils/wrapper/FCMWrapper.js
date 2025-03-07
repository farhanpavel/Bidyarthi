// components/FCMWrapper.js
"use client"; // Mark as a Client Component
import React, {useEffect, useContext, useState} from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from "@/utils/firebase/firebase";
import useFcmToken from "@/utils/hooks/useFcmToken";
import { toast, ToastContainer } from "react-toastify";
import {MessageContext} from "@/utils/context/MessageContext";
import {url} from "@/components/Url/page";
import EmergencyPopup from "@/components/Safety/EmergencyPopup";
import Cookies from "js-cookie";
import {useNotificationModalStore} from "@/components/Notification/store";
import NotificationModal from "@/components/Notification/NotificationModal";

export function subscribeTokenToTopic(token, topic) {
    fetch(`${url}/api/user/subscribe-to-topic`, {
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

export function unsubscribeTokenFromTopic(token, topic) {
    fetch(`${url}/api/user/unsubscribe-from-topic`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, topic })
    }).then(response => {
        if (response.status < 200 || response.status >= 400) {
            throw 'Error unsubscribing from topic: ' + response.status + ' - ' + response.text();
        }
        console.log('Unsubscribed from "' + topic + '"');
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
    const { setMessage } = useContext(MessageContext);
    const { isNotificationModalOpen, closeNotificationModal } =
        useNotificationModalStore();

    // State for emergency popup
    const [isEmergencyPopupVisible, setIsEmergencyPopupVisible] = useState(false);
    const [emergencyData, setEmergencyData] = useState({
        message: '',
        overlayText: '',
        instructions: ''
    });

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
            subscribeTokenToTopic(fcmToken, 'emergency');
            subscribeTokenToTopic(fcmToken, 'announcement');
            subscribeTokenToTopic(fcmToken, 'panic');
        }
    }, [fcmToken]);

    // Handle foreground messages
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground push notification received:', payload);
                setMessage(payload); // Broadcast the message

                if (payload.notification) {
                    let showNotification = true;
                    if(payload.data){
                        if (payload.data.topic){
                            if(payload.data.topic==='emergency'){
                                const role = Cookies.get('role');
                                if (role !== 'student')
                                showNotification = false;
                            }else if (payload.data.topic==='announcement'){
                                const role = Cookies.get('role');
                                if(role!=='student')
                                showNotification = false;
                            }else if (payload.data.topic==='panic') {
                                const role = Cookies.get('role');
                                if (role !== 'admin')
                                    showNotification = false;
                            }
                        }
                    }
                    if(showNotification)
                        toast.success(
                            <div>
                                <strong>{payload.notification.title}</strong>
                                <p>{payload.notification.body}</p>
                            </div>,
                            {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            }
                        );
                    else {
                        console.log('Notification not shown for not matching role');
                    }
                }
                if(payload.data){
                    if (payload.data.topic){
                        if (payload.data.topic==='emergency'){
                            const role = Cookies.get('role');
                            console.log(role)
                             if (role === 'student'){
                                    setEmergencyData({
                                        message: payload.data.message || `Emergency on ${payload.data.location || 'Campus Emergency Alert!'}`,
                                        overlayText: payload.data.location || 'Emergency Area',
                                        instructions: payload.data.message || 'Please follow the instructions from the authorities.',
                                        emergencyLevel: payload.data.emergencyLevel || "MEDIUM"
                                    })
                                setIsEmergencyPopupVisible(true)
                            }
                        }
                    }
                }
                else {
                    console.log('No notification received');
                }
            });
            return () => {
                unsubscribe(); // Unsubscribe from the onMessage event
            };
        }
    }, [setMessage]);

    return <>
        <ToastContainer />
        <NotificationModal
            isOpen={isNotificationModalOpen}
            onClose={closeNotificationModal}
        />
        {isEmergencyPopupVisible && (
            <EmergencyPopup
                message={emergencyData.message}
                overlayText={emergencyData.overlayText}
                instructions={emergencyData.instructions}
                onClose={() => setIsEmergencyPopupVisible(false)}
            />
        )}
        {children}
    </>;
};

export default FCMWrapper;