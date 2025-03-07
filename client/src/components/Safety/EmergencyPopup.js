import React from 'react';

const EmergencyPopup = ({ message, mapImage, overlayText, instructions }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Emergency Alert!</h2>
                <p className="text-gray-700 mb-4">{message}</p>

                <div className="relative mb-4">
                    <img
                        src={mapImage}
                        alt="Emergency Area Map"
                        className="w-full h-auto rounded-lg"
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 bg-opacity-80 text-white px-4 py-2 rounded-lg font-bold">
                        {overlayText}
                    </div>
                </div>

                <div className="text-left">
                    <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
                    <p className="text-gray-700">{instructions}</p>
                </div>

                <button
                    onClick={() => alert('Acknowledged!')}
                    className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                    Acknowledge
                </button>
            </div>
        </div>
    );
};

export default EmergencyPopup;