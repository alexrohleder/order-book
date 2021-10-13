export class SocketChannelError extends Error {
  type: "error";
}

export class SocketClosedByServer extends SocketChannelError {
  message: "Socket closed by the server";
}
