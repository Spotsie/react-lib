import {
  createPromiseClient,
  createGrpcWebTransport,
  PromiseClient,
} from "@bufbuild/connect-web";
import {
  configureStore,
  Action,
  combineReducers,
  ThunkDispatch,
  AnyAction,
  ReducersMapObject,
} from "@reduxjs/toolkit";
import { DeploymentService } from "@spotsie/proto/deployment/v1/service_connectweb";
import { LocationService } from "@spotsie/proto/location/v1/service_connectweb";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { zoneReducer, locationReducer } from "../..";

export type ReactLibConstants = {
  namespaceId: number;
  organizationId: number;
  spotsieCloudUrl: string;
  spotsieJwt: string;
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
export const useAppDispatch = () => useDispatch<ThunkAppDispatch>();

const reactLibReducers = {
  location: locationReducer,
  zone: zoneReducer,
};

export const getStore = <S, A extends AnyAction>(
  reducers: ReducersMapObject<S, A>,
  constants: ReactLibConstants
) => {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${constants.spotsieJwt}`);

  const LocationClient = createPromiseClient(
    LocationService,
    createGrpcWebTransport({
      baseUrl: constants.spotsieCloudUrl,
    })
  );

  const DeploymentClient = createPromiseClient(
    DeploymentService,
    createGrpcWebTransport({
      baseUrl: constants.spotsieCloudUrl,
      interceptors: [
        (next) => async (req) => {
          {
            req.header.set("Authorization", constants.spotsieJwt);
            const res = await next(req);
            return res;
          }
        },
      ],
    })
  );

  const combinedReducer = combineReducers({
    ...reducers,
    ...reactLibReducers,
  });

  const rootReducer = (state: any, action: AnyAction) =>
    combinedReducer(state, action);

  const store = configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: constants, LocationClient, DeploymentClient },
        serializableCheck: false,
      }),
  });

  return store;
};

export type RootState = ReturnType<ReturnType<typeof getStore>["getState"]>;

export type ThunkAPI = {
  rejectValue: string;
  extra: {
    constants: ReactLibConstants;
    LocationClient: PromiseClient<typeof LocationService>;
    DeploymentClient: PromiseClient<typeof DeploymentService>;
  };
  state: RootState;
};
