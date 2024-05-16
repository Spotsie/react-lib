import { DeploymentState } from "../Deployment/deploymentSlice";
import { LocationState } from "../Location/locationSlice";
import { ZoneState } from "../Zone/zoneSlice";

interface RootState {
  location: LocationState;
  zone: ZoneState;
  deployment: DeploymentState;
}

export default RootState;
