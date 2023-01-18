import {
  createGrpcWebTransport,
  createPromiseClient,
} from "@bufbuild/connect-web";
import { LocationService } from "proto/location/v1/service_connectweb";
import { DeploymentService } from "proto/deployment/v1/service_connectweb";
import { API_SPOTSIE_JWT, API_URL } from "../../utils/constants";

export const headers = new Headers();
headers.set("Authorization", `Bearer ${API_SPOTSIE_JWT}`);

export const LocationClient = createPromiseClient(
  LocationService,
  createGrpcWebTransport({
    baseUrl: API_URL,
  })
);

export const DeploymentClient = createPromiseClient(
  DeploymentService,
  createGrpcWebTransport({
    baseUrl: API_URL,
  })
);
