import axios from "axios";

export const sendFileToWhatsApp = async (blob: Blob, phoneNumber: string) => {
  const formData = new FormData();
  formData.append("file", blob, "report.xlsx");

  const BOTSTAR_API_KEY = "4e15b8aa45c93ed97ee715eb192c9af7"; // استبدلها بمفتاح الـ API الخاص بـ BotStar
  const YOUR_BOTSTAR_BOT_ID = "s87e8f030-b36a-11ef-bb3d-936099d5df80"; // استبدلها بـ Bot ID الخاص بـ BotStar

  // Convert Blob to Base64 to send it in the request
  const base64File = await blobToBase64(blob);

  try {
    const response = await axios.post(
      `https://api.botstar.com/v1.0/messages`, // تحقق من الـ endpoint هنا
      {
        botId: YOUR_BOTSTAR_BOT_ID,
        recipient: {
          type: "whatsapp",
          phone: phoneNumber, // رقم المرسل إليه (تأكد من أنه يحتوي على رمز البلد)
        },
        message: {
          type: "text",
          text: "تقرير أداء المعلمين مرفق كملف Excel.",
        },
        media: {
          type: "file",
          file: base64File,
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // نوع الملف (Excel)
          filename: "report.xlsx",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${BOTSTAR_API_KEY}`,
          "Content-Type": "application/json", // تأكد من أن الـ content type صحيح
        },
      }
    );

    console.log("تم الإرسال بنجاح:", response.data);
  } catch (error: any) {
    console.error("فشل الإرسال:", error.response?.data || error.message);
  }
};

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(reader.result?.toString().split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
