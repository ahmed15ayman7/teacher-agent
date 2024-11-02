"use client"
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,

  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SchoolSchema, schoolSchema } from '@/lib/schema/school';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


const FormComponent: React.FC = () => {
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      schoolName: '',
      principal: '',
      deputy: '',
      studentCount: '',
      teacherCount: '',
      classCount: '',
      password: '',
      confirmPassword: '',
      timePeriod: '',
      dateM: '',
      dateH: '',
      stage: '',
    },
  });
  let router = useRouter()

  const buttonStyles = "w-full py-2 my-2 text-white font-bold rounded-lg bg-gradient-to-r from-green-700 to-blue-900 hover:from-green-800 hover:to-blue-800 shadow-md shadow-blue-500/50";
  const buttonStyles2 = "w-full py-3 my-2 text-gray-900 font-bold rounded-lg bg-gray-100 hover:from-green-800  shadow-md shadow-gray-500/50";
  const onSubmit = async (data: any) => {
    const toastId = toast.loading('جارٍ إضافة المدرسة...');

    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        toast.update(toastId, {
          render: 'تمت إضافة المدرسة بنجاح!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        reset();
      } else {
        toast.update(toastId, {
          render: 'فشل في إضافة المدرسة.',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: 'حدث خطأ أثناء الإضافة.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mx: 'auto', borderRadius: 2, padding: "0px 16px 16px 16px" }}>

      <Grid container spacing={2}>
        <Grid size={{ md: 2, sm: 4, xs: 4 }}>
          <p className={`${buttonStyles} text-center -translate-y-20 `}  > إعداد البرنامج</p>
        </Grid>
      </Grid>
      <Typography variant="h5" align="center" gutterBottom>إعدادات المدرسة</Typography>
      <Grid container spacing={2}>
        <Grid size={{ md: 8, sm: 12, xs: 12 }}>
          <Controller
            name="schoolName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="اسم المدرسة"
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#006d4e',
                  },
                  color: '#000',
                }}
              />
            )}
          />

        </Grid>

        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <Controller
            name="principal"
            control={control}
            render={({ field }) => <TextField {...field}
              sx={{
                '& .MuiInputLabel-root': {
                  color: '#006d4e', // تغيير لون التسمية (label)
                },
                color: '#000',
              }} label="مدير المدرسة" fullWidth />}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="deputy"
            control={control}
            render={({ field }) => <TextField {...field} sx={{
              '& .MuiInputLabel-root': {
                color: '#006d4e', // تغيير لون التسمية (label)
              },
              color: '#000',
            }} label="وكيل الشؤون التعليمية والمدرسية" fullWidth />}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="studentCount"
            control={control}
            render={({ field }) => <TextField {...field}
              sx={{
                '& .MuiInputLabel-root': {
                  color: '#006d4e', // تغيير لون التسمية (label)
                },
                color: '#000',
              }} label="عدد طلاب المدرسة" type="number" fullWidth />}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="teacherCount"
            control={control}
            render={({ field }) => <TextField {...field} sx={{
              '& .MuiInputLabel-root': {
                color: '#006d4e', // تغيير لون التسمية (label)
              },
              color: '#000',
            }} label="عدد معلمي المدرسة" type="number" fullWidth />}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="classCount"
            control={control}
            render={({ field }) => <TextField sx={{
              '& .MuiInputLabel-root': {
                color: '#006d4e', // تغيير لون التسمية (label)
              },
              color: '#000',
            }} {...field} label="عدد فصول المدرسة" type="number" fullWidth />}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => <TextField {...field} sx={{
              '& .MuiInputLabel-root': {
                color: '#006d4e', // تغيير لون التسمية (label)
              },
              color: '#000',
            }} label="كلمة المرور الجديدة" type="password" fullWidth />}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }}>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => <TextField {...field} sx={{
              '& .MuiInputLabel-root': {
                color: '#006d4e', // تغيير لون التسمية (label)
              },
              color: '#000',
            }} label="تأكيد كلمة المرور" type="password" fullWidth />}
          />
        </Grid>
        <Grid size={{ md: 3, sm: 12, xs: 12 }} >
          <Controller
            name="timePeriod"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="ضبط الوقت" sx={{
                '& .MuiInputLabel-root': {
                  color: '#006d4e', // تغيير لون التسمية (label)
                },
                color: '#000',
              }} placeholder="HH:MM" fullWidth />
            )}
          />
        </Grid>

        <Grid size={{ md: 3, sm: 12, xs: 12 }} >
          <Controller
            name="dateH"
            control={control}
            render={({ field }) => (
              <TextField {...field} label=" ضبط التاريخ هـ" sx={{
                '& .MuiInputLabel-root': {
                  color: '#006d4e', // تغيير لون التسمية (label)
                },
                color: '#000',
              }} placeholder="DD/MM/YYYY" fullWidth />
            )}
          />
        </Grid>
        <Grid size={{ md: 3, sm: 12, xs: 12 }} >
          <Controller
            name="dateM"
            control={control}
            render={({ field }) => (
              <TextField {...field} label=" ضبط التاريخ مـ" sx={{
                '& .MuiInputLabel-root': {
                  color: '#006d4e', // تغيير لون التسمية (label)
                },
                color: '#000',
              }} placeholder="DD/MM/YYYY" fullWidth />
            )}
          />
        </Grid>
        <Grid size={{ md: 3, sm: 12, xs: 12 }} >
          <Typography variant="body1">المرحلة:</Typography>
          <FormControl component="fieldset">
            <Controller
              name="stage"
              control={control}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel value="primary" control={<Radio />} label="ابتدائي" />
                  <FormControlLabel value="intermediate" control={<Radio />} label="متوسط" />
                  <FormControlLabel value="secondary" control={<Radio />} label="ثانوي" />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>



        <Grid size={{ md: 2, sm: 4 }}>
          <Button className={buttonStyles} type="submit" fullWidth>حفظ</Button>
        </Grid>

        <Grid size={{ md: 2, sm: 4 }}>
          <Button className={buttonStyles} fullWidth>إلغاء</Button>
        </Grid>

        <Grid size={{ md: 2, sm: 4 }}>
          <Button className={buttonStyles} onClick={() => router.back()} fullWidth>عودة</Button>
        </Grid>

        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <Button className={buttonStyles2} type="submit" fullWidth>اضغط هنا لتحميل الجدول العام إكسل</Button>
        </Grid>

        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <Button className={buttonStyles2} fullWidth>اضغط هنا لتحميل بيانات المعلمين إكسل</Button>
        </Grid>

        <Grid size={{ md: 4, sm: 12, xs: 12 }}>
          <Button className={buttonStyles2} fullWidth>اضغط هنا لتحميل جدول الانتظار الرسمي إكسل</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormComponent;
