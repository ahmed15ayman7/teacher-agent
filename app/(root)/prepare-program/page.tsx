"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  FormHelperText,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SchoolSchema, schoolSchema } from "@/lib/schema/school";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  buttonStyles,
  downloadTeachersExcel,
  generateExcel,
  getDate,
  getHijriDate,
  getTime,
} from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { getSchoolData, setSchoolData2 } from "@/lib/actions/user.action";
import { addGenralScheduleExcel } from "@/hook/addGenralSchedule";
import { addTeachersExcel } from "@/hook/addTeachersExcel";
import { GridDeleteIcon } from "@mui/x-data-grid";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FormComponent: React.FC = () => {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SchoolSchema>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      schoolName: "",
      principal: "",
      deputy: "",
      studentCount: "",
      teacherCount: "",
      classCount: "",
      password: "",
      confirmPassword: "",
      timePeriod: getTime(),
      dateM: getDate(),
      dateH: getHijriDate(),
      stage: "Primary",
    },
  });
  let router = useRouter();
  let { data: SchoolData, isLoading } = useQuery({
    queryKey: ["SchoolData"],
    queryFn: () => getSchoolData(),
  });
  useEffect(() => {
    !isLoading && reset({ ...SchoolData });
  }, [SchoolData]);

  const buttonStyles2 =
    "w-full py-3 my-2 text-gray-900 font-bold rounded-lg bg-gray-100 hover:from-green-800  shadow-md shadow-gray-500/50";
  const onSubmit = async (data: SchoolSchema) => {
    const toastId = toast.loading("جارٍ إضافة المدرسة...");

    try {
      const response = await axios.put("/api/school", {
        body: data,
        _id: SchoolData._id,
      });

      if (response.status === 201) {
        toast.update(toastId, {
          render: "تمت اعداد المدرسة بنجاح!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        let res2 = await axios.get(`/api/school?_id=${SchoolData._id}`);
        if (res2.status === 200) {
          await setSchoolData2(res2.data.data);
          reset(res2.data.data);
        }
      } else {
        toast.update(toastId, {
          render: "فشل في إضافة المدرسة.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        console.error(response?.data.error);
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "حدث خطأ أثناء الاعداد.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // async function downloadTeachers() {
  //   let response = await axios.get(`/api/teachers?schoolId=${SchoolData._id}`);
  //   downloadTeachersExcel(response.data, {
  //     schoolName: SchoolData.schoolName,
  //     principalName: SchoolData.principal,
  //     educationalSupervisor: SchoolData.deputy,
  //   });
  // }

  async function UploudGenralSchedul(e: React.ChangeEvent<HTMLInputElement>) {
    // let response = await axios.get(
    //   `/api/teachers?schoolId=${SchoolData._id}&&i=1`
    // );
    // generateExcel(response.data);

    if (e.target.files) {
      await addGenralScheduleExcel(e.target.files[0]);
    }
  }
  async function UploudTeachersExcel(e: React.ChangeEvent<HTMLInputElement>) {
    const toastId = toast.loading("جاري اضافة المعلمين");
    if (e.target.files) {
      try {
        await addTeachersExcel(e.target.files[0], SchoolData._id);
        toast.update(toastId, {
          render: "تم اضافة  المعلمين",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (error: any) {
        toast.update(toastId, {
          render: `فشل في الاضافه ${error?.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } else {
      toast.update(toastId, {
        render: `فشل في تحميل الملف يرجي اختيار الملف `,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }
  const handleDelete = async () => {
    // إظهار رسالة تحميل
    const toastId = toast.loading("جاري حذف الجداول...");

    try {
      if (SchoolData) {
        // استدعاء API الحذف باستخدام Axios
        const { data } = await axios.delete("/api/schedule/delete", {
          params: { schoolId: SchoolData._id }, // إرسال schoolId كمعامل
        });

        // تحديث التوست إلى نجاح
        toast.update(toastId, {
          render: `تم الحذف بنجاح  جدول `,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);

      // تحديث التوست إلى خطأ
      toast.update(toastId, {
        render: "حدث خطأ أثناء الحذف",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ borderRadius: 2, padding: "0px 16px 16px 16px" }}
    >
      <Grid container spacing={2}>
        <Grid size={{ md: 2, sm: 4, xs: 4 }}>
          <p className={`${buttonStyles} text-center -translate-y-20 `}>
            {" "}
            إعداد البرنامج
          </p>
        </Grid>
      </Grid>
      <Typography variant="h5" align="center" gutterBottom>
        إعدادات المدرسة
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ md: 8, sm: 12, xs: 12 }}>
          <Controller
            name="schoolName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="اسم المدرسة"
                fullWidth
                error={!!errors.schoolName}
                helperText={errors.schoolName?.message}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e",
                  },
                  color: "#000",
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <Controller
            name="principal"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                label="مدير المدرسة"
                fullWidth
                error={!!errors.principal}
                helperText={errors.principal?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="deputy"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                label="وكيل الشؤون التعليمية والمدرسية"
                fullWidth
                error={!!errors.deputy}
                helperText={errors.deputy?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="studentCount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                label="عدد طلاب المدرسة"
                type="number"
                fullWidth
                error={!!errors.studentCount}
                helperText={errors.studentCount?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="teacherCount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                label="عدد معلمي المدرسة"
                type="number"
                fullWidth
                error={!!errors.teacherCount}
                helperText={errors.teacherCount?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="classCount"
            control={control}
            render={({ field }) => (
              <TextField
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                {...field}
                label="عدد فصول المدرسة"
                type="number"
                fullWidth
                error={!!errors.classCount}
                helperText={errors.classCount?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                label="كلمة المرور الجديدة"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                label="تأكيد كلمة المرور"
                type="password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="timePeriod"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="ضبط الوقت"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                placeholder="HH:MM"
                fullWidth
                error={!!errors.timePeriod}
                helperText={errors.timePeriod?.message}
              />
            )}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="dateH"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label=" ضبط التاريخ هـ"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                placeholder="DD/MM/YYYY"
                fullWidth
                error={!!errors.dateH}
                helperText={errors.dateH?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="dateM"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label=" ضبط التاريخ مـ"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                placeholder="DD/MM/YYYY"
                error={!!errors.dateM}
                helperText={errors.dateM?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Typography variant="body1">المرحلة:</Typography>
          <FormControl component="fieldset">
            <Controller
              name="stage"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  {...field}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value as "Primary" | "Intermediate" | "Secondary"
                    );
                  }}
                >
                  <FormControlLabel
                    value="Primary"
                    control={<Radio />}
                    label="ابتدائي"
                  />
                  <FormControlLabel
                    value="Intermediate"
                    control={<Radio />}
                    label="متوسط"
                  />
                  <FormControlLabel
                    value="Secondary"
                    control={<Radio />}
                    label="ثانوي"
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error>{errors.stage?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid size={{ md: 2, sm: 4 }}>
          <Button className={buttonStyles} type="submit" fullWidth>
            حفظ
          </Button>
        </Grid>

        <Grid size={{ md: 2, sm: 4 }}>
          <Button className={buttonStyles} fullWidth>
            إلغاء
          </Button>
        </Grid>

        <Grid size={{ md: 2, sm: 4 }}>
          <Button
            className={buttonStyles}
            onClick={() => router.back()}
            fullWidth
          >
            عودة
          </Button>
        </Grid>

        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            fullWidth
            className={buttonStyles2}
            tabIndex={-1}
          >
            اضغط هنا لتحميل مدموج الجدول العام مع الانتظار إكسل
            <VisuallyHiddenInput
              type="file"
              accept=".xlsx"
              onChange={(event) => UploudGenralSchedul(event)}
              multiple
            />
          </Button>
        </Grid>

        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            fullWidth
            className={buttonStyles2}
            tabIndex={-1}
          >
            اضغط هنا لتحميل بيانات المعلمين إكسل
            <VisuallyHiddenInput
              type="file"
              accept=".xlsx"
              onChange={(event) => UploudTeachersExcel(event)}
              multiple
            />
          </Button>
        </Grid>
        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <Button
            component="label"
            role="button"
            variant="contained"
            fullWidth
            className={buttonStyles2
              .split("gray")
              .join("")
              .concat(" text-white gap-10 ")}
            tabIndex={-1}
            onClick={handleDelete}
            startIcon={<GridDeleteIcon />}
            color="error"
          >
            حذف الجدول العام
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FormComponent;
