import { LatLng } from "leaflet";
import { Mufts } from "../Mufts";
import { generateRandomLatLng } from "../testHelper";
import { Polylines } from "../Polylines";
import { Cubes } from "../Cubes";
import { Wardrobe } from "../Wardrobe";
export interface ITestInfoPoly {
    start: LatLng,
    end: LatLng,
    owner: string,
    to: string,
}
export interface ITestInfoCube {
    latlng: LatLng,
    owner: string,
    to: string
}
export class TestsHelper {
    static generateMuft() {
        const latlng = generateRandomLatLng();
        const muft = new Mufts(latlng).getMuft();
        return muft;
    }
    static generatePolyLine(info: ITestInfoPoly) {
        const line = new Polylines([info.start, info.end], { owner: info.owner, to: info.to }).getLine();
        return line;
    }
    static generateCube(info: ITestInfoCube) {
        const cube = new Cubes(info.latlng, { owner: info.owner, to: info.to }).getCub();
        return cube;
    }
    static generateWardrobe() {
        const latlng = generateRandomLatLng();
        const wardrobe = new Wardrobe(latlng).getWardrobe();
        return wardrobe;
    }
}