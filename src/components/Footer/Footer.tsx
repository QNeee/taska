import { useState } from "react"
import { useDispatch } from 'react-redux';
import { AppDispatch } from "../../Redux/store";
import { changeDrawItem } from "../../Redux/app/appSlice";

export const Footer = () => {
    const [edit, setEdit] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    return <div><button onClick={() => { setEdit(!edit); dispatch(changeDrawItem('')) }} type="button">edit</button>
        <button type="button">clear</button>
        {edit ? <div>
            chose
            <button onClick={() => dispatch(changeDrawItem('line'))} type="button">line</button>
            <button onClick={() => dispatch(changeDrawItem('circle'))} type="button">circle</button>
        </div> : null}
    </div>
}