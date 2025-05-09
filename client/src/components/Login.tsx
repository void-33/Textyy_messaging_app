import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { TabsContent } from "./ui/tabs";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import useAccessTokenStore from "@/stores/accessTokenStore";
import useCurrUserState from "@/stores/currUserStore";
import useToast from "./ui/Toast";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);
  const setUserId = useCurrUserState((state)=>state.setUserId);
  const setUsername = useCurrUserState((state)=>state.setUsername);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const body = {
      email: values.email,
      password: values.password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3500/api/auth/login",
        body,
        { withCredentials: true }
      );
      if (response.data.success) {
        setAccessToken(response.data.accessToken);
        setIsAuthenticated(true);
        toast(response.data.message);
        form.reset();
        setUserId(response.data.user.userId);
        setUsername(response.data.user.username);
        navigate("/chats");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response) toast(err.response.data.message);
        else toast("Server is down");
      } else {
        toast(err.message);
      }
    }
  };

  return (
    <TabsContent value="logIn">
      <Card>
        <CardHeader>
          <CardTitle>LogIn</CardTitle>
          <CardDescription>Log in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="min-h-60 space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field}></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <Button
                type="submit"
                className="w-full hover:cursor-pointer"
                variant="secondary"
              >
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Login;
