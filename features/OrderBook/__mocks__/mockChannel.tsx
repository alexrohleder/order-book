import { buffers, eventChannel } from "@redux-saga/core";

function mockChannel(initialMessages: any[] = []): any {
  return eventChannel((emit) => {
    initialMessages.forEach(emit);

    return () => undefined;
  }, buffers.expanding());
}

export default mockChannel;
