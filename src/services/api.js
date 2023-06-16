const apiUrl =
    import.meta.env.VITE_API_URL

export async function sendRequest(path, method, body) {
    const options = {
        method: method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "any-name"
        },
        body: JSON.stringify(body)
    }
    return fetch(apiUrl + path, options)
}

export function sendGetRequest(path) {
    return fetch(apiUrl + path)
}