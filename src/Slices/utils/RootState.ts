import { State as LocationState } from '../Location/locationSlice';
import { State as ZoneState } from '../Zone/zoneSlice';

interface RootState {
  location: LocationState;
  zone: ZoneState;
}

export default RootState;
