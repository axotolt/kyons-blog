import { Error } from "../components/Error";
import { ErrorPlaceholder } from "../components/ErrorPlaceholder";
import { app } from "../../src/lib/firebase/client";
import { loginSchema } from "../../src/lib/schemas";
import {
  GoogleAuthProvider,
  getAuth,
  inMemoryPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  Match,
  Show,
  Suspense,
  Switch,
  createResource,
  createSignal,
} from "solid-js";
import type { z } from "zod";

type Errors = z.typeToFlattenedError<z.inferFormattedError<typeof loginSchema>>;
type SucessForm = z.infer<typeof loginSchema>;
const auth = getAuth(app);

/* This will set the persistence to session */
auth.setPersistence(inMemoryPersistence);

async function postFormData(formData: SucessForm) {
  const { email, password } = formData;
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const idToken = await userCredential.user.getIdToken();
  const res = await fetch("/api/auth/signin", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    return data;
  }

  if (res.redirected) {
    window.location.assign(res.url);
  }
}

async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const idToken = await userCredential.user.getIdToken();
  const res = await fetch("/api/auth/signin", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    return data;
  }

  if (res.redirected) {
    window.location.assign(res.url);
  }
}

export default function LoginForm() {
  const [formData, setFormData] = createSignal<SucessForm>();
  const [response] = createResource(formData, postFormData);
  const [clientErrors, setClientErrors] = createSignal<Errors>();

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setClientErrors();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const errors = result.error.flatten() as Errors;
      setClientErrors(errors);
      return;
    }
    setFormData(result.data);
  }

  return (
    <form class="grid grid-cols-1 gap-3 w-full" onsubmit={submit}>
      <div class="grid grid-cols-1 gap-2">
        <label
          for="email"
          class="font-medium white:text-zinc-300 text-zinc-900 text-sm"
        >
          Email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          class="rounded-md py-1 px-3 white:bg-zinc-800 white:text-zinc-300 border bg-zinc-50 border-zinc-300 white:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 white:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
        />
        <Show
          when={clientErrors()?.fieldErrors.email}
          fallback={<ErrorPlaceholder />}
        >
          <Error message={clientErrors()?.fieldErrors.email} />
        </Show>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <label
          for="password"
          class="font-medium white:text-zinc-300 text-zinc-900 text-sm"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          class="rounded-md py-1 px-3 white:bg-zinc-800 white:text-zinc-300 border bg-zinc-50 border-zinc-300 white:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 white:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
        />
        <Show
          when={clientErrors()?.fieldErrors.password}
          fallback={<ErrorPlaceholder />}
        >
          <Error message={clientErrors()?.fieldErrors.password} />
        </Show>
      </div>
      <button
        class="white:bg-zinc-100 bg-zinc-900 border-zinc-900 py-1.5 border white:border-zinc-100 rounded-md mt-2 white:text-zinc-900 text-zinc-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 white:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={response.loading}
      >
        <Show fallback="Sign in" when={response.loading}>
          Signing in...
        </Show>
      </button>
      <div>
        <hr class="h-0 border-t mt-4 white:border-zinc-600 border-zinc-300"></hr>
        <p class="-mt-2.5 text-xs text-center white:text-zinc-400 text-zinc-500">
          <span class="white:bg-zinc-900 bg-zinc-100 px-4">Or with</span>
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <button
          onclick={googleSignIn}
          class="white:bg-zinc-100 p-1.5 border border-zinc-300 white:border-zinc-100 flex justify-center items-center gap-2 rounded-md mt-2 white:text-zinc-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 white:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-auto"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285F4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            />
            <path
              fill="#34A853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            />
            <path
              fill="#FBBC05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
            />
            <path
              fill="#EB4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </form>
  );
}
