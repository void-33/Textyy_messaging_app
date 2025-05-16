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
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import useToast from "./ui/Toast";
import useAuthPageModeState from "@/stores/authPageModeStore";
import { useNavigate } from "react-router-dom";

const formSchema = z
  .object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3),
    confirmPassword: z.string().min(3),
    dateOfBirth: z.date(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords donot match",
  });

const formItems = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
  },
];

const Signup = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const setValue = useAuthPageModeState((state) => state.setValue);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: undefined,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        "http://localhost:3500/api/auth/register",
        values
      );
      if (response.data.success) {
        toast(response.data.message);
        form.reset();
        const token = response.data.emailResendToken || 'unknown';
        sessionStorage.setItem('EmailResendToken',token);
        setValue("logIn");
        navigate('/verify-email');
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
    <TabsContent value="signUp">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Register your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 max-h-60 overflow-auto"
            >
              <div className="flex flex-row gap-2">
                {formItems.slice(0, 2).map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name as keyof z.infer<typeof formSchema>}
                    render={({ field }) => {
                      const { value, ...restField } = field;
                      const inputValue =
                        typeof value === "string" || typeof value === "number"
                          ? value
                          : "";
                      return (
                        <FormItem>
                          <FormLabel>{item.label}</FormLabel>
                          <FormControl>
                            <Input
                              type={item.type}
                              value={inputValue}
                              {...restField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              {formItems.slice(2).map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => {
                    const { value, ...restField } = field;
                    const inputValue =
                      typeof value === "string" || typeof value === "number"
                        ? value
                        : "";
                    return (
                      <FormItem>
                        <FormLabel>{item.label}</FormLabel>
                        <FormControl>
                          <Input
                            type={item.type}
                            value={inputValue}
                            {...restField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Of Birth</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full hover:cursor-pointer"
                variant="secondary"
              >
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Signup;
