
import { Deployment } from "@spotsie/proto/deployment/v1/organization_pb";
import { EntityMap, entityObjectToArray } from "../utils/arrObjConversion";
import RootState from "../utils/RootState";
import { PlainMessage } from "@bufbuild/protobuf";

export const selectAllDeployments = (
  state: RootState
): EntityMap<PlainMessage<Deployment>> => state.deployment.deployment;
export const selectAllDeploymentsArray = (state: RootState) =>
  entityObjectToArray(state.deployment.deployment);

export const selectDeploymentLoading = (state: RootState): boolean =>
  state.deployment.loading;
export const selectDeploymentLoaded = (state: RootState): boolean =>
  state.deployment.loaded;
