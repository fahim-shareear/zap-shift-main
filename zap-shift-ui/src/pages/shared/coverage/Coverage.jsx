import React, { useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, } from "react-leaflet";
import '../../../../node_modules/leaflet/dist/leaflet.css';
import { FaSearchLocation } from "react-icons/fa";
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const position = [23.8103, 90.4125];
    const serviceCenters = useLoaderData();
    const mapRef = useRef(null);
    // console.log(serviceCenters);
    const searchCity = e => {
        e.preventDefault();
        const location = e.target.location.value;
        const district = serviceCenters.find(c => c.district.toLowerCase()
        .includes(location.toLowerCase()));

        if(district){
            const coord = [district.latitude, district.longitude];
            // console.log(district, coord);
            mapRef.current.flyTo(coord, 14);
        };
    };


    return (
        <div className="rounded-xl shadow-md m-7 p-6">
            <div className="ml-4 mb-5">
                <h1 className="font-bold text-4xl text-primary">We are available in 64 districts</h1>
            </div>
            <div className="search ml-4">
                <div>
                    <form className="flex items-center gap-2" onSubmit={searchCity}>
                        <input type="text" name='location' className="text-xl px-5 py-2 border bg-gray-200 border-gray-400 rounded-xl" placeholder='search your location' />
                        <button className="text-3xl cursor-pointer"><FaSearchLocation /></button>
                    </form>
                </div>
            </div>

            {/* this is the map container starting */}
            <div className="md:max-w-4xl mx-auto max-w-3xl mb-5 h-200 rounded-xl">
                <MapContainer
                    center={position}
                    zoom={8}
                    scrollWheelZoom={true}
                    ref={mapRef}
                    className="w-full h-full rounded-xl m-5">
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
                    </TileLayer>
                    {
                        serviceCenters.map((center, index) => <Marker
                            key={index}
                            position={[center.latitude, center.longitude]}>
                            <Popup>
                                <strong>{center.city}</strong> <br /> <strong>Service Area:</strong> {center.covered_area.join(' ')}
                            </Popup>
                        </Marker>)
                    }
                </MapContainer>
            </div>
        </div>
    );
};

export default Coverage;