"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Grid2 from "@mui/material/Grid2";
import { z } from "zod";
import axios from "axios";
import { buttonStyles, downloadTeachersExcel } from "@/constants";
import { useRouter } from "next/navigation";
import { getSchoolData } from "@/lib/actions/user.action";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ITeacher } from "@/lib/models/Teacher";
import { GridDeleteIcon } from "@mui/x-data-grid";

// Define Zod schema for form validation
const teacherSchema = z.object({
  teacherId: z.string().nonempty("Please select a teacher"),
  // name: z.string().nonempty("Please select a teacher"),
  specialization: z.string().optional(),
  civilRecord: z.string().optional(),
  sessionCount: z.number().optional(),
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
  const { control, handleSubmit, setValue, reset, getValues } =
    useForm<TeacherFormInputs>({
      resolver: zodResolver(teacherSchema),
      defaultValues: {
        teacherId: "",
        // name: "",
        specialization: "",
        civilRecord: "",
        sessionCount: 0,
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
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [Teacher, setTeacher] = useState<ITeacher>();
  const [loading, setLoading] = useState(false);
  const [isDelete, setDelete] = useState(0);

  let { data: SchoolData, isLoading } = useQuery({
    queryKey: ["SchoolData"],
    queryFn: () => getSchoolData(),
  });
  useEffect(() => {
    setLoading(true);
    !isLoading &&
      axios.get(`/api/teachers?schoolId=${SchoolData._id}`).then((response) => {
        setTeachers(response.data);
        setLoading(false);
      });
  }, [SchoolData, isDelete]);
  let router = useRouter();
  const onSelectTeacher = async (teacherId: string) => {
    const teacherData = await axios.get(`/api/teachers/${teacherId}`);
    setSelectedTeacher(teacherData.data._id);
    setTeacher(teacherData.data);
    Object.keys(teacherData.data).forEach((key) => {
      setValue(key as keyof TeacherFormInputs, teacherData.data[key]);
    });
  };

  const buttonStyles2 =
    "w-full py-3 my-4  text-gray-900 font-bold rounded-lg bg-gray-100 hover:from-green-800  shadow-md shadow-gray-500/50";
  const onSubmit = (data: TeacherFormInputs) => {
    console.log("Form submitted with data:", data);
  };

  const handleReset = () => {
    reset();
    setSelectedTeacher("");
    router.back();
  };
  const handleShare = () => {
    navigator.clipboard.writeText(location.href);
    toast.success("تم نسخ الرابط للمشاركة!");
  };
  const handleButtonClick = (action: string) => {
    switch (action) {
      case "طباعة التقرير":
        window.print();
        break;
      case "تنزيل التقرير":
        Teacher &&
          downloadTeachersExcel([Teacher], {
            schoolName: SchoolData.schoolName,
            principalName: SchoolData.principal,
            educationalSupervisor: SchoolData.deputy,
          });
        break;

      default:
        console.warn("Unknown action:", action);
    }
  };
  const handleDelete = async () => {
    // إظهار رسالة تحميل
    const toastId = toast.loading("جاري حذف المعلم والجداول المرتبطة...");

    try {
      // استدعاء API الحذف باستخدام Axios
      const { data } = await axios.delete(`/api/teachers/${selectedTeacher}`);

      // تحديث التوست إلى نجاح
      toast.update(toastId, {
        render: data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setSelectedTeacher("");
      reset();
      setDelete(Math.random());
    } catch (error: any) {
      console.error(error);

      // تحديث التوست إلى خطأ
      toast.update(toastId, {
        render: error.response?.data?.message || "حدث خطأ أثناء الحذف",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <Box
      component="form"
      className={` pt-0 `}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ p: 2 }}
    >
      <Grid container className={` -translate-y-20 p-0 leftBs`}>
        <Grid2 size={{ md: 2, sm: 4, xs: 4 }}>
          <p className={`${buttonStyles} text-center  px-5 `}>
            {" "}
            استعراض بيانات المعلم
          </p>
        </Grid2>
      </Grid>
      <Grid container spacing={2} className="print">
        <Grid item xs={12} md={10}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={6}
              className={"flex justify-between items-center"}
            >
              <Typography
                variant="body1"
                className="flex-grow font-bold text-center leftBs"
                style={{ color: "#006d4e" }}
              >
                اختر المعلم
              </Typography>
              <Controller
                name="teacherId"
                control={control}
                render={({ field }) => (
                  <div className="select-container px-3 pr-0 ">
                    <select
                      value={selectedTeacher!}
                      onChange={(e) => {
                        field.onChange(e);
                        onSelectTeacher(e.target.value);
                      }}
                      className="custom-select flex-grow mx-2 h-full"
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #006d4e",
                        backgroundColor: "#fff",
                        color: "#000",
                        width: "100%",
                        height: "100%", // لجعل الارتفاع كامل
                        appearance: "none", // لإخفاء أيقونة السهم الافتراضية
                        WebkitAppearance: "none", // لإخفاء أيقونة السهم الافتراضية في سفاري
                        MozAppearance: "none", // لإخفاء أيقونة السهم الافتراضية في فايرفوكس
                        paddingRight: "32px", // مساحة لعرض الأيقونة
                      }}
                    >
                      <option value="" disabled>
                        اختر المعلم
                      </option>
                      {teachers.map((teacher: any) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    <span className="custom-icon">▼</span>
                  </div>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    defaultValue={
                      field.value
                        ? new Date(field.value).toLocaleDateString("en-US")
                        : undefined
                    }
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
                  />
                )}
              />
            </Grid>
            {selectedTeacher && (
              <Grid xs={12} md={6}>
                <Link href={`/add-notes?id=${selectedTeacher}`}>
                  <Button className={`${buttonStyles2} leftBs`} fullWidth>
                    اضغط هنا لاستعراض جدوله الدراسي
                  </Button>
                </Link>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Button Section - 2 columns */}
        <Grid item xs={12} md={2} className="leftBs">
          <Box display="flex" flexDirection="column" gap={1}>
            <Tooltip title="إضافة معلم">
              <Link href={"/add-teacher"}>
                <Button variant="contained" className={buttonStyles}>
                  إضافة معلم
                </Button>
              </Link>
            </Tooltip>
            <Button
              variant="contained"
              className={buttonStyles}
              onClick={(e) => handleButtonClick("طباعة التقرير")}
            >
              طباعة
            </Button>
            <Tooltip title="مشاركة">
              <Button
                variant="contained"
                className={buttonStyles}
                onClick={handleShare}
              >
                مشاركة
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              className={buttonStyles}
              onClick={(e) => handleButtonClick("تنزيل التقرير")}
            >
              تنزيل
            </Button>
            <Tooltip title="حفظ">
              <Button
                variant="contained"
                className={buttonStyles}
                type="submit"
              >
                حفظ
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
            <Tooltip title={`  حذف المعلم ${Teacher?.name} `}>
              <Button
                component="label"
                role="button"
                variant="contained"
                fullWidth
                className={buttonStyles
                  .split("bg")
                  .join("")
                  .concat(" gap-7 text-white")}
                tabIndex={-1}
                onClick={handleDelete}
                startIcon={<GridDeleteIcon />}
                color="error"
              >
                حذف المعلم
              </Button>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherForm;
