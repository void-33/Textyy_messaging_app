import { useCallback, useState } from "react"

const useToggle = (initial=false):[boolean,()=>void]=>{
    const [state,setState] = useState<boolean>(initial);
    const toggle = useCallback(()=>setState(prev=>!prev),[]);

    return [state,toggle];
}

export default useToggle;