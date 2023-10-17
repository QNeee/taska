import { LatLng } from "leaflet";

export function generateRandomLatLng(): LatLng {
    const minLat = -90;
    const maxLat = 90;
    const minLng = -180;
    const maxLng = 180;

    const lat = Math.random() * (maxLat - minLat) + minLat;
    const lng = Math.random() * (maxLng - minLng) + minLng;

    return { lat, lng } as LatLng;
}