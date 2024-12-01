import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { getArabicDay } from "@/constants";

interface ITeacher2 {
  name: string;
  WeeklySchedule: {
    lessons: { day: string; period: number; title: string }[];
  }[];
}

const TeacherScheduleTable: React.FC<{
  teachers: ITeacher2[];
  schoolName: string;
  tableRef: React.RefObject<HTMLDivElement>;
}> = ({ teachers, schoolName, tableRef }) => {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const periods = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div
      ref={tableRef}
      style={{ overflowX: "auto", maxHeight: "500px", overflowY: "auto" }}
    >
      <Table style={{ minWidth: 1000 }} className="w-full">
        <TableHead>
          {/* الصف الخاص باسم المدرسة */}
          <TableRow>
            <TableCell
              colSpan={days.length * periods.length + 2}
              align="center"
              style={{
                borderBottom: "2px solid black", // إضافة خط أسفل اسم المدرسة
                fontWeight: "bold",
                fontSize: "20px",
                position: "sticky",
                top: 0,
                backgroundColor: "white", // لضمان خلفية بيضاء عند التمرير
              }}
            >
              {schoolName} {/* اسم المدرسة */}
            </TableCell>
          </TableRow>

          {/* رأس الجدول */}
          <TableRow>
            <TableCell
              style={{
                borderRight: "1px solid #ddd", // خط فاصل بين عمود العداد واسم المعلم
                fontWeight: "bold",
                position: "sticky",
                top: 50,
                backgroundColor: "white",
              }}
            >
              <Tooltip title={"#"} arrow>
                <span>#</span>
              </Tooltip>
            </TableCell>{" "}
            {/* عمود العداد */}
            <TableCell
              style={{
                borderRight: "1px solid #ddd",
                fontWeight: "bold",
                position: "sticky",
                top: 50,
                backgroundColor: "#ffffff",
              }}
            >
              <Tooltip title={"المعلم"} arrow>
                <span>المعلم</span>
              </Tooltip>
            </TableCell>
            {days.map((day) => (
              <TableCell
                key={day}
                colSpan={periods.length}
                align="center"
                style={{
                  borderRight: "3px solid black", // خط سميك بين الأيام
                  fontWeight: "bold",
                  position: "sticky",
                  top: 50,
                  backgroundColor: "white",
                }}
              >
                <Tooltip title={day} arrow>
                  <span>{day}</span>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell
              style={{
                borderRight: "1px solid #ddd", // خط رفيع بين الخلايا
                fontWeight: "bold",
                position: "sticky",
                top: 100,
                backgroundColor: "white",
              }}
            ></TableCell>{" "}
            {/* عمود العداد */}
            <TableCell
              style={{
                borderRight: "1px solid #ddd", // خط رفيع بين الخلايا
                fontWeight: "bold",
                position: "sticky",
                top: 100,
                backgroundColor: "white",
              }}
            ></TableCell>{" "}
            {/* عمود العداد */}
            {days.map((day) =>
              periods.map((period) => (
                <TableCell
                  key={`${day}-${period}`}
                  align="center"
                  style={{
                    borderRight:
                      period === 1 ? "3px solid #000" : "1px solid #ddd", // خط رفيع بين الخلايا
                    fontWeight: "bold",
                    position: "sticky",
                    top: 100,
                    backgroundColor: "white",
                  }}
                >
                  <Tooltip title={`الحصة ${period}`} arrow>
                    <span>{period}</span>
                  </Tooltip>
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((teacher, teacherIndex) => (
            <TableRow
              key={teacher.name}
              sx={{
                backgroundColor:
                  teacherIndex % 3 === 0
                    ? "#e5fbe9"
                    : teacherIndex % 3 === 1
                    ? "#fffce9"
                    : "#ecf8fd",
              }}
            >
              <TableCell
                style={{
                  borderRight: "1px solid #ddd", // خط رفيع بين الخلايا
                  position: "sticky",
                  left: 0,
                }}
              >
                {teacherIndex + 1}
              </TableCell>{" "}
              {/* التعداد */}
              <TableCell
                style={{
                  borderRight: "1px solid #ddd", // خط رفيع بين الخلايا
                  position: "sticky",
                  left: "60px", // يحدد المسافة مع العمود الأول
                }}
              >
                {teacher.name}
              </TableCell>
              {days.map((day) =>
                periods.map((period) => {
                  const lesson = teacher.WeeklySchedule[0]?.lessons.find(
                    (l) =>
                      getArabicDay(
                        l.day as
                          | "Sunday"
                          | "Monday"
                          | "Tuesday"
                          | "Wednesday"
                          | "Thursday"
                      ) === day && l.period === period
                  );
                  return (
                    <TableCell
                      key={`${teacher.name}-${day}-${period}`}
                      align="center"
                      style={{
                        backgroundColor: lesson?.title.includes("منتظر")
                          ? "yellow"
                          : "inherit",
                        borderRight: "1px solid #ddd", // خط رفيع بين الخلايا
                      }}
                    >
                      <Tooltip
                        title={lesson ? lesson.title : "No lesson"}
                        arrow
                      >
                        <span>{lesson ? lesson.title : ""}</span>
                      </Tooltip>
                    </TableCell>
                  );
                })
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeacherScheduleTable;
