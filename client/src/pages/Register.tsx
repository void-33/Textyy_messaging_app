import { Link } from "react-router-dom";
import textyyLogo from "../assets/textyy.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 150 }, (_, i) => currentYear - i);

  const navigate = useNavigate();

  const [creds, setCreds] = useState({
    firstName: "",
    lastName: "",
    username:"",
    gender: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    birthday: {
      month: "",
      day: "",
      year: "",
    },
  });

  const handleCredsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "month" || name === "day" || name === "year") {
      setCreds({ ...creds, birthday: { ...creds.birthday, [name]: value } });
    } else {
      setCreds({ ...creds, [name]: value });
    }
  };

  const getBirthDay = () => {
    const { month, day, year } = creds.birthday;
    if (month && day && year) {
      return new Date(`${year}-${month}-${day}`);
    }
    return null;
  };

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const body = {
      ...creds,
      password: creds.confirmPassword,
      birthday: getBirthDay(),
    };
    try {
      const response = await axios.post(
        "http://localhost:3500/api/auth/register",
        body
      );
      if (response.data.success) {
        navigate("/login");
      } else {
        const toastId = toast(response.data.message, {
          action: {
            label: "Close",
            onClick: () => toast.dismiss(toastId),
          },
        });
      }
    } catch (err) {
      if(axios.isAxiosError(err)){
        const toastId = toast(err.response?.data.message, {
          action: {
            label: "Close",
            onClick: () => toast.dismiss(toastId),
          },
        });
      }
      //? error handling
    }
  };

  return (
    <>
      <div>
        <header>
          <img src={textyyLogo} alt="Textyy" />
        </header>
        <main>
          <h1>Create a new account</h1>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={creds.firstName}
              onChange={handleCredsChange}
              name="firstName"
              id="firstName"
              placeholder="First Name"
              required
            />
            <input
              type="text"
              value={creds.lastName}
              onChange={handleCredsChange}
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              required
            />
            <input
              type="text"
              value={creds.username}
              onChange={handleCredsChange}
              name="username"
              id="username"
              placeholder="Username"
              required
            />
            <h2>Birthday</h2>
            <select
              value={creds.birthday.month}
              onChange={handleCredsChange}
              name="month"
              id="month"
              required
            >
              <option value="" disabled={creds.birthday.month !== ""}>
                Select Month
              </option>
              {months.map((month, index) => {
                return (
                  <option value={month} key={index}>
                    {month}
                  </option>
                );
              })}
            </select>
            <select
              value={creds.birthday.day}
              onChange={handleCredsChange}
              name="day"
              id="day"
              required
            >
              <option value="" disabled={creds.birthday.day !== ""}>
                Select Day
              </option>
              {days.map((day) => {
                return (
                  <option key={day} value={day}>
                    {day}
                  </option>
                );
              })}
            </select>
            <select
              value={creds.birthday.year}
              onChange={handleCredsChange}
              name="year"
              id="year"
              required
            >
              <option value="" disabled={creds.birthday.year !== ""}>
                Select Year
              </option>
              {years.map((year, index) => {
                return (
                  <option key={index} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            <h2>Gender</h2>
            <label>
              Male
              <input
                type="radio"
                checked={creds.gender === "male"}
                onChange={handleCredsChange}
                name="gender"
                value="male"
                required
              />
            </label>
            <label>
              Female
              <input
                type="radio"
                checked={creds.gender === "female"}
                onChange={handleCredsChange}
                name="gender"
                value="female"
                required
              />
            </label>
            <label>
              others
              <input
                type="radio"
                checked={creds.gender === "others"}
                onChange={handleCredsChange}
                name="gender"
                value="others"
                required
              />
            </label>
            <br />
            <input
              type="text"
              value={creds.email}
              onChange={handleCredsChange}
              name="email"
              placeholder="Email"
            />
            <input
              type="password"
              value={creds.newPassword}
              onChange={handleCredsChange}
              name="newPassword"
              placeholder="New Password"
            />
            <input
              type="password"
              value={creds.confirmPassword}
              onChange={handleCredsChange}
              name="confirmPassword"
              placeholder="Confirm Password"
            />

            <button
              type="submit"
              className="w-max bg-yellow-400 rounded-md border-slate-700 border-2 text-slate-700 p-1"
            >
              Register
            </button>
            <Link to="/">Already have an account?</Link>
          </form>
        </main>
      </div>
    </>
  );
};
export default Register;
