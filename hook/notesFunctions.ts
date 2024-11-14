// notesFunctions.ts

import { toast } from "react-toastify";
import axios from "axios";
import {
  getNoteColor,
  generateCombinedNotesAndStatus,
  getEnglishDay,
} from "@/constants";

export const handleSaveNoteHandler = async (
  selectedTeacher: string,
  selectedNotes: string[],
  customNote: string,
  duration: string,
  duration2: string,
  selectedCell: { day: string; period: string } | null,
  START_END_WEEK: { start: Date; end: Date },
  setNotes: React.Dispatch<React.SetStateAction<any>>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedNotes: React.Dispatch<React.SetStateAction<string[]>>,
  setCustomNote: React.Dispatch<React.SetStateAction<string>>,
  setDuration: React.Dispatch<React.SetStateAction<string>>,
  setDuration2: React.Dispatch<React.SetStateAction<string>>,
  title: string,
  duration3: string
) => {
  const toastId = toast.loading("جاري حفظ الملاحظات");
  if (selectedTeacher) {
    if (selectedNotes.length > 0 || customNote || title) {
      const noteColors = [
        ...selectedNotes.map(getNoteColor),
        customNote ? "blue" : "",
      ];
      const noteDurations = [
        ...selectedNotes.map((note) =>
          note === "متأخر" ? duration : note === "خروج مبكر" ? duration2 : ""
        ),
        customNote ? duration : "",
      ];

      setNotes((prev: any) => ({
        ...prev,
        [`${selectedCell?.day}-${selectedCell?.period}`]: {
          text: [...selectedNotes, customNote].filter((note) => note), // Include custom note
          colors: noteColors,
          durations: noteDurations,
        },
      }));

      let notes2 = generateCombinedNotesAndStatus(
        selectedNotes,
        selectedTeacher,
        +duration,
        +duration2,
        +duration3
      );
      let lesson = {
        day: getEnglishDay(
          selectedCell?.day as
            | "الأحد"
            | "الاثنين"
            | "الثلاثاء"
            | "الأربعاء"
            | "الخميس"
        ),
        period: parseInt(selectedCell?.period!),
        notes: { ...notes2, note: customNote },
        title: title,
      };
      let startWeek = START_END_WEEK.start.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      try {
        const response = await axios.post("/api/schedule/add-lesson", {
          teacherId: selectedTeacher,
          weekStartDate: startWeek,
          lesson,
        });
        if (response.status === 200) {
          toast.update(toastId, {
            render: "تم الحفظ بنجاح",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(toastId, {
            render: `خطأ:${response.data?.error}`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } catch (error: any) {
        toast.update(toastId, {
          render: `خطأ:${error}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }
  } else {
    toast.update(toastId, {
      render: `يرجي اختيار المعلم`,
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }

  setOpen(false);
  setSelectedNotes([]);
  setCustomNote(""); // Reset custom note
  setDuration("");
  setSelectedNotes([]);
  setDuration2(""); // Reset other states
};
