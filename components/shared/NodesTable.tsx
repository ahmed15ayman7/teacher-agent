import { getEnglishDay } from "@/constants";
import { ITeacher } from "@/lib/models/Teacher";
import { Lesson } from "@/lib/models/WeeklySchedule";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion"; // استيراد framer-motion
import React from "react";

const NodesTable = ({
  handleCellClick,
  notes,
  schedule,
  scheduleTemplate,
}: {
  handleCellClick: (day: string, t: string) => void;
  notes: {
    [key: string]: { text: string[]; colors: string[]; durations?: string[] };
  };
  schedule: {
    teacher: ITeacher;
    weekStartDate: Date;
    lessons: Lesson[];
  } | null;
  scheduleTemplate: {
    teacher: ITeacher;
    isTemplate: boolean;
    lessons: Lesson[];
  } | null;
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: "1px solid black", textAlign: "center" }}>
              اليوم
            </TableCell>
            {[...Array(7)].map((_, index) => (
              <Tooltip title={`الحصة ${index + 1}`} arrow key={index}>
                <TableCell
                  sx={{ border: "1px solid black", textAlign: "center" }}
                >
                  الحصة {index + 1}
                </TableCell>
              </Tooltip>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"].map((day) => (
            <TableRow key={day}>
              <TableCell
                sx={{ border: "1px solid black", textAlign: "center" }}
              >
                <Tooltip title={day} arrow>
                  <Box sx={{ cursor: "pointer" }}>{day}</Box>
                </Tooltip>
              </TableCell>
              {[...Array(7)].map((_, i) => {
                const period = i + 1;
                const key = `${day}-${period}`;
                const noteData = notes[key];
                let title = scheduleTemplate?.lessons
                  .map((e) =>
                    e.day ===
                      getEnglishDay(
                        day as
                          | "الأحد"
                          | "الاثنين"
                          | "الثلاثاء"
                          | "الأربعاء"
                          | "الخميس"
                      ) && e.period === +period
                      ? e
                      : null
                  )
                  .filter((e) => e !== null)[0]?.title;

                return (
                  <motion.td
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: title?.includes("منتظر")
                        ? "yellow"
                        : "inherit",
                    }}
                    className={"max-w-24"}
                    onClick={() => handleCellClick(day, `${period}`)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    key={key}
                  >
                    {title && (
                      <Typography className=" font-bold text-[18px] text-center w-full ">
                        {title}
                      </Typography>
                    )}
                    <Tooltip
                      title={noteData ? "" : "اضغط لإدخال ملاحظة"}
                      className="w-full"
                      arrow
                    >
                      <Box className={"max-w-24 w-full"}>
                        {noteData ? (
                          <Box
                            display="flex"
                            flexWrap="wrap"
                            className={"max-w-24"}
                            gap={0.5}
                          >
                            {noteData.text.map((note, idx) => (
                              <Tooltip
                                key={idx}
                                title={`${note}${
                                  noteData.durations && noteData.durations[idx]
                                    ? ` (${noteData.durations[idx]} دقيقة)`
                                    : ""
                                }`}
                                arrow
                              >
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: idx * 0.1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 13,
                                      height: 13,
                                      borderRadius: "20%",
                                      backgroundColor: noteData.colors[idx],
                                    }}
                                  />
                                </motion.div>
                              </Tooltip>
                            ))}
                          </Box>
                        ) : (
                          <span> . </span>
                        )}
                      </Box>
                    </Tooltip>
                  </motion.td>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NodesTable;

// import { getEnglishDay } from "@/constants";
// import { ITeacher } from "@/lib/models/Teacher";
// import { Lesson } from "@/lib/models/WeeklySchedule";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import React from "react";

// const NodesTable = ({
//   handleCellClick,
//   notes,
//   schedule,
// }: {
//   handleCellClick: (day: string, t: string) => void;
//   notes: {
//     [key: string]: { text: string[]; colors: string[]; durations?: string[] };
//   };
//   schedule: {
//     teacher: ITeacher;
//     weekStartDate: Date;
//     lessons: Lesson[];
//   } | null;
// }) => {
//   return (
//     <TableContainer>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell sx={{ border: "1px solid black", textAlign: "center" }}>
//               اليوم
//             </TableCell>
//             {[...Array(8)].map((_, index) => (
//               <Tooltip title={`الحصة ${index + 1}`} arrow key={index}>
//                 <TableCell
//                   sx={{ border: "1px solid black", textAlign: "center" }}
//                 >
//                   الحصة {index + 1}
//                 </TableCell>
//               </Tooltip>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"].map((day) => (
//             <TableRow key={day}>
//               <TableCell
//                 sx={{ border: "1px solid black", textAlign: "center" }}
//               >
//                 <Tooltip title={day} arrow>
//                   <Box sx={{ cursor: "pointer" }}>{day}</Box>
//                 </Tooltip>
//               </TableCell>
//               {[...Array(8)].map((_, i) => {
//                 const period = i + 1;
//                 const key = `${day}-${period}`;
//                 const noteData = notes[key];
//                 let title = schedule?.lessons
//                   .map((e) =>
//                     e.day ===
//                       getEnglishDay(
//                         day as
//                           | "الأحد"
//                           | "الاثنين"
//                           | "الثلاثاء"
//                           | "الأربعاء"
//                           | "الخميس"
//                       ) && e.period === +period
//                       ? e
//                       : null
//                   )
//                   .filter((e) => e !== null)[0]?.title;
//                 return (
//                   <TableCell
//                     sx={{
//                       border: "1px solid black",
//                       textAlign: "center",
//                       cursor: "pointer",
//                     }}
//                     className={"max-w-24"}
//                     key={period}
//                     onClick={() => handleCellClick(day, `${period}`)}
//                   >
//                     {title && (
//                       <Typography className=" font-bold text-[23px] text-center w-full ">
//                         {title}
//                       </Typography>
//                     )}
//                     <Tooltip
//                       title={noteData ? "" : "اضغط لإدخال ملاحظة"}
//                       className="w-full"
//                       arrow
//                     >
//                       <Box className={"max-w-24 w-full"}>
//                         {noteData ? (
//                           <Box
//                             display="flex"
//                             flexWrap="wrap"
//                             className={"max-w-24"}
//                             gap={0.5}
//                           >
//                             {noteData.text.map((note, idx) => (
//                               <Tooltip
//                                 key={idx}
//                                 title={`${note}${
//                                   noteData.durations && noteData.durations[idx]
//                                     ? ` (${noteData.durations[idx]} دقيقة)`
//                                     : ""
//                                 }`}
//                                 arrow
//                               >
//                                 <Box
//                                   sx={{
//                                     width: 13,
//                                     height: 13,
//                                     borderRadius: "20%",
//                                     backgroundColor: noteData.colors[idx],
//                                   }}
//                                 />
//                               </Tooltip>
//                             ))}
//                           </Box>
//                         ) : (
//                           <span> . </span>
//                         )}
//                       </Box>
//                     </Tooltip>
//                   </TableCell>
//                 );
//               })}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default NodesTable;
