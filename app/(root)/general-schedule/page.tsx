"use client"
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Tooltip, Button, Box, Typography } from "@mui/material";
import { buttonStyles } from "@/constants";
import Grid from "@mui/material/Grid2";
import { useRouter } from 'next/navigation';

const ExcelViewer = () => {
  let router = useRouter()
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const handleFileUpload = async () => {
    if (fileUrl) {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        alert("فشل تحميل الملف!");
        return;
      }
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const cols = json[0].map((header: any, index: number) => ({
        field: String(index),
        headerName: header || `Column ${index + 1}`,
        width: 150,
      }));

      const rowData = json.slice(1)
        .map((row: any[], rowIndex: number) => {
          const rowObj: any = { id: rowIndex };
          row.forEach((cell, cellIndex) => {
            rowObj[String(cellIndex)] = cell;
          });
          return rowObj;
        })
        .filter(row => Object.values(row).some(cell => cell !== null && cell !== ""));

      setColumns(cols);
      setRows(rowData);
    } else {
      alert("يرجى إدخال رابط ملف Excel!");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(fileUrl);
    alert("تم نسخ الرابط للمشاركة!");
  };

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
    router.back()
  };

  return (
    <Box sx={{ p: "0px 3px 3px 3px" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 4, md: 2 }}>
          <p className={`${buttonStyles} text-center -translate-y-20`}> استعراض الجدول العام</p>
        </Grid>
      </Grid>
      <Box sx={{ mb: 2 }}>
        {/* Input for the Excel file URL */}
        <input
          type="text"
          placeholder="أدخل رابط ملف Excel"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />
        <Button variant="contained" onClick={handleFileUpload}>تحميل الملف</Button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 10 }}>
          {rows.length > 0 ? (
            <div style={{ height: isZoomed ? 600 : 400, width: "100%" }} id="data-grid">
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#fcdc69",
                    color: "#000",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-cell": {
                    color: "#000",
                  },
                  "& .MuiDataGrid-row:nth-of-type(even)": {
                    backgroundColor: "#fffce9",
                  },
                  "& .MuiDataGrid-row:nth-of-type(odd)": {
                    backgroundColor: "#ecf8fd",
                  },
                }}
                pageSizeOptions={[10]}
              />
            </div>
          ) : (
            <Typography variant="body1">يرجى تحميل ملف Excel لعرض البيانات.</Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Tooltip title="طباعة">
              <Button variant="contained" className={buttonStyles} onClick={handleDownload}>طباعة</Button>
            </Tooltip>
            <Tooltip title="مشاركة">
              <Button variant="contained" className={buttonStyles} onClick={handleShare}>مشاركة</Button>
            </Tooltip>
            <Tooltip title="تنزيل">
              <Button variant="contained" className={buttonStyles} onClick={handleDownload}>تنزيل</Button>
            </Tooltip>
            <Tooltip title="تكبير">
              <Button variant="contained" className={buttonStyles} onClick={handleZoom}>
                {isZoomed ? "تصغير" : "تكبير"}
              </Button>
            </Tooltip>
            <Tooltip title="عودة">
              <Button variant="contained" className={buttonStyles} onClick={handleReset}>عودة</Button>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExcelViewer;
