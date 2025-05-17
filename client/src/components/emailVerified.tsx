import axios from "axios";
import { useEffect, useRef, useState } from "react";

const EmailVerified = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(false);

  const hasRun = useRef(false);


  useEffect(() => {
    if(hasRun.current) return;
    hasRun.current = true;
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setMessage("Verification token missing.");
      setError(true);
      return;
    }

 const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:3500/api/auth/verify-email?token=${token}`);

        if (res.data.success) {
          setMessage(res.data.message || "Email verified successfully! You can now close this");
          setError(false);
          sessionStorage.removeItem('EmailResendToken');
        } else {
          setMessage("Verification failed. Please try again.");
          setError(true);
        }
      } catch (err:any) {
        // If backend sends error with text in response.data
        if (axios.isAxiosError(err)) {
          setMessage(err.response?.data.message);
        } else {
          setMessage("An error occurred. Please try again later.");
        }
        setError(true);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>{error ? "❌ Verification Failed" : "✅ Verification Success"}</h2>
      <p>{message}</p>
    </div>
  );
};

export default EmailVerified;
