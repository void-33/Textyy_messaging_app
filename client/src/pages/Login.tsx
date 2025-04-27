import React, { useRef, useState, useEffect } from 'react'
import textyyLogo from '../assets/textyy.png'
import owl from '../assets/owl.png'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAccessToken } from '../utilities/accessToken';
import { useAuth } from '../contexts/authContext';

//interface for credentials state
interface Credentials {
    email: string,
    password: string,
}
const Login: React.FC = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    //state for credentials
    const [creds, setCreds] = useState<Credentials>({ email: '', password: '' });

    //refs for label elements
    const emailLabel = useRef<HTMLLabelElement>(null);
    const passwordLabel = useRef<HTMLLabelElement>(null);

    //function to update label position based on input
    const updateLabel = (ref: React.RefObject<HTMLLabelElement>, value: string): void => {
        if (value) {
            ref.current?.classList.add('-translate-y-5', 'scale-75', 'z-50', 'bg-slate-100', 'hover:cursor-default');
        } else {
            ref.current?.classList.remove('-translate-y-5', 'scale-75', 'z-50', 'bg-slate-100', 'hover:cursor-default');
        }
    }

    //useEffect to update label positions
    useEffect(() => { updateLabel(emailLabel, creds.email) }, [creds.email])
    useEffect(() => { updateLabel(passwordLabel, creds.password) }, [creds.password])


    //handle input change for credentials
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreds({ ...creds, [e.target.name]: e.target.value });
    }

    //function to navigate to register component
    const goToRegister = (): void => {
        navigate('/register');
    }

    //handle form submission
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        //! rest of the logic  
        const body = {
            email: creds.email,
            password: creds.password,
        }
        try {
            const response = await axios.post('http://localhost:3500/api/auth/login', body,
                { withCredentials: true }
            )
            if (response.data.success) {
                //? snackbar to show success message

                setCreds({ email: '', password: '' })

                setAccessToken(response.data?.accessToken);
                login();
                navigate('/dashboard');
            }else{
                alert(response.data.message);
            }
        }
        catch (err) {
            if(axios.isAxiosError(err)){
                alert(err.response?.data.message);
            }
            //? snackbar to show error message
        }
    }

    return (
        <div className='flex flex-col items-center gap-10 mt-10 min-w-[960px]'>
            {/* logo */}
            <img src={owl} width={75} />

            <div className='overflow-auto min-w-[1020px]'>

                <div className='flex flex-rows flex-wrap gap-20 items-center mx-20 p-4 justify-center min-w-[244px] '>
                    {/* header */}
                    <header className='flex-grow'>
                        <img src={textyyLogo} />
                        <h1 className='text-3xl font-mono'>Connect with friends</h1>
                    </header>

                    {/* main login section */}
                    <main className='flex-grow flex flex-col items-start justify-start bg-slate-50 rounded-md p-4 shadow-lg shadow-gray-600'>
                        <form onSubmit={handleSubmit} className='w-full text-blue-800 text-xl'>

                            {/* email field */}
                            <div className='rounded-md h-11 mb-3 border-2 focus-within:border-blue-600 group relative w-full'>
                                <label htmlFor="emailArea" ref={emailLabel} className='text-blue-500 rounded-md top-2 left-1 transition-all ease-in absolute group-focus-within:-translate-y-5 group-focus-within:scale-75 group-focus-within:z-50 group-focus-within:bg-slate-100 group-focus-within:hover:cursor-default hover:cursor-text'>Email</label>
                                <input type="email" value={creds.email} name='email' id='emailArea' onChange={handleInputChange} required className='bg-slate-100 rounded-md focus:outline-none w-full h-full px-2 text-lg' />
                            </div>

                            {/* password field */}
                            <div className='rounded-md h-11 mb-3 border-2 focus-within:border-blue-600 group relative w-full'>
                                <label htmlFor="passwordArea" ref={passwordLabel} className='text-blue-500 rounded-md top-2 left-1 transition-all ease-in absolute group-focus-within:-translate-y-5 group-focus-within:scale-75 group-focus-within:z-50 group-focus-within:bg-slate-100 group-focus-within:hover:cursor-default hover:cursor-text'>Password</label>
                                <input type="password" value={creds.password} name='password' id='passwordArea' onChange={handleInputChange} required className='bg-slate-100 rounded-md focus:outline-none w-full h-full px-2 text-lg' />
                            </div>

                            {/* login button */}
                            <div>
                                <button type="submit" className='h-11 w-full mb-3 bg-blue-600 rounded-md text-white text-xl font-semibold'> Log In</button>
                            </div>

                            {/* forgot password link */}
                            <Link to='/' className='inline-block w-full text-center text-sm'>Forgot password?</Link>

                            <hr className='my-4 border-gray-400' />

                            {/* Button to Register new user */}
                            <div className='w-full text-center'>
                                <button type='button' onClick={goToRegister} className='w-max bg-yellow-400 rounded-md border-slate-700 border-2 text-slate-700 p-1'>Create New Account</button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Login