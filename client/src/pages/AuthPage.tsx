import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuthPageModeState from "@/stores/authPageModeStore";

const AuthPage = () => {
  const value = useAuthPageModeState((state) => state.value);
  const setValue = useAuthPageModeState((state) => state.setValue);

  // /?auth=signUp
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Tabs value={value} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 h-10">
          <TabsTrigger
            value="logIn"
            className="hover:cursor-pointer"
            onClick={() => setValue("logIn")}
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="signUp"
            className="hover:cursor-pointer"
            onClick={() => setValue("signUp")}
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        <Login />
        <Signup />
      </Tabs>
    </div>
  );
};

export default AuthPage;
