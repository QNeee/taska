import L, { LatLng } from "leaflet";
import { ICustomMarker } from "../Mufts";
import { ICustomPolyline } from "../Polylines";
import { ICustomWardrobe } from "../Wardrobe";

export class MuftaInterface {
    static handleMouseOver(muft: ICustomMarker, polyLines: ICustomPolyline[], wardrobes?: ICustomWardrobe[]) {
        if (!wardrobes) {
            const polys = [...polyLines];
            polys.forEach((item) => {
                if (item.owner === muft.id) {
                    item.options.color = 'green';
                }
            })
            return polys;
        }
    }
    static handleMouseOut(id: string, polyLines: ICustomPolyline[], wardrobes?: ICustomWardrobe[]) {
        if (!wardrobes) {
            const polys = [...polyLines];
            polys.forEach((item) => {
                if (item.owner === id) {
                    item.options.color = 'red';
                }
            })
            return polys;
        }

    }


    static handleMarkerDrag(e: L.LeafletEvent, polyLines: ICustomPolyline[], muft: ICustomMarker, index: number, muftArr: ICustomMarker[]) {
        const latLngs = new L.LatLng(e.target.getLatLng().lat, e.target.getLatLng().lng);
        const newArr = [...polyLines];
        const muftsLatLng = muft.getLatLng();
        newArr.forEach((line, lineIndex) => {

            const startLine = line.getLatLngs()[0];
            const endLine = line.getLatLngs()[1];
            if (muftsLatLng.equals(startLine as LatLng)) {
                newArr[lineIndex].setLatLngs([latLngs, endLine as LatLng]);
            } else if (muftsLatLng.equals(endLine as LatLng)) {
                newArr[lineIndex].setLatLngs([startLine as LatLng, latLngs]);
            }
        });
        const newMufts = [...muftArr];
        newMufts.forEach((item, index) => {
            if (item.id === muft.id) {
                item.setLatLng(latLngs);
            }
        })
        const objToUpdate = {
            indexCircle: index,
            newArr,
            mufts: newMufts,
        }
        return objToUpdate;
    }


}