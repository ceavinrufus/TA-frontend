"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";

const CONFIG = {
  fallbackGPSCoordinates: { latitude: 52.3676, longitude: 4.9041 },
};
export interface MapDisplayComponentCreateListingProps {
  center?: number[] | null;
  isInteractive: boolean;
}

export default function MapdisplayComponentCreateListing(
  props: MapDisplayComponentCreateListingProps,
) {
  const center = props.center ?? [
    CONFIG.fallbackGPSCoordinates.longitude,
    CONFIG.fallbackGPSCoordinates.latitude,
  ];

  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapMarkers, _] = useState<mapboxgl.Marker[]>([]);

  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [center[0], center[1]],
      zoom: zoom,
      interactive: props.isInteractive,
    });

    // Add geolocate control to the map.
    // const geolocate = new mapboxgl.GeolocateControl({
    //     positionOptions: {
    //         enableHighAccuracy: true
    //     },
    //     // When active the map will receive updates to the device's location as it changes.
    //     trackUserLocation: true,
    //     // Draw an arrow next to the location dot to indicate which direction the device is heading.
    //     showUserHeading: true
    // });
    // map.current.addControl(geolocate);
    // geolocate.trigger();
  }, []);

  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (!props.center) {
      return;
    }

    mapMarkers.forEach((marker, _) => marker.remove());

    map.current?.flyTo({
      center: [props.center[0], props.center[1]],
      zoom: 13,
    });

    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([props.center[0], props.center[1]])
      .addTo(map.current);

    mapMarkers.push(marker);
  }, [props.center]);

  return (
    <div
      ref={mapContainer}
      className="rounded-[16px] w-full h-[284px] md:h-[389px]"
    ></div>
  );
}
