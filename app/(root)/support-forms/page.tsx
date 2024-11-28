"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { buttonStyles } from "@/constants";
import { toast } from "react-toastify";
import { IconCalendar } from "@tabler/icons-react";
import { getSchoolData } from "@/lib/actions/user.action";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const MyDesign = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [START_END_WEEK, setSTART_END_WEEK] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>();
  let { data: SchoolData, isLoading } = useQuery({
    queryKey: ["SchoolData"],
    queryFn: () => getSchoolData(),
  });
  useEffect(() => {
    !isLoading &&
      axios.get(`/api/teachers?schoolId=${SchoolData._id}`).then((response) => {
        setTeachers(response.data);
      });
  }, [SchoolData]);
  const handleSelectTeacher = async (id: string) => {
    START_END_WEEK && START_END_WEEK?.end && START_END_WEEK?.start
      ? ""
      : toast.info(`يرجي اختيار التاريخ`);
  };
  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={10}>
          <Grid container spacing={2}>
            {/* اختيار المعلم والأسبوع */}
            <Grid item xs={12} sm={12}>
              <Box
                display="flex"
                alignItems="center"
                flexDirection={"row-reverse"}
                justifyContent={"end"}
                width={"80%"}
                gap={2}
              >
                <FormControl
                  variant="outlined"
                  sx={{ width: "150px", flexGrow: 1 }}
                >
                  {/* <InputLabel>اختر المعلم</InputLabel> */}
                  <div className="select-container px-1 pr-0 min-w-52">
                    <select
                      value={selectedTeacher!}
                      onChange={(e) => {
                        handleSelectTeacher(e.target.value);
                      }}
                      className="custom-select  flex-grow mx-2 h-full cursor-pointer "
                      style={{
                        padding: "4px",
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
                </FormControl>
                <TextField
                  label="إلى"
                  type="date"
                  className="pl-3"
                  style={{ marginRight: "10px" }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "#006d4e", // تغيير لون التسمية (label)
                    },
                    color: "#000",
                  }}
                  onChange={(e) => {
                    setSTART_END_WEEK((a) => {
                      return {
                        end: new Date(e.target.value),
                        start: a?.start,
                      };
                    });
                  }}
                />
                <IconButton>
                  <IconCalendar />
                </IconButton>
                <TextField
                  label="من"
                  type="date"
                  style={{ marginRight: "10px" }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "#006d4e", // تغيير لون التسمية (label)
                    },
                    color: "#000",
                  }}
                  className="pl-3"
                  onChange={(e) => {
                    setSTART_END_WEEK((a) => {
                      return {
                        start: new Date(e.target.value),
                        end: a?.start,
                      };
                    });
                  }}
                />
              </Box>
            </Grid>

            {/* باقي الخيارات */}
            {[
              { label: "مساءلة عدم الإشراف", date: true },
              { label: "مساءلة غياب يوم", date: true },
              { label: "مساءلة غياب عن حصة", date: true },
              { label: "مساءلة تأخر عن الحصة", date: true },
              { label: "مساءلة خروج مبكر من الحصة", date: true },
              { label: "مساءلة تأخر عن الدوام", date: true },
              { label: "مساءلة عدم تحضير الدروس", date: false },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Tooltip title={item.label} arrow>
                      <Button
                        variant="contained"
                        className={buttonStyles}
                        fullWidth
                      >
                        {item.label}
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={4}>
                    {item.date && (
                      <Tooltip title="حدد التاريخ" arrow>
                        <TextField
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* الأزرار الجانبية */}
        <Grid item xs={12} sm={2}>
          <Grid container direction="column" spacing={2}>
            {["مشاركة", "تنزيل", "طباعة", "عودة"].map((label, index) => (
              <Grid item key={index}>
                <Tooltip title={`زر ${label}`} arrow>
                  <Button
                    variant="contained"
                    className={buttonStyles}
                    fullWidth
                  >
                    {label}
                  </Button>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyDesign;
