import { v4 as uuidv4 } from 'uuid';
import { deleteCircle, makeDrawCircle } from './Redux/app/appSlice';

export interface IMuftaData {
    id?: string;
    lat: number;
    lng: number;
    type?: string;
}

export class Mufta {
    static add(obj: IMuftaData, dispatch: Function) {
        const newMufta = {
            id: uuidv4(),
            lat: obj.lat,
            lng: obj.lng,
            type: 'mufta'
        }

        dispatch(makeDrawCircle(newMufta));
    }
    static deleteMufta(index: number, polyIndexes: number[], dispatch: Function) {
        dispatch(deleteCircle({ index: index, polyIndexes: polyIndexes }));
    }
}