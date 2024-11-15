"use server";
import { cookies } from "next/headers";

export async function getSchoolData() {
  const cookieStore = cookies();
  const SchoolDataCookie = cookieStore.get("SchoolData");

  // console.error("iiiiiiiiiiiii-----",SchoolDataCookie)
  if (SchoolDataCookie) {
    try {
      const SchoolData = JSON.parse(SchoolDataCookie.value);
      // console.log(SchoolData)
      return SchoolData;
    } catch (error) {
      console.error("Error parsing School data cookie:", error);
    }
  }
  return null;
}
export async function setSchoolData() {
  const cookieStore = cookies();
  cookieStore.delete("SchoolData");
  cookieStore.delete("authTokenSchool");

  return null;
}
