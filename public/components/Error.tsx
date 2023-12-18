/* This is a reusable error component */
export function Error({ message }: { message?: string[] | string }) {
  return <p className="text-red-500 text-sm -mt-1">{message}</p>;
}
