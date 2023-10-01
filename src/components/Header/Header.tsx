import { useState } from "react"
import { AppDispatch } from "../../Redux/store";
import { useDispatch, useSelector } from 'react-redux';
import { fetchByCord, fetchByName } from "../../Redux/app/appOperations";
import { getDataResults } from "../../Redux/app/appSelectors";
import { SearchResult } from "./SaerchResult";

export const Header = () => {
    const dispatch: AppDispatch = useDispatch();
    const dataResults = useSelector(getDataResults);
    const [selectedOption, setSelectedOption] = useState('');
    const [cordForm, setCordForm] = useState({ lat: '', long: '' });
    const [nameForm, setNameForm] = useState('');
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedOption !== 'coordinates') {
            setNameForm(e.target.value);
        } else {
            const { id, value } = e.target;
            setCordForm(prev => ({
                ...prev,
                [id]: value,
            }));
        }
    };
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOption === 'coordinates') {
            const newArr = [];
            newArr.push(cordForm.lat, cordForm.long)
            dispatch(fetchByCord(newArr));
        } else {
            dispatch(fetchByName(nameForm));
        }
    }
    return <header>
        <form onSubmit={onSubmit}>
            <select value={selectedOption} onChange={handleSelectChange}>
                <option value="name">Назва Міста</option>
                <option value="street">Вулиця</option>
                <option value="coordinates">Координати</option>
            </select>
            {selectedOption === 'coordinates' ? <div>
                <input type="text" value={cordForm.lat} id="lat" placeholder="lat" onChange={handleInputChange} />
                <input type="text" value={cordForm.long} id="long" placeholder="long" onChange={handleInputChange} />
            </div> : <input type="text" id="searchInput" onChange={handleInputChange} value={nameForm} />
            }
            <button type="submit">Пошук</button>
        </form>
        {dataResults && dataResults.length > 0 ? <SearchResult results={dataResults} /> : null}
    </header>
}