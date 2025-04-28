let accessToken: string | null = null;

const setAccessToken = (a: string) => {
    accessToken = a;
}
const getAccessToken = ()=>{
    return accessToken;
}

export {setAccessToken,getAccessToken}