import ExcelJS from "exceljs";
import { uploadeTeachersEx } from "@/lib/actions/user.action";
interface TeacherData {
  name: string;
  schoolId: string;
  civilRecord?: string;
  phoneNumber?: string;
}

export const addTeachersExcel = async (file: File, schoolId: string) => {
  try {
    // Initialize ExcelJS Workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());

    // Select the first worksheet
    const worksheet = workbook.worksheets[0];

    // Extract rows from the worksheet (skip first two rows as header)
    const teachers: TeacherData[] = worksheet
      .getSheetValues()
      .slice(2) // Skip header rows (adjust depending on your sheet)
      .reduce((acc: TeacherData[], row: any) => {
        // Check if the row is valid and contains the expected columns
        if (row && row[1] && row[2] && row[3]) {
          acc.push({
            name: row[1],
            civilRecord: row[2],
            phoneNumber: row[3],
            schoolId,
          });
        }
        return acc;
      }, []);

    // Connect to MongoDB and insert teachers
    console.log(teachers);
    uploadeTeachersEx(teachers);

    console.log("Teachers uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
