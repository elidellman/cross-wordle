async function callApi(
    url: string,
    options?: RequestInit
){
    try{
        const response = await fetch(url, options);
        if(!response.ok){
            console.log("HTTP error" + response.statusText);
        }
        const data = await response.json();
        return data;
    }catch(e){
        console.error(e);
    }
    return null;
}

export {callApi}