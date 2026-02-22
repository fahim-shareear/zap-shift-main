import React, { useRef, useState } from 'react';
import { FaSearchLocation } from "react-icons/fa";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useLoaderData } from 'react-router';
import '../../../../node_modules/leaflet/dist/leaflet.css';

const Coverage = () => {
    const position = [23.8041, 90.4152]
    const serviceCenters = useLoaderData();
    const mapRef = useRef(null);
    const [search, setSearch] = useState("");

    const searchCity = e => {
        e.preventDefault();
        const location = search
        const district = serviceCenters.find(c => c.district.toLowerCase().
            includes(location.toLowerCase()));

        if(district){
            const coord = [district.latitude, district.longitude];
            mapRef.current.flyTo(coord, 14);
        };
    };

    const clearSearch = () => {
        // e.preventDefault();
        setSearch("");
    };

    return (
        <div className="md:max-w-4xl mx-auto rounded shadow-md p-5 m-5">
            <div className="max-w-2xl grow ml-3">
                <h1 className="font-bold md:text-4xl text-2xl text-primary">We are available in 64 districts</h1>
            </div>
            {/* search functionality ui */}
            <div className='flex items-center jsutify-center gap-4 m-5'>
                <div>
                    <form onSubmit={searchCity} className="flex items-center justify-center gap-4">
                        <div className="relative">
                            <input className="border border-gray-300 px-4 bg-gray-200 rounded-md py-1"
                                type="text"
                                name='location'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder='Search you nearest branch' />
                            <button type='button' className="text-[18px] font-bold text-primary absolute top-1 right-1 transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer"
                            onClick={clearSearch}>x</button>
                        </div>
                        <div>
                            <button className="font-bold text-2xl text-primary transition-all active:scale-95 active:shadow-inner cursor-pointer"><FaSearchLocation /></button>
                        </div>
                    </form>
                </div>

            </div>
            {/* Map view here */}
            <div className="md:max-w-4xl mx-auto max-w-3xl h-200 rounded-xl p-6">
                <MapContainer
                    center={position}
                    zoom={8}
                    scrollWheelZoom={false}
                    ref={mapRef}
                    className="w-full h-full rounded-xl m-5">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        serviceCenters.map((center, index) => <Marker position={[center.latitude, center.longitude]} key={index}>
                            <Popup>
                                <strong>District: {center.district}</strong> <br /> <strong>Service Area:</strong>  {center.covered_area.join(" ")}
                            </Popup>
                        </Marker>)
                    }
                </MapContainer>
            </div>
        </div>
    );
};

export default Coverage;