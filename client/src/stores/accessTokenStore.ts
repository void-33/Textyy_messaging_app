// let accessToken: string | null = null;

// const setAccessToken = (a: string) => {
//     accessToken = a;
// }
// const getAccessToken = ()=>{
//     return accessToken;
// }
// const clearAccessToken = ()=>{
//     accessToken = '';
// }

// export {setAccessToken,getAccessToken,clearAccessToken}

import { create } from "zustand";

interface AccessTokenState {
  accessToken: string;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  getAccessToken: () => string;
}

const useAccessTokenStore = create<AccessTokenState>((set,get) => ({
  accessToken: '',
  setAccessToken: (token: string) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: '' }),
  getAccessToken: () => get().accessToken,
}));

export default useAccessTokenStore;
