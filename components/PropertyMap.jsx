"use client";
import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl";
import { setDefaults, fromAddress } from "react-geocode";
import Spinner from "./Spinner";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });

  const [loading, setLoading] = useState(true);
  const [geoCodeError, setGeoCodeError] = useState(false);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY, // Your API key here.
    language: "en", // Default language for responses.
    region: "uk", // Default region for responses.
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          `${property.data.location.city} ${property.data.location.county} ${property.data.location.postcode}`
        );

        // check for results
        if (res.results.length === 0) {
          // no results found
          setGeoCodeError(true);
          setLoading(false);
        }

        const { lat, lng } = res.results[0].geometry.location;

        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
        setLoading(false);
      } catch (error) {
        console.log("fetch geo coords error ", error);
        setGeoCodeError(true);
        setLoading(false);
      }
    };
    fetchCoords();
  }, [property.data.location.city, property.data.location.county, property.data.location.postcode, viewport]);

  if (loading) {
    return <Spinner loading={loading} />;
  }

  //   Handle geo code error
  if (geoCodeError) {
    return <div className='text-xl'>No location data found</div>;
  }

  return (
    !loading && (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}
        mapLib={import("mapbox-gl")}
        initialViewState={{ latitude: lat, longitude: lng, zoom: 16 }}
        style={{ width: "100%", height: 500 }}
        mapStyle='mapbox://styles/mapbox/streets-v9'>
        <Marker longitude={lng} latitude={lat} anchor='bottom'></Marker>
      </Map>
    )
  );
};

export default PropertyMap;
