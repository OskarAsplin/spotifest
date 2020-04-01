import 'whatwg-fetch'

export function erDev(): boolean {
    const url = window.location.href;
    return (url.indexOf("localhost:3000") > 0 || url.indexOf("localhost:3001") > 0);
}

export function getApiBaseUrl(): string {
    if (erDev()) {
        return "http://127.0.0.1:8000/onTour";
    } else {
        return getAbsoluteApiUrl() + "onTour"
    }
}

/**
 * Resolves API URL in a pathname independent way
 */
function getAbsoluteApiUrl() {
    return window.location.pathname
}

enum RequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export enum REST_STATUS {
    OK = "OK",
    FEILET = "FEILET",
    PENDING = "PENDING",
    INITIALISERT = "INITIALISERT"
}

const getHeaders = (): Headers => {
    const headersRecord: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*"
    };
    return new Headers(headersRecord)
};

export const serverRequest = (method: string, urlPath: string, body: string|null) => {
    const OPTIONS: RequestInit = {
        headers: getHeaders(),
        method,
        body: body ? body : null
    };

    return new Promise((resolve, reject) => {
        fetch(urlPath, OPTIONS)
            .then((response: Response) => {
                sjekkStatuskode(response);
                const jsonResponse = toJson(response);
                resolve(jsonResponse);
            })
            .catch((reason: any) => reject(reason));
    });
};

export function toJson<T>(response: Response): Promise<T> {
    if (response.status === 204) {
        return response.text() as Promise<any>;
    }
    return response.json();
}

function sjekkStatuskode(response: Response) {
    if (response.status === 401){
        console.warn("Bruker er ikke logget inn.");
        return response;
    }
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    throw new Error(response.statusText);
}


export function fetchToJson(urlPath: string) {
    return serverRequest(RequestMethod.GET, urlPath, null);
}

export function fetchPut(urlPath: string, body: string) {
    return serverRequest(RequestMethod.PUT, urlPath, body);
}

export function fetchPost(urlPath: string, body: string) {
    return serverRequest(RequestMethod.POST, urlPath, body);
}

export function fetchDelete(urlPath: string) {
    const OPTIONS: RequestInit = {
        headers: getHeaders(),
        method: RequestMethod.DELETE
    };
    return fetch(getApiBaseUrl() + urlPath, OPTIONS).then(sjekkStatuskode);
}
