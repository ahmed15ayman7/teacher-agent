import React, { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { getNoteColor } from "@/constants";

const DialogNode = ({
  handleSaveNote,
  handleClose,
  selectedCell,
  selectedNotes,
  handleNoteChange,
  duration,
  duration2,
  setDuration,
  setDuration2,
  customNote,
  setCustomNote,
  open,
  title,
  setTitle,
}: {
  open: boolean;
  handleSaveNote: () => void;
  handleClose: () => void;
  selectedCell: { day: string; period: string };
  selectedNotes: string[];
  handleNoteChange: (event: any) => void;
  title: string;
  duration: string;
  duration2: string;
  setDuration: (t: string) => void;
  setDuration2: (t: string) => void;
  customNote: string;
  setTitle: (s: string) => void;
  setCustomNote: (s: string) => void;
}) => {
  let options = [
    "غائب",
    "متأخر",
    "خروج مبكر",
    "لم يرسل خطة أسبوعية",
    "لم يحضر الدرس",
  ];
  let SelectedNotesRender = selectedNotes.filter((note) =>
    options.includes(note)
  );

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>إدخال الملاحظات</DialogTitle>
      <DialogContent className="flex gap-3 flex-col">
        <div className="flex justify-evenly">
          <Typography>اليوم: {selectedCell?.day}</Typography>
          <Typography>الحصة: {selectedCell?.period}</Typography>
        </div>
        <FormControl fullWidth>
          <TextField
            label=" اضافة عنوان "
            variant="outlined"
            sx={{
              "& .MuiInputLabel-root": {
                color: "#006d4e", // تغيير لون التسمية (label)
              },
              color: "#000",
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update custom note state
            fullWidth
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>اختر الملاحظات</InputLabel>
          <Select
            multiple
            value={SelectedNotesRender}
            onChange={(e) => handleNoteChange(e)}
            renderValue={(selected) => (selected as string[]).join(", ")}
          >
            {options.map((note) => (
              <MenuItem key={note} value={note}>
                {note}
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: getNoteColor(note),
                    borderRadius: "50%",
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="flex gap-2">
          {selectedNotes.includes("متأخر") && (
            <FormControl fullWidth>
              <TextField
                label="المدة (دقائق) - متأخر"
                type="number"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                variant="outlined"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                fullWidth
              />
            </FormControl>
          )}
          {selectedNotes.includes("خروج مبكر") && (
            <FormControl fullWidth>
              <TextField
                label="المدة (دقائق) - خروج مبكر"
                type="number"
                variant="outlined"
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#006d4e", // تغيير لون التسمية (label)
                  },
                  color: "#000",
                }}
                value={duration2}
                onChange={(e) => setDuration2(e.target.value)}
                fullWidth
              />
            </FormControl>
          )}
        </div>
        <FormControl fullWidth>
          <TextField
            label=" اضافة ملاحظة "
            variant="outlined"
            sx={{
              "& .MuiInputLabel-root": {
                color: "#006d4e", // تغيير لون التسمية (label)
              },
              color: "#000",
            }}
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)} // Update custom note state
            fullWidth
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          إلغاء
        </Button>
        <Button onClick={handleSaveNote} color="primary">
          حفظ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogNode;
