import type { APIRoute } from "astro";
import { app } from "../../../lib/firebase/server";
import { getFirestore } from "firebase-admin/firestore";

export const POST: APIRoute = async ({ params, redirect, request }) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const labels = formData.getAll("labels");
  // const labels = localStorage.getItem("localSelectedOptions");
  const author = formData.get("author")?.toString();
  const authorid = formData.get("authorid")?.toString(); 
  const content = formData.get("content")?.toString();
  const createdAt = new Date().toISOString();

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
      labels: Array.from(labels),
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