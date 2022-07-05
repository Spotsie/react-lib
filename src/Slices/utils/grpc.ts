import { grpc } from '@improbable-eng/grpc-web';
import { ProtobufMessage } from '@improbable-eng/grpc-web/dist/typings/message';
import { UnaryMethodDefinition } from '@improbable-eng/grpc-web/dist/typings/service';

if (!('process' in window)) {
  // @ts-ignore
  window.process = {};
}
const DEFAULT_API_URL = 'https://staging.spotsie.cloud';
const API_URL = process
  ? process.env.REACT_APP_SPOTSIE_CLOUD_URL ?? DEFAULT_API_URL
  : DEFAULT_API_URL;

type UnaryMethodResponseType<TMethod> = TMethod extends UnaryMethodDefinition<
  any,
  infer TResponse
>
  ? TResponse
  : never;

export function grpcUnaryRequest<
  TRequest extends ProtobufMessage,
  TResponse extends ProtobufMessage,
  TMethod extends UnaryMethodDefinition<TRequest, TResponse>
>(
  methodDescriptor: TMethod,
  request: ProtobufMessage
): Promise<UnaryMethodResponseType<TMethod>> {
  return new Promise((resolve, reject) => {
    grpc.unary(methodDescriptor, {
      request,
      host: API_URL,
      onEnd: (response) => {
        if (response.status !== grpc.Code.OK) {
          return reject(response.statusMessage);
        }

        return resolve(response.message as UnaryMethodResponseType<TMethod>);
      },
    });
  });
}
