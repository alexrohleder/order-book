export class SocketChannelError extends Error {
  type: "error";
}

export class SocketClosedByServer extends SocketChannelError {
  message: "Socket closed by the server";
}

export class SocketUnexpectedResponseError extends SocketChannelError {
  message: "Socket responded in an unexpected way";
}

export function reportError(error: Error) {
  if (process.env.NODE_ENV === "production") {
    // todo: do something cool like calling Sentry
  }

  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }
}
