import L, { LatLng } from "leaflet";
import { ICustomPolyline } from "../Polylines";
import { ICustomWardrobe } from "../Wardrobe";



export class WardrobeInterface {

    static handleWardrobeDrag(e: L.LeafletEvent, polyLines: ICustomPolyline[], wardrobe: ICustomWardrobe, index: number, wardrobes: ICustomWardrobe[]) {
        const latLngs = new L.LatLng(e.target.getLatLng().lat, e.target.getLatLng().lng);
        const newArr = [...polyLines];
        const muftsLatLng = wardrobe.getLatLng();
        const fibers = wardrobe.fibers;
        newArr.forEach((line, lineIndex) => {
            const startLine = line.getLatLngs()[0];
            const endLine = line.getLatLngs()[1];
            if (muftsLatLng.equals(startLine as LatLng)) {
                newArr[lineIndex].setLatLngs([latLngs, endLine as LatLng]);
            } else if (muftsLatLng.equals(endLine as LatLng)) {
                newArr[lineIndex].setLatLngs([startLine as LatLng, latLngs]);
            }
        });
        fibers?.forEach((item, indexItem) => {
            const startLine = item.getLatLngs()[0];
            const endLine = item.getLatLngs()[1];
            if (muftsLatLng.equals(startLine as LatLng)) {
                fibers[indexItem].setLatLngs([latLngs, endLine as LatLng]);
            } else if (muftsLatLng.equals(endLine as LatLng)) {
                fibers[indexItem].setLatLngs([startLine as LatLng, latLngs]);
            }
        })
        const newWardrobes = [...wardrobes];
        newWardrobes.forEach((item) => {
            if (item.id === wardrobe.id) {
                item.setLatLng(latLngs);
            }
        })
        const objToUpdate = {
            indexCircle: index,
            newArr,
            wardrobes: newWardrobes,
        }
        return objToUpdate;

    }
}