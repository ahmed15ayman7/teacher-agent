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
}: {
  open: boolean;
  handleSaveNote: () => void;
  handleClose: () => void;
  selectedCell: { day: string; period: string };
  selectedNotes: string[];
  handleNoteChange: (event: any) => void;
  duration: string;
  duration2: string;
  setDuration: (t: string) => void;
  setDuration2: (t: string) => void;
  customNote: string;
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
  useEffect(() => {
    setCustomNote(selectedNotes.filter((note) => !options.includes(note))[0]);
  }, [selectedNotes]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>إدخال الملاحظات</DialogTitle>
      <DialogContent className="flex gap-3 flex-col">
        <Typography>اليوم: {selectedCell?.day}</Typography>
        <Typography>الحصة: {selectedCell?.period}</Typography>
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
        {selectedNotes.includes("متأخر") && (
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
        )}
        {selectedNotes.includes("خروج مبكر") && (
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
        )}
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
