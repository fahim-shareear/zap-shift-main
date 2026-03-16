import React from 'react';

const ErrorElement = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            {/* Visual Section */}
            <div className="relative w-full max-w-md mb-8">
                {/* 404 Text Background */}
                <h1 className="text-[12rem] font-black text-gray-200 select-none">
                    404
                </h1>
                
                {/* Delivery Guy Illustration Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                        src="https://illustrations.popsy.co/gray/delivery-boy-on-a-moped.svg" 
                        alt="Confused delivery person" 
                        className="w-64 h-64 object-contain"
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    "Wait... this isn't Main Street."
                </h2>
                <p className="text-gray-600 mb-8">
                    Our delivery driver took a wrong turn and ended up at a dead end. 
                    The page you’re looking for has been moved, deleted, or eaten.
                </p>

                {/* Navigation Options */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-3 bg-secondary hover:bg-secondary text-white font-semibold rounded-full transition-all cursor-pointer shadow-lg shadow-[#d1f076]"
                    >
                        Back to the main path
                    </button>
                    <button 
                        onClick={() => window.history.back()}
                        className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 hover:border-[#d1f076] hover:text-[#d1f076] cursor-pointer font-semibold rounded-full transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>

            {/* Subtle Support Link */}
            <p className="mt-12 text-sm text-gray-400">
                Still lost? <a href="/support" className="underline hover:text-orange-500">Contact our dispatchers</a>.
            </p>
        </div>
    );
};

export default ErrorElement;