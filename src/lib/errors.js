// Turns an ApiError into one readable line for a message.
export function errorText(error) {
  const details = typeof error.details === "string" ? ` ${error.details}` : "";
  return `${error.message}${details}`;
}
