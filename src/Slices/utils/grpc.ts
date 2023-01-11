import { grpc } from '@improbable-eng/grpc-web';
import { ProtobufMessage } from '@improbable-eng/grpc-web/dist/typings/message';
import { UnaryMethodDefinition } from '@improbable-eng/grpc-web/dist/typings/service';

const DEFAULT_API_URL = 'https://api.spotsie.dev';
export let API_URL = DEFAULT_API_URL;

try {
  API_URL =
    process.env.REACT_APP_SPOTSIE_CLOUD_URL ??
    process.env.SPOTSIE_CLOUD_URL ??
    DEFAULT_API_URL;
} catch (error) {
  // if the process is not defined, check for webpack's DefinePlugin variable
  try {
    // @ts-ignore
    API_URL = SPOTSIE_CLOUD_URL ?? DEFAULT_API_URL;
  } catch (err) {
    API_URL = DEFAULT_API_URL;
  }
}

const DEFAULT_ORGANIZATION_ID = 1;
export let API_ORGANIZATION_ID = DEFAULT_ORGANIZATION_ID;

try {
  API_ORGANIZATION_ID = !isNaN(Number(process.env.REACT_APP_ORGANIZATION_ID))
    ? Number(process.env.REACT_APP_ORGANIZATION_ID)
    : !isNaN(Number(process.env.ORGANIZATION_ID))
    ? Number(process.env.ORGANIZATION_ID)
    : DEFAULT_ORGANIZATION_ID;
} catch (error) {
  // if the process is not defined, check for webpack's DefinePlugin variable
  try {
    // @ts-ignore
    API_ORGANIZATION_ID =
      // @ts-ignore
      !isNaN(Number(ORGANIZATION_ID))
        ? // @ts-ignore
          Number(ORGANIZATION_ID)
        : DEFAULT_ORGANIZATION_ID;
  } catch (err) {
    API_ORGANIZATION_ID = DEFAULT_ORGANIZATION_ID;
  }
}

const DEFAULT_NAMESPACE_ID = 1;
export let API_NAMESPACE_ID = DEFAULT_NAMESPACE_ID;

try {
  API_NAMESPACE_ID = !isNaN(Number(process.env.REACT_APP_NAMESPACE_ID))
    ? Number(process.env.REACT_APP_NAMESPACE_ID)
    : !isNaN(Number(process.env.NAMESPACE_ID))
    ? Number(process.env.NAMESPACE_ID)
    : DEFAULT_NAMESPACE_ID;
} catch (error) {
  // if the process is not defined, check for webpack's DefinePlugin variable
  try {
    // @ts-ignore
    API_NAMESPACE_ID = !isNaN(Number(REACT_APP_NAMESPACE_ID))
      ? // @ts-ignore
        Number(REACT_APP_NAMESPACE_ID)
      : // @ts-ignore
      !isNaN(Number(NAMESPACE_ID))
      ? // @ts-ignore
        Number(NAMESPACE_ID)
      : DEFAULT_NAMESPACE_ID;
  } catch (err) {
    API_NAMESPACE_ID = DEFAULT_NAMESPACE_ID;
  }
}

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
