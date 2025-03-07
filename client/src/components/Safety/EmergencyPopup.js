import React from 'react';

const EmergencyPopup = ({ message, overlayText, instructions, onClose, emergencyLevel }) => {
    // Function to determine chip styles based on emergency level
    const getChipStyles = (level) => {
        switch (level) {
            case 'HIGH':
                return 'bg-red-500 text-white';
            case 'MEDIUM':
                return 'bg-yellow-500 text-white';
            case 'LOW':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl max-h-[90vh] overflow-y-auto text-center">
                {/* Emergency Level Chip (Top-Right Corner) */}
                <div
                    className={`fixed top-4 right-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getChipStyles(
                        emergencyLevel
                    )} z-50`}
                >
                    {emergencyLevel}
                </div>

                <h2 className="text-3xl font-bold text-red-600 mb-6">Emergency Alert!</h2>
                <p className="text-gray-700 text-lg mb-6">{message}</p>

                <div className="relative mb-6">
                    <img
                        src={"/images/map_with_pin.png"}
                        alt="Emergency Area Map"
                        className="w-full h-auto rounded-lg"
                    />
                    <div
                        className="absolute top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 bg-opacity-80 text-white px-4 py-2 rounded-lg font-bold text-xl"
                    >
                        {overlayText}
                    </div>
                </div>

                <div className="text-left flex items-center space-x-4">
                    <h3 className="text-2xl font-semibold">Instructions:</h3>
                    <p className="text-gray-700 text-lg">{instructions}</p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-8 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors text-lg"
                >
                    Acknowledge
                </button>
            </div>
        </div>
    );
};

export default EmergencyPopup;