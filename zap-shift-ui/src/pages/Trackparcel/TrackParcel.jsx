import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';
import useAxios from '../../hooks/useAxios';

const TrackParcel = () => {
    const { trackingId } = useParams();
    const axiosInstance = useAxios();

    const { data: trackings = [] } = useQuery({
        queryKey: ['trackings', trackingId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/trackings/${trackingId}/logs`);
            // console.log(res.data);
            return res.data;
        }
    })

    return (
        <div className="mt-30 rounded-md bg-white shadow-xl md:max-w-7xl mx-auto my-5 p-5">
            <h1 className="font-bold text-2xl">Track your package: {trackingId}</h1>
            <h2>History so far: {trackings.length}</h2>
            <div>
                <ul className="timeline timeline-vertical">
                    {
                        trackings.map((log) => <li key={log._id}>
                            <div className="timeline-start">{log.createdAt}</div>
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
                            <div className="timeline-end timeline-box capitalize font-bold text-[18px]">{log.details}</div>
                            <hr />
                        </li>)
                    }

                </ul>
            </div>
        </div>
    );
};

export default TrackParcel;