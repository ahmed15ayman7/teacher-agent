import React, { useState, useEffect } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { buttonStyles } from "@/constants";

const SchoolWeekDates = ({
  setSTART_END_WEEK,
  StartDate,
}: {
  StartDate?: Date;
  setSTART_END_WEEK: ({ start, end }: { start: Date; end: Date }) => void;
}) => {
  const [weekDates, setWeekDates] = useState({ start: "", end: "" });
  const [weekOffset, setWeekOffset] = useState(0); // Tracks the current week offset from today

  useEffect(() => {
    const calculateWeekDates = (offset = 0) => {
      const today = StartDate ? new Date(StartDate) : new Date();
      const dayOfWeek = today.getDay();

      // Find the Sunday of the current week, then adjust by week offset
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - dayOfWeek + offset * 7);

      // Find the following Thursday of the same week
      const thursday = new Date(sunday);
      thursday.setDate(sunday.getDate() + 4);

      // Update the display dates
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const start = sunday.toLocaleDateString("en-US", options);
      const end = thursday.toLocaleDateString("en-US", options);
      setWeekDates({ start, end });

      // Pass the start and end dates as Date objects to setSTART_END_WEEK
      setSTART_END_WEEK({ start: sunday, end: thursday });
    };

    calculateWeekDates(weekOffset);
  }, [weekOffset]);

  // Handlers for previous and next week navigation
  const handlePreviousWeek = () => setWeekOffset(weekOffset - 1);
  const handleNextWeek = () => setWeekOffset(weekOffset + 1);

  return (
    <Box display="flex" alignItems="center" gap={5}>
      <Tooltip title="السابق" arrow>
        <Button
          onClick={handlePreviousWeek}
          startIcon={<ArrowForward className="ml-2" />}
          className={`${buttonStyles.slice(6)} w-32 px-10`}
          variant="contained"
          sx={{ mx: 1 }}
        >
          السابق
        </Button>
      </Tooltip>
      <Typography variant="subtitle1" className="w-52">
        من {weekDates.start} الى {weekDates.end}
      </Typography>
      <Tooltip title="التالي" arrow>
        <Button
          onClick={handleNextWeek}
          endIcon={<ArrowBack className="mr-2" />}
          className={`${buttonStyles.slice(6)} w-32 px-10`}
          variant="contained"
          sx={{ mx: 1 }}
        >
          التالي
        </Button>
      </Tooltip>
    </Box>
  );
};

export default SchoolWeekDates;
