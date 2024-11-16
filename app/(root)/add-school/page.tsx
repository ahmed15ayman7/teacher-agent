"use client";
import React from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SchoolSchema, schoolSchema } from "@/lib/schema/school";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import { buttonStyles, getDate, getHijriDate, getTime } from "@/constants";

const FormComponent: React.FC = () => {
  const {
    handleSubmit,
    control,
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

  const onSubmit = async (data: SchoolSchema) => {
    const toastId = toast.loading("جارٍ إضافة المدرسة...");

    try {
      const response = await axios.post("/api/school", {
        body: data,
      });

      if (response.status === 201) {
        const result = await response.data;
        toast.update(toastId, {
          render: "تمت إضافة المدرسة بنجاح!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        reset();
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
        render: "حدث خطأ أثناء الإضافة.",
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
            إضافة مدرسة
          </p>
        </Grid>
      </Grid>
      <Typography variant="h5" align="center" gutterBottom>
        إضافة المدرسة
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
      </Grid>
    </form>
  );
};

export default FormComponent;
