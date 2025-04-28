let accessToken: string | null = null;

const setAccessToken = (a: string) => {
    accessToken = a;
}
const getAccessToken = ()=>{
    return accessToken;
}
const clearAccessToken = ()=>{
    accessToken = '';
}

export {setAccessToken,getAccessToken,clearAccessToken}