import * as clinicRoutes from "./clinics.router";
import * as specialtiesRoutes from "./specialties.router";

export default {
  ...clinicRoutes,
  ...specialtiesRoutes,
};
