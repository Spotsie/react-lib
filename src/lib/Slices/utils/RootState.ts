import { LocationState } from "../Location/locationSlice";
import { ZoneState } from "../Zone/zoneSlice";

interface RootState {
  location: LocationState;
  zone: ZoneState;
}

export default RootState;
