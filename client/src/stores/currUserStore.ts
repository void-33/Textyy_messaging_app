import {create} from 'zustand'

type CurrUserStateType = {
    userId: string;
    username: string;
    setUserId: (id:string)=>void;
    setUsername: (name:string)=>void;
}

const useCurrUserState = create<CurrUserStateType>((set)=>({
    userId: '',
    username:'',
    setUserId: (id:string)=>{
        set({userId:id});
    },
    setUsername: (name:string)=>{
        set({username:name});
    }
}))

export default useCurrUserState;