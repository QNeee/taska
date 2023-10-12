import { LatLng } from "leaflet";

export interface IVector {
    start: LatLng,
    end: LatLng
    length?: number,
    id?: string,
}
export class Vector {
    vector: IVector | IVector[] | null = null;
    constructor(obj: IVector | IVector[]) {
        if (Array.isArray(obj)) {
            this.vector = obj;
        } else {
            this.vector = { start: obj.start, end: obj.end, id: obj.id };
        }
    }
    getVector() {
        return this.vector;
    }
}