"use client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { buttonStyles } from "@/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
type LoginSchema = z.infer<typeof loginSchema>;
const LoginPage = () => {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });
  let router = useRouter();
  const onSubmit = async (data: LoginSchema) => {
    const toastId = toast.loading("جاري حفظ الملاحظات");
    try {
      let response = await axios.post("/api/login", {
        ...data,
      });
      if (response.status === 200) {
        toast.update(toastId, {
          type: "success",
          render: "تم التسجيل بنجاح",
          isLoading: false,
          autoClose: 3000,
        });
        reset();
        router.replace("/");
      } else {
      }
    } catch (error: any) {
      toast.update(toastId, {
        type: "error",
        render: `خطأ في التسجيل${error.message}`,
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className=" mt-10 flex items-center justify-center ">
      <div className="bg-white  bg-opacity-20 backdrop-blur-lg p-10 rounded-xl shadow-xl  max-w-sm mx-auto transform transition hover:scale-105 duration-300">
        <h2
          className="text-4xl font-extrabold text-center text-shadow-lg shadow-black text-white mb-6"
          style={{ textShadow: "0 0 4px  #275839FF" }}
        >
          متابعة العملية التعليمية
        </h2>
        <p className="text-2xl bg-gradient-to-r from-green-700 to-blue-900 hover:from-green-800 hover:to-blue-800 font-bold text-center mb-6 bg-clip-text text-transparent">
          مساعد المدراء ووكلاء المدارس
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <label htmlFor="password">أدخل كلمة المرور</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id="password"
                type="password"
                className="w-full px-4 py-2 bg-transparent border border-gray-900 text-gray-900 rounded-md placeholder-white focus:outline-none focus:ring-2 focus:ring-green-700 transition"
                placeholder="Enter Password"
              />
            )}
          />
          <Button type="submit" variant="contained" className={buttonStyles}>
            دخول
          </Button>
        </form>
        <div className="mt-4">
          {/* <a href="#" className="text-white hover:underline">Forgot password?</a> */}
          <Link
            href="/add-school"
            className="text-1xl bg-gradient-to-r from-green-700 to-blue-900 hover:from-green-800 hover:to-blue-800 font-bold  mb-6 bg-clip-text text-transparent hover:underline hover:underline-gray-900"
          >
            إضافة مدرسة
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
