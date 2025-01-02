import { Link } from "react-router-dom";
import textyyLogo from "../assets/textyy.png"

const Register = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 150 }, (_, i) => currentYear - i);

    return (
        <>
            <div>
                <header>
                    <img src={textyyLogo} alt="Textyy" />
                </header>
                <main>
                    <h1>Create a new account</h1>
                    <form>
                        <input type="text" name="firstName" id="firstName" placeholder="First Name" required />
                        <input type="text" name="lastName" id="lastName" placeholder="Last Name" required />
                        <h2>Birthday</h2>
                        <select name="month" id="month" required>
                            {
                                months.map((month, index) => {
                                    return (
                                        <option value={index + 1} key={index}>{month}</option>
                                    )
                                })
                            }
                        </select>
                        <select name="day" id="day" required>
                            {days.map((day) => {
                                return (
                                    <option key={day} value={day}>{day}</option>
                                )
                            })
                            }
                        </select>
                        <select name="year" id="year" required>
                            {years.map((year, index) => {
                                return (
                                    <option key={index} value={index + 1}>{year}</option>
                                )
                            })
                            }
                        </select>
                        <h2>Gender</h2>
                        <label>
                            Male
                            <input type="radio" name="gender" value="male" required />
                        </label>
                        <label>
                            Female
                            <input type="radio" name="gender" value="female" required />
                        </label>
                        <label>
                            others
                            <input type="radio" name="gender" value="others" required />
                        </label>
                        <br />
                        <input type="text" placeholder="Email" />
                        <input type="password" name="newPassword" placeholder="New Password" />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" />

                        <button type='button' className='w-max bg-yellow-400 rounded-md border-slate-700 border-2 text-slate-700 p-1'>Create New Account</button>
                        <Link to='/'>Already have an account?</Link>
                    </form>
                </main>
            </div>
        </>
    )
}
export default Register;