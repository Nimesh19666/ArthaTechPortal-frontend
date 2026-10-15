// Turns an ApiError into one readable line for a message.
export function errorText(error) {
  const { details } = error;

  if (typeof details === "string") return `${error.message} ${details}`;

  if (details && typeof details === "object") {
    const lines = Object.entries(details).map(
      ([field, problems]) => `${field}: ${[].concat(problems).join(" ")}`,
    );
    return `${error.message} ${lines.join(" · ")}`;
  }

  return error.message;
}
