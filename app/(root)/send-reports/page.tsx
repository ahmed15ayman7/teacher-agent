"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  FormControl,
} from "@mui/material";
import { IconCalendar } from "@tabler/icons-react";
import { toast } from "react-toastify";
import axios from "axios";
import { handleSelectTeacherHandlerReport } from "@/hook/teacherFunctionsReport";
import { ITeacher } from "@/lib/models/Teacher";
import { Lesson } from "@/lib/models/WeeklySchedule";
import { buttonStyles, exportToExcel, getLabel, notesTypy } from "@/constants";
import Grid2 from "@mui/material/Grid2";
import TeacherReportTable from "@/components/shared/TeacherReportTable";

function ReportPage() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const [checked, setChecked] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [isPrintGr, setIsPrintGr] = useState(10);
  const [START_END_WEEK, setSTART_END_WEEK] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>();
  const [notes, setNotes] = useState<{
    [teacherId: string]: {
      name: string;
      lessonCount: number;
      DoneCount: number;
      absentCount: number;
      lateCount: number;
      totalLateDuration: number;
      earlyLeaveCount: number;
      totalEarlyLeaveDuration: number;
      didNotActivateSupervisionCount: number;
      waitingDone: number;
      waitingPaidDone: number;
      didNotSendWeeklyPlanCount: number;
      missedLessonCount: number;
      missedStandbyCount: number;
      enteredStandbyCount: number;
      lateForWorkCount: number;
      totalLateForWorkDuration: number;
      leftSchoolCount: number;
      TeacherWaitDone: string[];
      TeacherWaitPaidDone: string[];
    };
  }>();
  const [schedule, setSchedule] = useState<{
    teacher: ITeacher;
    weekStartDate: Date;
    lessons: Lesson[];
  } | null>(null);
  useEffect(() => {
    axios.get("/api/teachers").then((response) => {
      setTeachers(response.data);
    });
  }, []);
  const handleButtonClick = (action: string) => {
    switch (action) {
      case "طباعة التقرير":
        isPrint ? setIsPrintGr(12) : setIsPrintGr(10);
        isPrint && window.print();
        setIsPrint((e) => !e);
        break;
      case "تنزيل التقرير":
        schedule &&
        notes &&
        START_END_WEEK &&
        START_END_WEEK.start &&
        START_END_WEEK.end
          ? exportToExcel(
              notes,
              // checked
              //   ? teachers.map((e: { name: string }) => e.name).join(" , ")
              //   : (
              //       teachers.filter(
              //         (e: { name: string; _id: string }) =>
              //           e._id === selectedTeacher
              //       )[0] as { name: string }
              //     ).name,
              START_END_WEEK?.start.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              }),
              START_END_WEEK.end.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })
            )
          : toast.info(
              !schedule
                ? `لا يوجد بيانات لتنزيلها`
                : START_END_WEEK && START_END_WEEK.start && START_END_WEEK.end
                ? ""
                : "يرجي اختيار التاريخ "
            );
        break;

      case "إرسال التقرير":
        // Add logic to send the report (e.g., email or API request)
        console.log("Sending report...");
        // Call a function or API to handle sending the report
        break;

      case "إرسال للمدير":
        // Add logic to send the report to the manager
        console.log("Sending report to manager...");
        // Call a function or API to send the report specifically to the manager
        break;

      case "العودة":
        // Add logic to navigate back or close the current view
        console.log("Going back...");
        // Use a navigation method or state update to return to the previous page
        break;

      default:
        console.warn("Unknown action:", action);
    }
  };

  const handleSelectTeacher = async (id: string) => {
    START_END_WEEK && START_END_WEEK?.end && START_END_WEEK?.start
      ? await handleSelectTeacherHandlerReport(
          id,
          { start: START_END_WEEK.start, end: START_END_WEEK.end },
          setSchedule,
          setNotes,
          setSelectedTeacher
        )
      : toast.info(`يرجي اختيار التاريخ`);
  };
  useEffect(() => {
    selectedTeacher && handleSelectTeacher(selectedTeacher);
  }, [START_END_WEEK]);
  let handleCheckChange = () => {
    setChecked((e) => !e);
  };
  useEffect(() => {
    checked &&
      handleSelectTeacher(
        teachers.map((e: { _id: string }) => e._id).join(",")
      );
  }, [checked, START_END_WEEK]);
  console.log(notes);

  return (
    <div className="">
      <Grid container className={` -translate-y-20 p-0 `}>
        <Grid2 size={{ md: 2, sm: 4, xs: 4 }}>
          <p className={`${buttonStyles} text-center  px-5 `}>
            {isPrint ? "التقرير مطبوع" : "إرسال التقارير"}
          </p>
        </Grid2>
      </Grid>
      <Grid container spacing={2} style={{ height: "100vh" }}>
        {/* Report Section - 10/12 */}

        {schedule &&
        isPrint &&
        START_END_WEEK &&
        START_END_WEEK.start &&
        START_END_WEEK.end &&
        notes ? (
          <Grid item xs={10}>
            {" "}
            <TeacherReportTable
              teachers={teachers}
              notes={notes}
              teacherName={
                checked
                  ? teachers.map((e: { name: string }) => e.name).join(" , ")
                  : (
                      teachers.filter(
                        (e: { name: string; _id: string }) =>
                          e._id === selectedTeacher
                      )[0] as { name: string }
                    ).name
              }
              startDate={START_END_WEEK?.start.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
              endDate={START_END_WEEK?.end.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            />
          </Grid>
        ) : (
          <Grid item xs={10}>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: 2,
                height: "100%",
                overflow: "auto",
              }}
            >
              {/* Header */}
              <Box display="flex" gap={10} alignItems="center" mb={2}>
                <div className="flex items-center w-1/4 z-[10000000] bg-gray-300 text-black px-2  rounded-md cursor-pointer  ">
                  <label className="flex items-center bg-gray-300 text-black px-4 py-2 rounded-md cursor-pointer gap-3 ">
                    <input
                      type="checkbox"
                      value={"all"}
                      checked={checked}
                      onChange={() => handleCheckChange()}
                      className="mr-2"
                    />
                    <span className="font-bold">اختر جميع معلمي المدرسة</span>
                  </label>
                </div>
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
              </Box>

              {/* Report Content (Table) */}
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: 2,
                }}
              >
                {notes ? (
                  <Box mt={2}>
                    {Object.entries(notes).map(([teacherId, teacherData]) => (
                      <Box key={teacherId} mb={4}>
                        {/* Teacher's Name */}
                        <Box mb={2}>
                          <Typography variant="h6" fontWeight="bold">
                            {teacherData.name}
                          </Typography>
                        </Box>

                        {/* Teacher's Statistics */}
                        <Box
                          display="grid"
                          gridTemplateColumns="1fr 1fr 1fr"
                          gap={2}
                          mt={2}
                        >
                          {Object.entries(teacherData).map(([key, value]) => {
                            // Skip 'name' field from statistics display
                            if (key === "name") return null;

                            return (
                              <Box
                                key={key}
                                display="flex"
                                justifyContent="space-between"
                                borderBottom="1px solid #ddd"
                                py={1}
                              >
                                <Typography>
                                  {getLabel(key as notesTypy)}
                                </Typography>
                                {(key as notesTypy) === "TeacherWaitPaidDone" ||
                                (key as notesTypy) === "TeacherWaitDone" ? (
                                  (value as string[]).map((v) => (
                                    <Typography
                                      key={v}
                                      className="rounded-lg px-4 font-bold text-white bg-gradient-to-r from-green-700 to-blue-900 hover:from-green-800 hover:to-blue-800 shadow-md shadow-blue-500/50"
                                    >
                                      {
                                        (
                                          teachers.filter(
                                            (e: { _id: string }) => e._id === v
                                          )[0] as { name: string }
                                        )?.name
                                      }
                                    </Typography>
                                  ))
                                ) : (
                                  <Typography className="rounded-lg px-4 font-bold text-white bg-gradient-to-r from-green-700 to-blue-900 hover:from-green-800 hover:to-blue-800 shadow-md shadow-blue-500/50">
                                    {value}
                                  </Typography>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          </Grid>
        )}
        {/* Buttons Section - 2/12 */}
        <Grid item xs={2} className="leftBs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "100%",
              padding: 2,
              borderRadius: "8px",
            }}
          >
            <Button
              variant="contained"
              className={buttonStyles}
              onClick={(e) => handleButtonClick("طباعة التقرير")}
            >
              طباعة
            </Button>
            <Button
              variant="contained"
              className={buttonStyles}
              onClick={(e) => handleButtonClick("تنزيل التقرير")}
            >
              تنزيل
            </Button>
            <Button
              variant="contained"
              className={buttonStyles}
              onClick={(e) => handleButtonClick("إرسال التقرير")}
            >
              إرسال
            </Button>
            <Button
              variant="contained"
              className={buttonStyles}
              onClick={(e) => handleButtonClick("إرسال للمدير")}
            >
              إرسال للمدير
            </Button>
            <Button
              variant="contained"
              className={buttonStyles}
              onClick={(e) => handleButtonClick("العودة")}
            >
              عودة
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default ReportPage;
