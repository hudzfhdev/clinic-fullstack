import * as clinicRoutes from "./clinics.router";
import * as specialtiesRoutes from "./specialties.router";
import * as practitionerRoutes from "./practitioners.router";
import * as patientRoutes from "./patients.router";

export default {
  ...clinicRoutes,
  ...specialtiesRoutes,
  ...practitionerRoutes,
  ...patientRoutes,
};
