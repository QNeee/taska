import React from "react"
import { IDataResults, changePosition } from "../../Redux/app/appSlice";
import { useDispatch } from 'react-redux';
import { AppDispatch } from "../../Redux/store";
interface IProps {
    results: IDataResults[];
}

export const SearchResult: React.FC<IProps> = ({ results }) => {
    const dispatch: AppDispatch = useDispatch();
    const onClickButton = (geo: { lat: number, lng: number }) => {
        dispatch(changePosition(geo));
    }
    return <div>
        {results.map((item, index) => <button key={index} type="button" onClick={() => onClickButton(item.geometry)}>
            {item.formatted}
        </button>)}
    </div>
}