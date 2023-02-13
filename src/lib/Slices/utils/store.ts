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
  Middleware,
  Reducer,
  StoreEnhancer,
  ConfigureStoreOptions,
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
} from "@reduxjs/toolkit";
import { ThunkMiddlewareFor } from "@reduxjs/toolkit/dist/getDefaultMiddleware";
import { DeploymentService } from "@spotsie/proto/deployment/v1/service_connectweb";
import { LocationService } from "@spotsie/proto/location/v1/service_connectweb";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { zoneReducer, locationReducer, LocationState, ZoneState } from "../..";

export type ReactLibConstants = {
  namespaceId: number;
  organizationId: number;
  spotsieCloudUrl: string;
  spotsieJwt: string;
};

export type ExtraThunkArgs = {
  LocationClient: PromiseClient<typeof LocationService>;
  DeploymentClient: PromiseClient<typeof DeploymentService>;
} & ReactLibConstants;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type ThunkAppDispatch = ThunkDispatch<RootState, ExtraThunkArgs, Action>;
export const useAppDispatch = () => useDispatch<ThunkAppDispatch>();

const reactLibReducers = {
  location: locationReducer,
  zone: zoneReducer,
};

export const getStore = <
  S = any,
  A extends Action = AnyAction,
  M extends ReadonlyArray<Middleware<{}, S>> = [ThunkMiddlewareFor<S>],
  E extends ReadonlyArray<StoreEnhancer> = [StoreEnhancer]
>(
  reducers: ReducersMapObject<S, A>,
  constants: ReactLibConstants,
  storeArgs: Omit<
    ConfigureStoreOptions<S, A, M, E>,
    "reducer" | "middleware"
  > & {
    defaultMiddleware?: {
      thunk?: { extraArgument: any };
      immutableCheck?: ImmutableStateInvariantMiddlewareOptions;
      serializableCheck?: SerializableStateInvariantMiddlewareOptions;
    };
    extraMiddleware?: M;
  } = {}
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

  const allReducers = {
    ...reactLibReducers,
    ...reducers,
  };

  const combinedReducer = combineReducers(allReducers) as unknown as Reducer<
    S & { location: LocationState; zone: ZoneState },
    AnyAction
  >;

  const rootReducer = (state: any, action: AnyAction) =>
    combinedReducer(state, action);

  const store = configureStore({
    reducer: rootReducer,
    devTools: storeArgs.devTools ?? true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            ...constants,
            LocationClient,
            DeploymentClient,
            ...storeArgs.defaultMiddleware?.thunk?.extraArgument,
          },
        },
        serializableCheck:
          storeArgs.defaultMiddleware?.serializableCheck ?? false,
        immutableCheck: storeArgs.defaultMiddleware?.immutableCheck ?? true,
      }).concat(...(storeArgs.extraMiddleware ?? [])),
  });

  return store;
};

export type RootState = ReturnType<ReturnType<typeof getStore>["getState"]>;

export type ThunkAPI = {
  rejectValue: string;
  extra: ExtraThunkArgs;
  state: RootState;
};
