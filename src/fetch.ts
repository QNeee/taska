const API_KEY = 'fc92d8affb5747bd983580fa3e91618b';
export async function getSearchByName(name: string) {
    try {
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(name)}&key=${API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Помилка запиту:', error);
        throw error;
    }
}
export async function getSearchByStreet(name: string) {
    try {
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(name)}&key=${API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Помилка запиту:', error);
        throw error;
    }
}
export async function getSearchByCord(lat: string, lng: string) {
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                return data.results[0];
            } else {
                return null;
            }
        })
        .catch(error => {
            console.error('Помилка запиту:', error);
        });
}