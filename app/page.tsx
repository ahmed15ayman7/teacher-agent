"use client"
import React from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation'; // Or use react-router-dom if not using Next.js

const MenuButtons: React.FC = () => {
  const router = useRouter();

  // Function to handle routing
  const handleRoute = (path: string) => {
    router.push(path);
  };

  // Tailwind gradient styles for buttons
  const buttonStyles = "w-full py-2 my-2 text-white font-bold rounded-lg bg-gradient-to-r from-green-700 to-blue-900 hover:from-green-800 hover:to-blue-800 shadow-md shadow-blue-500/50";

  return (
    <div className="flex flex-col items-center justify-center p-4 pt-0 space-y-4 min-h-52">
      <div className="w-full max-w-md p-2 text-center">
        <div className="p-4 bg-gradient-to-r from-green-700 to-blue-900 text-white font-bold text-lg mb-4 rounded-lg shadow-md shadow-blue-500/50">
          مدرسة: ______________
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Buttons with routing */}
          <Button className={buttonStyles} onClick={() => handleRoute('/prepare-program')}>إعداد البرنامج</Button>
          <Button className={buttonStyles} onClick={() => handleRoute('/general-schedule')}>استعراض الجدول العام</Button>
          <Button className={buttonStyles} onClick={() => handleRoute('/teacher-info')}>استعراض بيانات معلم</Button>
          <Button className={buttonStyles} onClick={() => handleRoute('/add-notes')}>إدخال الملاحظات</Button>
          <Button className={buttonStyles} onClick={() => handleRoute('/send-reports')}>إرسال التقارير</Button>
          <Button className={buttonStyles} onClick={() => handleRoute('/support-forms')}>نماذج مساعدة</Button>
        </div>
        <div className="flex justify-center mt-6 gap-36">
          <Button className={buttonStyles} onClick={() => handleRoute('/save')}>حفظ</Button>
          <Button className={buttonStyles} onClick={() => handleRoute('/logout')}>خروج</Button>
        </div>
      </div>
    </div>
  );
};

export default MenuButtons;
