"use server"
import { cookies } from "next/headers";

export async function getUserData() {
    const cookieStore = cookies();
    const userDataCookie = cookieStore.get('userData');
    
    // console.error("iiiiiiiiiiiii-----",userDataCookie)
    if (userDataCookie) {
      try {
        const userData = JSON.parse(userDataCookie.value);
        // console.log(userData)
        return userData;
      } catch (error) {
        console.error('Error parsing user data cookie:', error);
      }
    }
    return null;
  }
  