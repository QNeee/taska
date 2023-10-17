import L from "leaflet";
import { LatLng } from "leaflet";
import { v4 as uuidv4 } from 'uuid';
export interface ICustomWardrobe extends L.Marker {
    id?: string,
    drag?: boolean;
    type?: string;
}

const iconUrl = 'https://feshmebel.com.ua/image/cache/wp/gj/Doros/Shaf%20raspashnoj/Promo%203/shkaf-dlya-odezhdy-promo-3-1-1000x1000.webp';
export class Wardrobe {
    wardrobe: ICustomWardrobe | null = null;
    constructor(private latLng: LatLng) {
        this.wardrobe = new L.Marker(latLng, { icon: L.icon({ iconUrl: iconUrl, iconSize: [50, 50] }) })
        this.wardrobe.id = uuidv4();
        this.wardrobe.drag = true;
        this.wardrobe.type = 'wardrobe';
    }
    getWardrobe() {
        return this.wardrobe;
    }
}