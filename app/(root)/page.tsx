"use client";
import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation"; // Or use react-router-dom if not using Next.js
import { useQuery } from "@tanstack/react-query";
import { getSchoolData, setSchoolData } from "@/lib/actions/user.action";
import { buttonStyles } from "@/constants";

const MenuButtons = () => {
  const router = useRouter();

  // Function to handle routing
  const handleRoute = (path: string) => {
    router.push(path);
  };

  let { data: SchoolData, isLoading } = useQuery({
    queryKey: ["SchoolData"],
    queryFn: () => getSchoolData(),
  });
  return (
    <div className="flex flex-col items-center justify-center p-4 pt-0 space-y-4 min-h-52">
      <div className="w-full max-w-md p-2 text-center">
        <div className="p-4 bg-gradient-to-r from-green-700 to-blue-900 text-white font-bold text-lg mb-4 rounded-lg shadow-md shadow-blue-500/50">
          مدرسة:{" "}
          {!isLoading && SchoolData && SchoolData.schoolName
            ? SchoolData.schoolName
            : "______________"}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Buttons with routing */}
          <Button
            variant="contained"
            className={buttonStyles}
            onClick={() => handleRoute("/prepare-program")}
          >
            إعداد البرنامج
          </Button>
          <Button
            variant="contained"
            className={buttonStyles}
            onClick={() => handleRoute("/general-schedule")}
          >
            استعراض الجدول العام
          </Button>
          <Button
            variant="contained"
            className={buttonStyles}
            onClick={() => handleRoute("/teacher-info")}
          >
            استعراض بيانات معلم
          </Button>
          <Button
            variant="contained"
            className={buttonStyles}
            onClick={() => handleRoute("/add-notes")}
          >
            إدخال الملاحظات
          </Button>
          <Button
            variant="contained"
            className={buttonStyles}
            onClick={() => handleRoute("/send-reports")}
          >
            إرسال التقارير
          </Button>
          <Button
            variant="contained"
            className={buttonStyles}
            onClick={() => handleRoute("/support-forms")}
          >
            نماذج مساعدة
          </Button>
        </div>
        <div className="flex justify-center mt-6 gap-36">
          <Button
            className={buttonStyles}
            variant="contained"
            onClick={() => handleRoute("/save")}
          >
            حفظ
          </Button>
          <Button
            className={buttonStyles}
            variant="contained"
            onClick={async () => {
              await setSchoolData();
              handleRoute("/login");
            }}
          >
            خروج
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuButtons;
