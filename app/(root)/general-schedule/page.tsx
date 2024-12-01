"use client";
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Tooltip, Button, Box, Typography } from "@mui/material";
import { buttonStyles, generatePDF } from "@/constants";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import TeacherScheduleTable from "@/components/shared/TeacherScheduleTable";
import { getSchoolData } from "@/lib/actions/user.action";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const ExcelViewer = () => {
  let router = useRouter();
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleShare = () => {
    navigator.clipboard.writeText(location.href);
    toast.success("تم نسخ الرابط للمشاركة!");
  };
  let { data: SchoolData, isLoading } = useQuery({
    queryKey: ["SchoolData"],
    queryFn: () => getSchoolData(),
  });
  let { data: teachers, isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      let response = await axios.get(
        `/api/teachers?schoolId=${SchoolData._id}&&i=1`
      );
      return response.data;
    },
  });
  const tableRef = useRef<HTMLDivElement>(null);
  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleReset = () => {
    router.back();
  };
  return (
    <Box sx={{ p: "0px 3px 3px 3px" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 4, md: 2 }}>
          <p className={`${buttonStyles} text-center -translate-y-20`}>
            {" "}
            استعراض الجدول العام
          </p>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 10 }}>
          {!isLoading &&
          !isLoadingTeachers &&
          (teachers as any[]).length > 0 &&
          SchoolData ? (
            <div style={{ width: "100%" }}>
              <TeacherScheduleTable
                teachers={teachers}
                tableRef={tableRef}
                schoolName={SchoolData.schoolName}
              />
            </div>
          ) : (
            <div className="w-full flex justify-center items-center h-56">
              <Typography variant="h4">
                {isLoading && isLoadingTeachers
                  ? "جاري تحميل الجدول العام ..."
                  : "لا يوجد جدول لعرضه "}
              </Typography>
            </div>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Tooltip title="طباعة">
              <Button
                variant="contained"
                className={buttonStyles}
                onClick={async () => await generatePDF(tableRef)}
              >
                طباعة
              </Button>
            </Tooltip>
            <Tooltip title="مشاركة">
              <Button
                variant="contained"
                className={buttonStyles}
                onClick={handleShare}
              >
                مشاركة
              </Button>
            </Tooltip>
            <Tooltip title="تنزيل">
              <Button
                variant="contained"
                className={buttonStyles}
                onClick={handleDownload}
              >
                تنزيل
              </Button>
            </Tooltip>
            {/* <Tooltip title="تكبير">
              <Button
                variant="contained"
                className={buttonStyles}
                onClick={handleZoom}
              >
                {isZoomed ? "تصغير" : "تكبير"}
              </Button>
            </Tooltip> */}
            <Tooltip title="عودة">
              <Button
                variant="contained"
                className={buttonStyles}
                onClick={handleReset}
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

export default ExcelViewer;
