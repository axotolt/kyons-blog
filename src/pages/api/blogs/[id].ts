import type { APIRoute } from "astro";
import { app } from "@lib/firebase/server";
import { getFirestore} from "firebase-admin/firestore";

const db = getFirestore(app);
const blogsRef = db.collection("blogs");

export const POST: APIRoute = async ({ params, redirect, request }) => {
  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const labels = formData.get("labels")?.toString();
  const author = formData.get("author")?.toString();
  const authorid = formData.get("authorid")?.toString();
  const content = formData.get("content")?.toString();
  const changeHistory = {
    changer: author,
    changerid: authorid,
    updatedat: new Date().toISOString(),
  };
  
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
    const currentBlog = await blogsRef.doc(params.id).get();
    const currentData = currentBlog.data();
    await blogsRef.doc(params.id).update({
      title,
      labels,
      // author,
      // authorid,
      content,
      changeHistory: [...(currentData?.changeHistory || []), changeHistory],
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