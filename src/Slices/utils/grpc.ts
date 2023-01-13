//@ts-nocheck
import {
  createConnectTransport,
  createPromiseClient,
} from '@bufbuild/connect-web';
import { LocationService } from 'proto/location/v1/service_connectweb';
import { DeploymentService } from 'proto/deployment/v1/service_connectweb';

const DEFAULT_API_URL = 'https://api.spotsie.dev';
export let API_URL = DEFAULT_API_URL;

try {
  API_URL = process.env.SPOTSIE_CLOUD_URL ?? DEFAULT_API_URL;
} catch (error) {
  // if the process is not defined, check for webpack's DefinePlugin variable
  try {
    API_URL = import.meta.SPOTSIE_CLOUD_URL ?? DEFAULT_API_URL;
  } catch (error) {
    try {
      API_URL = SPOTSIE_CLOUD_URL ?? DEFAULT_API_URL;
    } catch (err) {
      API_URL = DEFAULT_API_URL;
    }
  }
}

const DEFAULT_ORGANIZATION_ID = 1;
export let API_ORGANIZATION_ID = DEFAULT_ORGANIZATION_ID;

try {
  API_ORGANIZATION_ID = !isNaN(Number(process.env.ORGANIZATION_ID))
    ? Number(process.env.ORGANIZATION_ID)
    : DEFAULT_ORGANIZATION_ID;
} catch (error) {
  try {
    API_ORGANIZATION_ID = !isNaN(Number(import.meta.ORGANIZATION_ID))
      ? Number(import.meta.ORGANIZATION_ID)
      : DEFAULT_ORGANIZATION_ID;
  } catch (error) {
    // if the process is not defined, check for webpack's DefinePlugin variable
    try {
      API_ORGANIZATION_ID = !isNaN(Number(ORGANIZATION_ID))
        ? Number(ORGANIZATION_ID)
        : DEFAULT_ORGANIZATION_ID;
    } catch (err) {
      API_ORGANIZATION_ID = DEFAULT_ORGANIZATION_ID;
    }
  }
}

const DEFAULT_NAMESPACE_ID = 1;
export let API_NAMESPACE_ID = DEFAULT_NAMESPACE_ID;

try {
  API_NAMESPACE_ID = !isNaN(Number(process.env.NAMESPACE_ID))
    ? Number(process.env.NAMESPACE_ID)
    : DEFAULT_NAMESPACE_ID;
} catch (error) {
  try {
    API_NAMESPACE_ID = !isNaN(Number(import.meta.NAMESPACE_ID))
      ? Number(import.meta.NAMESPACE_ID)
      : DEFAULT_NAMESPACE_ID;
  } catch (error) {
    // if the process is not defined, check for webpack's DefinePlugin variable
    try {
      API_NAMESPACE_ID = !isNaN(Number(NAMESPACE_ID))
        ? Number(NAMESPACE_ID)
        : !isNaN(Number(NAMESPACE_ID))
        ? Number(NAMESPACE_ID)
        : DEFAULT_NAMESPACE_ID;
    } catch (err) {
      API_NAMESPACE_ID = DEFAULT_NAMESPACE_ID;
    }
  }
}

const DEFAULT_SPOTSIE_JWT = '';
export let API_SPOTSIE_JWT = DEFAULT_SPOTSIE_JWT;

try {
  API_SPOTSIE_JWT = process.env.SPOTSIE_JWT ?? DEFAULT_SPOTSIE_JWT;
} catch (error) {
  try {
    API_SPOTSIE_JWT = import.meta.SPOTSIE_JWT ?? DEFAULT_SPOTSIE_JWT;
  } catch (error) {
    // if the process is not defined, check for webpack's DefinePlugin variable
    try {
      API_SPOTSIE_JWT = SPOTSIE_JWT ?? DEFAULT_SPOTSIE_JWT;
    } catch (err) {
      API_SPOTSIE_JWT = DEFAULT_SPOTSIE_JWT;
    }
  }
}

export const headers = new Headers();
headers.set('Authorization', `Bearer ${API_SPOTSIE_JWT}`);

export const LocationClient = createPromiseClient(
  LocationService,
  createConnectTransport({
    baseUrl: API_URL,
  })
);

export const DeploymentClient = createPromiseClient(
  DeploymentService,
  createConnectTransport({
    baseUrl: API_URL,
  })
);
