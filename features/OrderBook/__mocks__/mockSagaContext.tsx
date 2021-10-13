import { SagaContext } from "../types";
import mockChannel from "./mockChannel";

function mockSagaContext(partial: Partial<SagaContext> = {}) {
  return {
    socketChannel: mockChannel(),
    ...partial,
  };
}

export default mockSagaContext;
