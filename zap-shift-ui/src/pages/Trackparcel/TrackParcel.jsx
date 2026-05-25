import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const TrackParcel = () => {
    const { trackingId } = useParams();
    const [trackings, setTrackings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return {
            date: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        };
    };

    useEffect(() => {
        const eventSource = new EventSource(
            `http://localhost:3000/trackings/${trackingId}/stream`
        );

        eventSource.onopen = () => {
            // console.log('SSE connection opened');
            setIsLoading(false);
            setError(null);
        };

        eventSource.onmessage = (event) => {
            try {
                // ✅ Ignore heartbeat
                if (event.data.startsWith(':')) return;
                
                const data = JSON.parse(event.data);
                
                // ✅ Handle errors
                if (data.error) {
                    setError(data.error);
                    return;
                }

                // ✅ Set initial array or append new updates
                if (Array.isArray(data)) {
                    setTrackings(data);
                } else {
                    setTrackings(prev => {
                        const exists = prev.some(t => t._id === data._id);
                        return exists ? prev : [...prev, data];
                    });
                }
            } catch (e) {
                console.error('Parse error:', e);
            }
        };

        eventSource.onerror = () => {
            setError('Connection error');
            eventSource.close();
        };

        return () => eventSource.close();
    }, [trackingId]);

    if (isLoading) {
        return <div className="text-center py-10 text-primary">Tracking Information........</div>
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Error loading tracking data.</div>
    }

    return (
        <div className="w-full">
            <div className='md:max-w-7xl mx-auto mt-30 rounded-xl shadow-xl py-10 mb-5'>
                <h1 className="font-bold text-3xl px-5 text-primary">Tracking parcel History for: {trackingId}</h1>
                <div className="md:max-w-4xl mx-auto py-5">
                    {
                        trackings.length === 0 ?
                            (<h1 className="font-bold text-primary text-center">No Tracking Updates Available</h1>)
                            :
                            <ul className="timeline timeline-vertical">
                                {
                                    trackings.map(track => {
                                        const { date, time } = formatDate(track.createdAt);
                                        return (
                                            <li key={track._id}>
                                                <div className="timeline-start flex flex-col">
                                                    <span className="font-bold text-primary text-xl">{date}</span>
                                                    <span className="text-primary text-[18px]">{time}</span>
                                                </div>
                                                <div className="timeline-middle">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="h-5 w-5"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="timeline-end timeline-box capitalize text-primary font-semibold text-xl">{track.details}</div>
                                                <hr />
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                    }
                </div>
            </div>
        </div>
    );
};

export default TrackParcel;