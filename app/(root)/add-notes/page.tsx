"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Grid2 from "@mui/material/Grid2";
import {
  buttonStyles,
  generateLessonNotes,
  generateNoteDisplay,
  getArabicDay,
  getEnglishDay,
  getNoteColor,
} from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import AddNotes from "@/components/shared/AddNotes";
import { ITeacher } from "@/lib/models/Teacher";
import { Lesson } from "@/lib/models/WeeklySchedule";
import { toast } from "react-toastify";
import { handleSaveNoteHandler } from "@/hook/notesFunctions";
import { handleSelectTeacherHandler } from "@/hook/teacherFunctions";
const Dashboard = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek + 0 * 7);
  const thursday = new Date(sunday);
  thursday.setDate(sunday.getDate() + 4);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const start = sunday.toLocaleDateString("en-US", options);
  const end = thursday.toLocaleDateString("en-US", options);
  let search = useSearchParams();
  let TeacherId = search.get("id");
  const [open, setOpen] = useState(false);
  const [START_END_WEEK, setSTART_END_WEEK] = useState<{
    start: Date;
    end: Date;
  }>({ start: sunday, end: thursday });
  const [selectedCell, setSelectedCell] = useState<{
    day: string;
    period: string;
  } | null>(null);
  const [schedule, setSchedule] = useState<{
    teacher: ITeacher;
    weekStartDate: Date;
    lesson: Lesson[];
  } | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>(""); // State for custom note
  const [duration, setDuration] = useState<string>("");
  const [duration2, setDuration2] = useState<string>("");
  const [notes, setNotes] = useState<{
    [key: string]: { text: string[]; colors: string[]; durations?: string[] };
  }>({});
  let router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // State for multi-option selection
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTeacher2, setSelectedTeacher2] = useState("");
  const [loading, setLoading] = useState(false);
  const optionsUnderTable = [
    "لم يدخل الانتظار",
    "دخل الانتظار عن",
    "متأخر عن الدوام",
    "لم يفعل الإشراف",
    "خروج من المدرسة",
  ];
  useEffect(() => {
    setLoading(true);
    axios.get("/api/teachers").then((response) => {
      setTeachers(response.data);
      setLoading(false);
    });
  }, []);

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNotes([]);
    setCustomNote(""); // Reset custom note
    setDuration("");
    setSelectedOptions([]); // Reset selected options on close
  };
  //???????????????????????????
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //???????????????????????????
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //???????????????????????????
  const handleSaveNote = async () => {
    await handleSaveNoteHandler(
      selectedTeacher,
      selectedNotes,
      customNote,
      duration,
      duration2,
      selectedCell,
      START_END_WEEK,
      setNotes,
      setOpen,
      setSelectedNotes,
      setCustomNote,
      setDuration,
      setDuration2
    );
  };

  const handleSelectTeacher = async (id: string) => {
    await handleSelectTeacherHandler(
      id,
      START_END_WEEK,
      setSchedule,
      setNotes,
      setTeachers,
      setSelectedTeacher
    );
  };

  const handleNoteChange = (event: any) => {
    setSelectedNotes(event.target.value as string[]);
  };

  const handelNotesUnderTable = (options: string) => {};
  const handelSubmit = (e: any) => {
    e.preventDefault();
  };
  useEffect(() => {
    TeacherId && handleSelectTeacher(TeacherId);
  }, [TeacherId]);
  useEffect(() => {
    selectedTeacher && handleSelectTeacher(selectedTeacher);
  }, [START_END_WEEK]);

  return (
    <Box sx={{ padding: "0px 20px 20px 20px", height: "100vh" }}>
      <Grid container className={` -translate-y-20 p-0 `}>
        <Grid2 size={{ md: 2, sm: 4, xs: 4 }}>
          <p className={`${buttonStyles} text-center  px-5 `}>
            {!TeacherId ? " ادخل الملاحظات" : "استعراض الجدول"}
          </p>
        </Grid2>
      </Grid>
      <Grid container spacing={2}>
        {/* Legend */}
        <AddNotes
          handelNotesUnderTable={handelNotesUnderTable}
          selectedTeacher2={selectedTeacher2}
          setSelectedTeacher2={setSelectedTeacher2}
          selectedTeacher={selectedTeacher}
          customNote={customNote}
          duration={duration}
          duration2={duration2}
          setDuration={setDuration}
          setDuration2={setDuration2}
          setCustomNote={setCustomNote}
          schedule={schedule}
          selectedCell={selectedCell}
          TeacherId={TeacherId}
          handleSelectTeacher={handleSelectTeacher}
          setSTART_END_WEEK={({ start, end }: { start: Date; end: Date }) =>
            setSTART_END_WEEK({ start: start, end: end })
          }
          setSelectedCell={setSelectedCell}
          handleClose={handleClose}
          open={open}
          setOpen={setOpen}
          notes={notes}
          teachers={teachers}
          setSelectedNotes={setSelectedNotes}
          selectedNotes={selectedNotes}
          handleNoteChange={handleNoteChange}
          handleOptionChange={handleOptionChange}
          selectedOptions={selectedOptions}
          handleSaveNote={handleSaveNote}
        />
        <Grid item xs={12} md={2}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Tooltip title="حفظ">
              <Button
                variant="contained"
                className={buttonStyles}
                onClick={handelSubmit}
              >
                حفظ
              </Button>
            </Tooltip>
            <Tooltip title="عودة">
              <Button
                variant="contained"
                className={buttonStyles}
                onClick={() => router.back()}
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

const page = () => {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
};

export default page;

// "use client";
// import React, { useEffect, useState } from "react";
// import { Box, Button, Tooltip } from "@mui/material";
// import axios from "axios";
// import Grid from "@mui/material/Grid";
// import Grid2 from "@mui/material/Grid2";
// import {
//   buttonStyles,
//   generateLessonNotes,
//   generateNoteDisplay,
//   getArabicDay,
//   getEnglishDay,
//   getNoteColor,
// } from "@/constants";
// import { useRouter, useSearchParams } from "next/navigation";
// import AddNotes from "@/components/shared/AddNotes";
// import { ITeacher } from "@/lib/models/Teacher";
// import { Lesson } from "@/lib/models/WeeklySchedule";
// import { toast } from "react-toastify";
// const Dashboard = () => {
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   const sunday = new Date(today);
//   sunday.setDate(today.getDate() - dayOfWeek + 0 * 7);
//   const thursday = new Date(sunday);
//   thursday.setDate(sunday.getDate() + 4);
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "numeric",
//     day: "numeric",
//   };
//   const start = sunday.toLocaleDateString("en-US", options);
//   const end = thursday.toLocaleDateString("en-US", options);
//   let search = useSearchParams();
//   let TeacherId = search.get("id");
//   const [open, setOpen] = useState(false);
//   const [START_END_WEEK, setSTART_END_WEEK] = useState<{
//     start: Date;
//     end: Date;
//   }>({ start: sunday, end: thursday });
//   const [selectedCell, setSelectedCell] = useState<{
//     day: string;
//     period: string;
//   } | null>(null);
//   const [schedule, setSchedule] = useState<{
//     teacher: ITeacher;
//     weekStartDate: Date;
//     lesson: Lesson[];
//   } | null>(null);
//   const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
//   const [customNote, setCustomNote] = useState<string>(""); // State for custom note
//   const [duration, setDuration] = useState<string>("");
//   const [duration2, setDuration2] = useState<string>("");
//   const [notes, setNotes] = useState<{
//     [key: string]: { text: string[]; colors: string[]; durations?: string[] };
//   }>({});
//   let router = useRouter();
//   const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // State for multi-option selection
//   const [teachers, setTeachers] = useState([]);
//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [selectedTeacher2, setSelectedTeacher2] = useState("");
//   const [loading, setLoading] = useState(false);
//   const optionsUnderTable = [
//     "لم يدخل الانتظار",
//     "دخل الانتظار عن",
//     "متأخر عن الدوام",
//     "لم يفعل الإشراف",
//     "خروج من المدرسة",
//   ];
//   useEffect(() => {
//     setLoading(true);
//     axios.get("/api/teachers").then((response) => {
//       setTeachers(response.data);
//       setLoading(false);
//     });
//   }, []);

//   const handleOptionChange = (option: string) => {
//     setSelectedOptions((prev) =>
//       prev.includes(option)
//         ? prev.filter((o) => o !== option)
//         : [...prev, option]
//     );
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedNotes([]);
//     setCustomNote(""); // Reset custom note
//     setDuration("");
//     setSelectedOptions([]); // Reset selected options on close
//   };
//   //???????????????????????????
//   //!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   //???????????????????????????
//   //!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   //???????????????????????????
//   const handleSaveNote = async () => {
//     const toastId = toast.loading("جاري حفظ الملاحظات");
//     if (selectedTeacher) {
//       if (selectedNotes.length > 0 || customNote) {
//         const noteColors = [
//           ...selectedNotes.map(getNoteColor),
//           customNote ? "blue" : "",
//         ];
//         const noteDurations = [
//           ...selectedNotes.map((note) =>
//             note === "متأخر" ? duration : note === "خروج مبكر" ? duration2 : ""
//           ),
//           customNote ? duration : "",
//         ];

//         setNotes((prev) => ({
//           ...prev,
//           [`${selectedCell?.day}-${selectedCell?.period}`]: {
//             text: [...selectedNotes, customNote].filter((note) => note), // Include custom note
//             colors: noteColors,
//             durations: noteDurations,
//           },
//         }));

//         let notes = generateLessonNotes(selectedNotes, +duration, +duration2);
//         let lesson = {
//           day: getEnglishDay(
//             selectedCell?.day as
//               | "الأحد"
//               | "الاثنين"
//               | "الثلاثاء"
//               | "الأربعاء"
//               | "الخميس"
//           ),
//           period: parseInt(selectedCell?.period!),
//           notes: notes,
//         };
//         let startWeek = START_END_WEEK.start.toLocaleDateString(
//           "en-US",
//           options
//         );
//         console.log(selectedCell?.period!);
//         console.log(selectedTeacher);
//         console.log(startWeek);
//         console.log(notes);
//         console.log(lesson);
//         try {
//           const response = await axios.post("/api/schedule/add-lesson", {
//             teacherId: selectedTeacher,
//             weekStartDate: startWeek,
//             lesson,
//           });
//           if (response.status === 200) {
//             toast.update(toastId, {
//               render: "تم الحفظ بنجاح",
//               type: "success",
//               isLoading: false,
//               autoClose: 3000,
//             });
//           } else {
//             toast.update(toastId, {
//               render: `خطأ:${response.data?.error}`,
//               type: "error",
//               isLoading: false,
//               autoClose: 3000,
//             });
//           }
//         } catch (error: any) {
//           toast.update(toastId, {
//             render: `خطأ:${error}`,
//             type: "error",
//             isLoading: false,
//             autoClose: 3000,
//           });
//         }
//       }
//     } else {
//       toast.update(toastId, {
//         render: `يرجي اختيار المعلم`,
//         type: "error",
//         isLoading: false,
//         autoClose: 3000,
//       });
//     }

//     handleClose();
//   };

//   const handleNoteChange = (event: any) => {
//     setSelectedNotes(event.target.value as string[]);
//   };
//   const handleSelectTeacher = async (id: any) => {
//     try {
//       // Fetch the schedule data
//       const start = START_END_WEEK.start.toLocaleDateString("en-US", options);
//       const end = START_END_WEEK.end.toLocaleDateString("en-US", options);
//       const response = await axios.get(
//         `/api/schedule?TeacherId=${id}&&start=${start}&&end=${end}`
//       );
//       const fetchedSchedule = response.data[0];
//       console.log(fetchedSchedule);
//       // Update schedule state
//       setSchedule(fetchedSchedule);
//       setSelectedTeacher(id);
//       // Initialize a temporary notes object
//       const updatedNotes: {
//         [key: string]: {
//           text: string[];
//           colors: string[];
//           durations?: string[];
//         };
//       } = {};

//       // Loop through each lesson and generate notes
//       fetchedSchedule?.lessons.forEach((lesson: Lesson) => {
//         const note = generateNoteDisplay(lesson.notes);
//         const key = `${getArabicDay(lesson.day)}-${lesson.period}`;
//         updatedNotes[key] = note;
//       });

//       // Update notes state
//       setNotes(updatedNotes);
//     } catch (error) {
//       console.error("Error fetching schedule:", error);
//     }
//   };
//   const handelSubmit = (e: any) => {
//     e.preventDefault();
//   };
//   useEffect(() => {
//     TeacherId && handleSelectTeacher(TeacherId);
//   }, [TeacherId]);
//   useEffect(() => {
//     selectedTeacher && handleSelectTeacher(selectedTeacher);
//   }, [START_END_WEEK]);

//   return (
//     <Box sx={{ padding: "0px 20px 20px 20px", height: "100vh" }}>
//       <Grid container className={` -translate-y-20 p-0 `}>
//         <Grid2 size={{ md: 2, sm: 4, xs: 4 }}>
//           <p className={`${buttonStyles} text-center  px-5 `}>
//             {!TeacherId ? " ادخل الملاحظات" : "استعراض الجدول"}
//           </p>
//         </Grid2>
//       </Grid>
//       <Grid container spacing={2}>
//         {/* Legend */}
//         <AddNotes
//           selectedTeacher2={selectedTeacher2}
//           setSelectedTeacher2={setSelectedTeacher2}
//           selectedTeacher={selectedTeacher}
//           customNote={customNote}
//           duration={duration}
//           duration2={duration2}
//           setDuration={setDuration}
//           setDuration2={setDuration2}
//           setCustomNote={setCustomNote}
//           schedule={schedule}
//           selectedCell={selectedCell}
//           TeacherId={TeacherId}
//           handleSelectTeacher={handleSelectTeacher}
//           setSTART_END_WEEK={({ start, end }: { start: Date; end: Date }) =>
//             setSTART_END_WEEK({ start: start, end: end })
//           }
//           setSelectedCell={setSelectedCell}
//           handleClose={handleClose}
//           open={open}
//           setOpen={setOpen}
//           notes={notes}
//           teachers={teachers}
//           setSelectedNotes={setSelectedNotes}
//           selectedNotes={selectedNotes}
//           handleNoteChange={handleNoteChange}
//           handleOptionChange={handleOptionChange}
//           selectedOptions={selectedOptions}
//           handleSaveNote={handleSaveNote}
//         />
//         <Grid item xs={12} md={2}>
//           <Box display="flex" flexDirection="column" gap={1}>
//             <Tooltip title="حفظ">
//               <Button
//                 variant="contained"
//                 className={buttonStyles}
//                 onClick={handelSubmit}
//               >
//                 حفظ
//               </Button>
//             </Tooltip>
//             <Tooltip title="عودة">
//               <Button
//                 variant="contained"
//                 className={buttonStyles}
//                 onClick={() => router.back()}
//               >
//                 عودة
//               </Button>
//             </Tooltip>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;
