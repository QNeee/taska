import L, { LatLng } from 'leaflet';
import { v4 as uuidv4 } from 'uuid';

export interface IFiberOptic extends L.Polyline {
    color?: string,
    owner?: string,
    id?: string,
    riska?: number,
    to?: string,
    lineId?: string,
}
export interface IObjFiberOptic {
    owner: string;
    to: string;
    latlng: LatLng[];
    lineId: string,
}
export class FiberOptic {
    fiberOptic: IFiberOptic | null;

    constructor(private obj: IObjFiberOptic) {
        this.fiberOptic = new L.Polyline(obj.latlng, {
            weight: 4
        });
        this.fiberOptic.id = uuidv4();
        this.fiberOptic.owner = obj.owner;
        this.fiberOptic.to = obj.to;
        this.fiberOptic.lineId = obj.lineId;
    }
    getFiberOptic() {
        return this.fiberOptic;
    }
    static getFiberOpticInfo(latlng: LatLng[], owner: string, to: string, lineId: string) {
        return { latlng, owner, to, lineId };
    }
}