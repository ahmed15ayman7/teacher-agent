"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  RadioGroup,
  FormControlLabel,
  Typography,
  Radio,
  Tooltip,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Grid2 from "@mui/material/Grid2";
import { z } from "zod";
import axios from "axios";
import { buttonStyles } from "@/constants";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getSchoolData, setSchoolData2 } from "@/lib/actions/user.action";

// Define Zod schema for form validation
const teacherSchema = z.object({
  // teacherId: z.string().nonempty("Please select a teacher"),
  name: z.string().nonempty("الرجاء ادخال اسم المعلم"),
  schoolId: z.string().nonempty("المدرسه"),
  specialization: z.string().optional(),
  civilRecord: z.string().optional(),
  sessionCount: z.string().optional(),
  phoneNumber: z.string().optional(),
  teachingStage: z.enum(["Primary", "Intermediate", "Secondary"]),
  birthDate: z.string().optional(),
  supervisionDay: z.string().optional(),
  qualification: z.string().optional(),
  TeachingMaterials: z.string().optional(),
  CorrespondenceEmail: z.string().optional(),
  OtherTasksAssigned: z.string().optional(),
  SupervisionPlace: z.string().optional(),
  ClassesTaught: z.string().optional(),
});

type TeacherFormInputs = z.infer<typeof teacherSchema>;

const TeacherForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<TeacherFormInputs>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      // d: "",
      name: "",
      schoolId: "",
      specialization: "",
      civilRecord: "",
      sessionCount: "",
      phoneNumber: "",
      teachingStage: undefined,
      birthDate: "",
      supervisionDay: "",
      qualification: "",
      TeachingMaterials: "",
      CorrespondenceEmail: "",
      OtherTasksAssigned: "",
      SupervisionPlace: "",
      ClassesTaught: "",
    },
  });
  let router = useRouter();
  let { data: SchoolData, isLoading } = useQuery({
    queryKey: ["SchoolData"],
    queryFn: () => getSchoolData(),
  });
  const onSubmit = async (data: TeacherFormInputs) => {
    const loadingToastId = toast.loading("جاري اضافة المعلم ...");

    try {
      await axios.post("/api/teachers", data);
      // Update the loading toast to success
      toast.update(loadingToastId, {
        render: "تم اضافة المعلم بنجاح",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      reset();
      let res2 = await axios.get(`/api/school?_id=${SchoolData._id}`);
      if (res2.status === 200) {
        await setSchoolData2(res2.data.data);
      }
    } catch (error: any) {
      // Update the loading toast to error
      toast.update(loadingToastId, {
        render: `فشل اضافة المعلم .${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleReset = () => {
    reset();
    router.back();
  };
  console.log(SchoolData);
  useEffect(() => {
    !isLoading && setValue("schoolId", SchoolData._id);
  }, [SchoolData, getValues("schoolId")]);

  return (
    <Box
      component="form"
      className={` pt-0 `}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ p: 2 }}
    >
      <Grid container className={` -translate-y-20 p-0 `}>
        <Grid2 size={{ md: 2, sm: 4, xs: 4 }}>
          <p className={`${buttonStyles} text-center  px-5 `}> إضافة معلم</p>
        </Grid2>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={10}>
          <FormHelperText error>{errors.schoolId?.message}</FormHelperText>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={6}
              className={"flex justify-between items-center"}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="الاسم"
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#006d4e",
                      },
                      color: "#000",
                    }}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="specialization"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="تخصص"
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#006d4e",
                      },
                      color: "#000",
                    }}
                    fullWidth
                    error={!!errors.specialization}
                    helperText={errors.specialization?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="civilRecord"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label=" سجله المدني "
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#006d4e", // تغيير لون التسمية (label)
                      },
                      color: "#000",
                    }}
                    fullWidth
                    error={!!errors.civilRecord}
                    helperText={errors.civilRecord?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="sessionCount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="عدد الحصص"
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#006d4e", // تغيير لون التسمية (label)
                      },
                      color: "#000",
                    }}
                    fullWidth
                    error={!!errors.sessionCount}
                    helperText={errors.sessionCount?.message}
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="رقم جواله"
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#006d4e", // تغيير لون التسمية (label)
                      },
                      color: "#000",
                    }}
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">المرحلة:</Typography>
              <Controller
                name="teachingStage"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
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
              <FormHelperText error>
                {errors.teachingStage?.message}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="تاريخ الميلاد"
                    type="date"
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#006d4e", // تغيير لون التسمية (label)
                      },
                      color: "#000",
                    }}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    error={!!errors.birthDate}
                    helperText={errors.birthDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="CorrespondenceEmail"
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
                    label="إيميل المراسلات"
                    fullWidth
                    error={!!errors.CorrespondenceEmail}
                    helperText={errors.CorrespondenceEmail?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="supervisionDay"
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
                    label="يوم الإشراف"
                    fullWidth
                    error={!!errors.supervisionDay}
                    helperText={errors.supervisionDay?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="OtherTasksAssigned"
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
                    label=" أعمال أخرى مكلف بها"
                    fullWidth
                    error={!!errors.OtherTasksAssigned}
                    helperText={errors.OtherTasksAssigned?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="qualification"
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
                    label="المؤهل"
                    fullWidth
                    error={!!errors.qualification}
                    helperText={errors.qualification?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="SupervisionPlace"
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
                    label="مكان الإشراف"
                    fullWidth
                    error={!!errors.SupervisionPlace}
                    helperText={errors.SupervisionPlace?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="ClassesTaught"
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
                    label=" الصفوف التي يدرسها"
                    fullWidth
                    error={!!errors.ClassesTaught}
                    helperText={errors.ClassesTaught?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="TeachingMaterials"
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
                    label="مواد التدريس"
                    fullWidth
                    error={!!errors.TeachingMaterials}
                    helperText={errors.TeachingMaterials?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Tooltip title="إضافة">
              <Button
                type="submit"
                variant="contained"
                className={buttonStyles}
              >
                إضافة
              </Button>
            </Tooltip>
            <Tooltip title="عودة">
              <Button
                variant="contained"
                className={buttonStyles}
                onClick={handleReset}
              >
                عودة
              </Button>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherForm;
