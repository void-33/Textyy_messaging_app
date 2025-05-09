import {create} from 'zustand'

type AuthPageModeState = {
    value : 'logIn' | 'signUp';
    setValue: (val:'logIn'|'signUp')=>void;
}
const useAuthPageModeState = create<AuthPageModeState>((set)=>({
    value: 'logIn',
    setValue: (val:'logIn'|'signUp')=>{
        set({value:val})
    }
}))

export default useAuthPageModeState;