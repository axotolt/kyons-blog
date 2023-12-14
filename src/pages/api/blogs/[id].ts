import type { APIRoute } from "astro";
import { app } from "@lib/firebase/server";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore(app);
const blogsRef = db.collection("blogs");

export const POST: APIRoute = async ({ params, redirect, request }) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const tags = formData.get("tags")?.toString();
  const author = formData.get("author")?.toString();
  const authorid = formData.get("authorid")?.toString();
  const content = formData.get("content")?.toString();
  

  if (!title || !author) {
    return new Response("Missing required fields", {
      status: 400,
    });
  }

  if (!params.id) {
    return new Response("Cannot find blog", {
      status: 404,
    });
  }

  try {
    await blogsRef.doc(params.id).update({
      title,
      tags,
      author,
      authorid,
      content,
    });
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
  return redirect("/dashboard");
};

export const DELETE: APIRoute = async ({params, redirect }) => {
  if (!params.id) {
    return new Response("Cannot find blog", {
      status: 404,
    });
  }

  try {
    await blogsRef.doc(params.id).delete();
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
  return redirect("/dashboard");
};