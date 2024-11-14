import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { buttonStyles, getNoteColor } from "@/constants";
import NodesTable from "./NodesTable";
import DialogNode from "./DialogNode";
import SchoolWeekDates from "./SchoolWeekDates";
import { ITeacher } from "@/lib/models/Teacher";
import { Lesson } from "@/lib/models/WeeklySchedule";

const AddNotes = ({
  handleSaveNote,
  selectedCell,
  setSelectedCell,
  handleClose,
  setSelectedNotes,
  notes,
  handleOptionChange,
  handleNoteChange,
  selectedNotes,
  selectedOptions,
  handleSelectTeacher,
  teachers,
  open,
  setOpen,
  setCustomNote,
  customNote,
  setSTART_END_WEEK,
  TeacherId,
  schedule,
  duration,
  duration2,
  setDuration,
  selectedTeacher,
  setDuration2,
  selectedTeacher2,
  setSelectedTeacher2,
  handelNotesUnderTable,
}: {
  TeacherId: string | null;
  setSTART_END_WEEK: ({ start, end }: { start: Date; end: Date }) => void;
  open: boolean;
  setOpen: (_: boolean) => void;
  handleSaveNote: () => void;
  setSelectedNotes: (s: string[]) => void;
  duration: string;
  duration2: string;
  selectedTeacher: string;
  selectedTeacher2: string;
  customNote: string;
  handelNotesUnderTable: (s: string) => void;
  setSelectedTeacher2: (s: string) => void;
  setCustomNote: (s: string) => void;
  setDuration: (s: string) => void;
  setDuration2: (s: string) => void;
  notes: {
    [key: string]: { text: string[]; colors: string[]; durations?: string[] };
  };
  handleClose: () => void;
  handleOptionChange: (option: string) => void;
  handleNoteChange: (event: any) => void;
  selectedOptions: string[];
  selectedNotes: string[];
  handleSelectTeacher: (e: any) => void;
  teachers: any[];
  selectedCell: { day: string; period: string } | null;
  setSelectedCell: ({ day, period }: { day: string; period: string }) => void;
  schedule: { teacher: ITeacher; weekStartDate: Date; lesson: Lesson[] } | null;
}) => {
  const handleCellClick = (day: string, period: string) => {
    setSelectedCell({ day, period });
    setOpen(true);
    setDuration("");
    setCustomNote("");
    setSelectedNotes(
      notes && notes[`${day}-${period}`] ? notes[`${day}-${period}`]?.text : []
    );
  };

  const options = [
    "لم يدخل الانتظار",
    "دخل الانتظار عن",
    "متأخر عن الدوام",
    "لم يفعل الإشراف",
    "خروج من المدرسة",
  ];

  return (
    <Grid item xs={12} md={10}>
      <Box display="flex" gap={2} my={2}>
        {[
          "غائب",
          "متأخر",
          "خروج مبكر",
          "لم يرسل خطة أسبوعية",
          "لم يحضر الدرس",
        ].map((note) => (
          <Box key={note} display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: getNoteColor(note),
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2">{note}</Typography>
          </Box>
        ))}
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 12,
              height: 12,
              backgroundColor: "blue",
              borderRadius: "50%",
            }}
          />
          <Typography variant="body2">الملاحظات</Typography>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        my={2}
      >
        <SchoolWeekDates
          StartDate={schedule?.weekStartDate}
          setSTART_END_WEEK={({ start, end }: { start: Date; end: Date }) =>
            setSTART_END_WEEK({ start: start, end: end })
          }
        />
        <FormControl variant="outlined" sx={{ width: "150px" }}>
          {/* <InputLabel>اختر المعلم</InputLabel> */}
          <div className="select-container px-1 pr-0 ">
            <select
              value={selectedTeacher!}
              onChange={(e) => {
                handleSelectTeacher(e.target.value);
              }}
              className="custom-select  flex-grow mx-2 h-full"
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
                <option
                  key={teacher._id}
                  selected={
                    TeacherId && TeacherId === teacher._id ? true : false
                  }
                  value={teacher._id}
                >
                  {teacher.name}
                </option>
              ))}
            </select>
            <span className="custom-icon">▼</span>
          </div>
        </FormControl>
      </Box>
      {/* Table */}
      <NodesTable
        notes={notes}
        handleCellClick={handleCellClick}
        schedule={schedule}
      />

      {/* Multi-Select Options */}
      <div className="flex items-center gap-3 mt-3">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center z-[10000000] bg-gray-300 text-black px-2  rounded-md cursor-pointer  "
          >
            <label
              key={index}
              className="flex items-center bg-gray-300 text-black px-4 py-2 rounded-md cursor-pointer gap-3 "
            >
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
                className="mr-2"
              />
              <span>{option}</span>
            </label>
            {option === "دخل الانتظار عن" ? (
              <div className="select-container ttt px-1 pr-0 ">
                <select
                  value={selectedTeacher2}
                  onChange={(e) => {
                    setSelectedTeacher2(e.target.value);
                  }}
                  className="custom-select  flex-grow mx-2 h-full"
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
                  <option value="" disabled selected>
                    اختر المعلم
                  </option>
                  {teachers.map((teacher: any, i) => (
                    <option key={i} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                <span className="custom-icon">▼</span>
              </div>
            ) : option === "متأخر عن الدوام" ? (
              <input
                type="text"
                placeholder="المده"
                className="mr-2 w-20 text-center"
              />
            ) : (
              ""
            )}
          </div>
        ))}
      </div>

      {/* Dialog for Adding Notes */}
      <DialogNode
        duration={duration}
        duration2={duration2}
        customNote={customNote}
        open={open}
        handleClose={handleClose}
        handleNoteChange={handleNoteChange}
        handleSaveNote={handleSaveNote}
        selectedCell={selectedCell!}
        selectedNotes={selectedNotes}
        setCustomNote={setCustomNote}
        setDuration={setDuration}
        setDuration2={setDuration2}
      />
    </Grid>
  );
};

export default AddNotes;
