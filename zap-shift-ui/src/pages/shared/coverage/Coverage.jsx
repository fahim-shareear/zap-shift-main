import React from 'react';
import { MapContainer, Marker, Popup, TileLayer, } from "react-leaflet";
import '../../../../node_modules/leaflet/dist/leaflet.css';
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const position = [23.8103, 90.4125];
    const serviceCenters = useLoaderData();
    // console.log(serviceCenters);


    return (
        <div className="rounded-xl shadow-md m-7">
            <div className="ml-4 mb-5">
                <h1 className="font-bold text-4xl text-primary">We are available in 64 districts</h1>
            </div>
            <div className="search">

            </div>

            {/* this is the map container starting */}
            <div className="md:max-w-4xl mx-auto max-w-3xl mb-5 h-200 rounded-xl">
                <MapContainer
                    center={position}
                    zoom={8}
                    scrollWheelZoom={true}
                    className="w-full h-full rounded-xl m-5">
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
                    </TileLayer>
                    {
                        serviceCenters.map((center, index) => <Marker
                            key={index}
                            position={[center.latitude, center.longitude]}>
                            <Popup>
                                {center.covered_area} <br /> {center.region}
                            </Popup>
                        </Marker>)
                    }
                </MapContainer>
            </div>
        </div>
    );
};

export default Coverage;