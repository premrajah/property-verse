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

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY, // Your API key here.
    language: "en", // Default language for responses.
    region: "uk", // Default region for responses.
  });

  useEffect(() => {
    const fetchCoords = async () => {
      const res = await fromAddress(
        `${property.data.location.city} ${property.data.location.county} ${property.data.location.postcode}`
      );

      const { lat, lng } = res.results[0].geometry.location;

      setLat(lat);
      setLng(lng);
      setViewport({
        ...viewport,
        latitude: lat,
        longitude: lng,
      });
      setLoading(false);
    };
    fetchCoords();
  }, []);

  if (loading) {
    return <Spinner loading={loading} />;
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
