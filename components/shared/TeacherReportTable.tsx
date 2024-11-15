import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { getLabel, notesTypy } from "@/constants";

// دالة لفصل الأسماء في حالة وجود أكثر من اسم
const splitNames = (names: string) => {
  return names.split(",").map((name) => name.trim());
};

const TeacherReportTable = ({
  notes,
  teacherName,
  startDate,
  endDate,
  teachers,
}: {
  notes: {
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
  };
  teacherName: string;
  startDate: string;
  endDate: string;
  teachers: { _id: string; name: string }[];
}) => {
  const teacherNames = splitNames(teacherName);

  return (
    <div>
      <TableContainer
        className="print"
        component={Paper}
        sx={{ maxWidth: 900, margin: "auto", padding: 2, boxShadow: 3 }}
        dir="rtl"
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={3}
                align="center"
                className="cR"
                style={{
                  fontWeight: "bold",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  fontSize: 18,
                  padding: "16px 8px",
                }}
              >
                <Typography variant="h6">تقرير أداء المعلم</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={2}
                className="cdt"
                style={{
                  fontWeight: "bold",
                  backgroundColor: "#007BFF",
                  color: "white",
                  textAlign: "center",
                }}
              >
                تاريخ البداية - تاريخ النهاية
              </TableCell>
              <TableCell
                className="cd"
                style={{ backgroundColor: "#E3F2FD", textAlign: "center" }}
                colSpan={2}
              >
                {startDate} - {endDate}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teacherNames.map((name, index) => (
              <React.Fragment key={index}>
                {/* عرض اسم المعلم في صف منفصل وبالمنتصف */}
                <TableRow
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell
                    colSpan={3}
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {name}
                  </TableCell>
                </TableRow>

                {/* عرض الملاحظات في صفين تحت اسم المعلم بحد أقصى 3 ملاحظات في كل صف */}
                {Object.entries(notes).map(([teacherId, teacherData]) => {
                  if (teacherData.name.trim() === name.trim()) {
                    const notesArray = Object.entries(teacherData).filter(
                      ([key]) => key !== "name"
                    ); // استبعاد حقل 'name'

                    return (
                      <React.Fragment key={teacherId}>
                        {notesArray.map(([, value], noteIndex) => {
                          const noteLabel = getLabel(
                            Object.keys(teacherData)[noteIndex] as notesTypy
                          );

                          // تقسيم الملاحظات إلى 3 ملاحظات في كل صف
                          if (noteIndex % 3 === 0) {
                            return (
                              <TableRow key={noteIndex}>
                                <TableCell colSpan={3}>
                                  <Grid container spacing={2}>
                                    {notesArray
                                      .slice(noteIndex, noteIndex + 3)
                                      .map(([key, value]) => (
                                        <Grid item xs={4} key={key}>
                                          <Typography variant="body2">
                                            <strong>
                                              {getLabel(key as notesTypy)}
                                              {(key as notesTypy) ===
                                                "TeacherWaitPaidDone" ||
                                              (key as notesTypy) ===
                                                "TeacherWaitDone"
                                                ? ""
                                                : ":"}
                                            </strong>{" "}
                                            {(key as notesTypy) ===
                                              "TeacherWaitPaidDone" ||
                                            (key as notesTypy) ===
                                              "TeacherWaitDone"
                                              ? (value as string[]).map((v) => (
                                                  <strong
                                                    key={v}
                                                    className=" block py-3 "
                                                  >
                                                    {
                                                      (
                                                        teachers.filter(
                                                          (e: {
                                                            _id: string;
                                                          }) => e._id === v
                                                        )[0] as { name: string }
                                                      )?.name
                                                    }
                                                  </strong>
                                                ))
                                              : value}
                                          </Typography>
                                        </Grid>
                                      ))}
                                  </Grid>
                                </TableCell>
                              </TableRow>
                            );
                          }
                          return null;
                        })}
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TeacherReportTable;
