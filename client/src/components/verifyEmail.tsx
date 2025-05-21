import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import axios from "axios";
import useToast from "../hooks/useToast";

const COOLDOWN_SECONDS = 60;

const VerifyEmail = () => {
  const [seconds, setSeconds] = useState(COOLDOWN_SECONDS);
  const token = sessionStorage.getItem("EmailResendToken");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toast = useToast();

  const startCountDown = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetCountDown = () => {
    setSeconds(COOLDOWN_SECONDS);
    startCountDown();
  };

  const formattedTime = `0:${seconds < 10 ? "0" : ""}${seconds}`;

  useEffect(() => {
    startCountDown();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const sendVerification = async () => {
    if (seconds > 0) return;
    try {
      const response = await axios.post(
        "http://localhost:3500/api/auth/send-verification-email",
        { token }
      );
      if (response.data.success) {
        toast(response.data.message);
        resetCountDown();
        // navigate("/", { replace: true });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) toast(err.response.data.message);
        else toast("Server is down");
      } else {
        if (err instanceof Error) toast(err.message);
        else toast("An unknown Error Occured");
      }
    }
  };

  return (
    <div className="flex min-h-[100vh] justify-center items-center">
      <Card className="w-100 py-10">
        <CardHeader>
          <CardTitle className="text-xl">Send Verification Email</CardTitle>
          <CardDescription>
            Click on verify email button on the email to verify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={sendVerification} disabled={seconds > 0}>
            Resend email
          </Button>
          <span className="ml-5">{formattedTime}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
