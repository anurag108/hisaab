const endpoint = "http://localhost:8080";

interface GetParams {
    name: string,
    value: any
}

export async function makePOSTCall(path: string, reqBody: any) {
    const url = endpoint + path;
    try {
        return await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody)
        });
    } catch (error) {
        console.log("Error making POST call", error);
        throw error;
    }
}

export async function makeGETCall(path: string, params: GetParams[]) {
    const urlParams = params.map((param) => param.name + "=" + param.value);
    const url = endpoint + "/" + path + "?" + urlParams;
    try {
        return await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.log("Error making GET call", error);
        throw error;
    }
}