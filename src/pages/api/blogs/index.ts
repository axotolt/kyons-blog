import type { APIRoute } from "astro";
import { app } from "@lib/firebase/server";
import { getFirestore } from "firebase-admin/firestore";

// const db = getFirestore(app);
// const blogsRef = db.collection("blogs");
// const getAllTitles = async () => {
//   const querySnapshot = await blogsRef.get();
//   const titles = [];
//   querySnapshot.forEach((doc) => {
//     titles.push(doc.data().title);
//   });
//   return titles;
// };
// const allTitles = await getAllTitles();

export const POST: APIRoute = async ({ params, redirect, request }) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const labels = formData.get("labels")?.toString();
  const author = formData.get("author")?.toString();
  const authorid = formData.get("authorid")?.toString(); 
  const content = formData.get("content")?.toString();
  const createdAt = new Date().toISOString();

  // if (allTitles.includes(title)) {
    
  // }
  if (!title || !author) {
    return new Response("Missing required fields", {
      status: 400,
    });
  }
  try {
    const db = getFirestore(app);
    const blogsRef = db.collection("blogs");
    await blogsRef.add({
      title,
      labels,
      author,
      authorid,
      content,
      createdAt
    });
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
  return redirect("/dashboard");
};