"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";

const CONFIG = {
  fallbackGPSCoordinates: { latitude: 52.3676, longitude: 4.9041 },
};

export interface MapDisplayComponentEditListingProps {
  center?: number[] | null;
  isInteractive: boolean;
}

export default function MapDisplayComponentEditListing(
  props: MapDisplayComponentEditListingProps,
) {
  const center = props.center ?? [
    CONFIG.fallbackGPSCoordinates.longitude,
    CONFIG.fallbackGPSCoordinates.latitude,
  ];

  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<mapboxgl.Marker[]>([]);
  const [zoom] = useState(13);

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
  }, []);

  useEffect(() => {
    if (!map.current || !props.center) return;

    mapMarkers.forEach((marker) => marker.remove());
    map.current.flyTo({
      center: [props.center[0], props.center[1]],
      zoom: 13,
    });

    const marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([props.center[0], props.center[1]])
      .addTo(map.current);

    setMapMarkers([marker]);
  }, [props.center]);

  return (
    <div ref={mapContainer} className="rounded-[16px] w-full h-[169px]"></div>
  );
}
