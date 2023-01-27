import { Zone } from "@spotsie/proto/deployment/v1/organization_pb";
import { EntityMap, entityObjectToArray } from "../utils/arrObjConversion";
import RootState from "../utils/RootState";
import { PlainMessage } from "@bufbuild/protobuf";

export const selectAllZones = (
  state: RootState
): EntityMap<PlainMessage<Zone>> => state.zone.zones;
export const selectAllZonesArray = (state: RootState) =>
  entityObjectToArray(state.zone.zones);

export const selectZonesLoading = (state: RootState): boolean =>
  state.zone.loading;
export const selectZonesLoaded = (state: RootState): boolean =>
  state.zone.loaded;
