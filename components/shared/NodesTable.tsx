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
} from "@mui/material";
import React from "react";

const NodesTable = ({
  handleCellClick,
  notes,
  schedule,
}: {
  handleCellClick: (day: string, t: string) => void;
  notes: {
    [key: string]: { text: string[]; colors: string[]; durations?: string[] };
  };
  schedule: { teacher: ITeacher; weekStartDate: Date; lesson: Lesson[] } | null;
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: "1px solid black", textAlign: "center" }}>
              اليوم
            </TableCell>
            {[...Array(8)].map((_, index) => (
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
              {[...Array(8)].map((_, i) => {
                const period = i + 1;
                const key = `${day}-${period}`;
                const noteData = notes[key];
                return (
                  <TableCell
                    sx={{ border: "1px solid black", textAlign: "center" }}
                    className={"max-w-24"}
                    key={period}
                  >
                    <Tooltip title={noteData ? "" : "اضغط لإدخال ملاحظة"} arrow>
                      <Box
                        onClick={() => handleCellClick(day, `${period}`)}
                        sx={{ cursor: "pointer" }}
                        className={"max-w-24"}
                      >
                        {noteData ? (
                          <Box
                            display="flex"
                            flexWrap="wrap"
                            className={"max-w-24"}
                            gap={0.5}
                          >
                            {noteData.text.map((note, idx) =>
                              noteData.colors[idx] === "blue" ? (
                                <Tooltip
                                  key={idx}
                                  className=" order-first w-full"
                                  title={`${note}${
                                    noteData.durations &&
                                    noteData.durations[idx]
                                      ? ` (${noteData.durations[idx]} دقيقة)`
                                      : ""
                                  }`}
                                  arrow
                                >
                                  <div className="flex justify-evenly">
                                    {note}
                                    <Box
                                      sx={{
                                        width: 13,
                                        height: 13,
                                        borderRadius: "20%",
                                        backgroundColor: noteData.colors[idx],
                                      }}
                                    />
                                  </div>
                                </Tooltip>
                              ) : (
                                <Tooltip
                                  key={idx}
                                  title={`${note}${
                                    noteData.durations &&
                                    noteData.durations[idx]
                                      ? ` (${noteData.durations[idx]} دقيقة)`
                                      : ""
                                  }`}
                                  arrow
                                >
                                  <Box
                                    sx={{
                                      width: 13,
                                      height: 13,
                                      borderRadius: "20%",
                                      backgroundColor: noteData.colors[idx],
                                    }}
                                  />
                                </Tooltip>
                              )
                            )}
                          </Box>
                        ) : (
                          <span> . </span>
                        )}
                      </Box>
                    </Tooltip>
                  </TableCell>
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

// import { generateNoteDisplay } from "@/constants";
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
// } from "@mui/material";
// import React from "react";

// const NodesTable = ({
//   handleCellClick,
//   schedule,
//   notes,
// }: {
//   handleCellClick: (day: string, t: string) => void;
//   notes: {
//     [key: string]: { text: string[]; colors: string[]; durations?: string[] };
//   };
//   schedule: { teacher: ITeacher; weekStartDate: Date; lesson: Lesson[] } | null;
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
//               <Tooltip title={`الحصة ${8 - index}`} arrow key={index}>
//                 <TableCell
//                   sx={{ border: "1px solid black", textAlign: "center" }}
//                 >
//                   الحصة {8 - index}
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
//                 const period = `الحصة ${8 - i}`;
//                 const lesson = schedule?.lesson.find(
//                   (lesson) => lesson.day === day && lesson.period === 8 - i
//                 );

//                 const noteData2 = lesson
//                   ? generateNoteDisplay(lesson.notes)
//                   : null;
//                 let noteData = noteData2 ? noteData2 : null;

//                 return (
//                   <TableCell
//                     sx={{ border: "1px solid black", textAlign: "center" }}
//                     className={"max-w-24"}
//                     key={period}
//                   >
//                     <Tooltip title={noteData ? "" : "اضغط لإدخال ملاحظة"} arrow>
//                       <Box
//                         onClick={() => handleCellClick(day, period)}
//                         sx={{ cursor: "pointer" }}
//                         className={"max-w-24"}
//                       >
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
//                             >
//                                 <Box
//                                 sx={{
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
