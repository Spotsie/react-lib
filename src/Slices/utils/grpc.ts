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
  API_URL =
    process.env.REACT_APP_SPOTSIE_CLOUD_URL ??
    process.env.SPOTSIE_CLOUD_URL ??
    DEFAULT_API_URL;
} catch (error) {
  // if the process is not defined, check for webpack's DefinePlugin variable
  try {
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
    API_ORGANIZATION_ID = !isNaN(Number(ORGANIZATION_ID))
      ? Number(ORGANIZATION_ID)
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
    API_NAMESPACE_ID = !isNaN(Number(REACT_APP_NAMESPACE_ID))
      ? Number(REACT_APP_NAMESPACE_ID)
      : !isNaN(Number(NAMESPACE_ID))
      ? Number(NAMESPACE_ID)
      : DEFAULT_NAMESPACE_ID;
  } catch (err) {
    API_NAMESPACE_ID = DEFAULT_NAMESPACE_ID;
  }
}

export const headers = new Headers();
headers.set(
  'Authorization',
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Nwb3RzaWUuaW8iLCJ1cG4iOiJhZG1pbkBsb2NhbGhvc3QiLCJzdWIiOiJhZG1pbiIsImdyb3VwcyI6WyJST0xFX1VTRVIiLCJST0xFX0FETUlOIl0sImlhdCI6MTY3MzYwMTIyMSwiZXhwIjoxNjczNjg3NjIxLCJhdXRoIjoiUk9MRV9VU0VSLCBST0xFX0FETUlOIiwianRpIjoiYTY4ODFmN2YtOTMzZS00ZjFkLWE5ZjYtNjcyODQxM2ZjOGY0In0.REsEo3nSL893D6_9ydXtQ-KEZZR9nUMtgCpg9ABiK8pVOgPTVuVmCYUxGPHpSHYEt3Vg-u6ovEsO6O97j-oZrtBvnVKilH50CbO5W6y5U3B0Ivpa8JQWOCtebwrrsVjrh0D_G2Qt7NslZv6d8kJpRneofUu43FLgG--W8zpVqWNOaVPmPoQPnFIriA0lLe_2FQGUvZrn8PLkO7_ErXoPoI_LUO3peak7TlJ7g8HTzC6dsk1rnQxsulU_4lckJs0_TOLfzGU1dLbuW6tfELgFjFbgkGe44WhkRqryKgbA294ByBkz5boTx3xo_7iVfidTAt_0ezPa41qdXN-7BFzGrg'
);

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
