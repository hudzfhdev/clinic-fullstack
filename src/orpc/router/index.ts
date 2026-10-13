import * as clinicRoutes from "./clinics.router";
import * as specialtiesRoutes from "./specialties.router";
import * as practitionerRoutes from "./practitioners.router";
import * as patientRoutes from "./patients.router";
import * as roomRoutes from "./rooms.router";
import * as serviceRoutes from "./services.router";
import * as appointmentRoutes from "./appointments.router";

export default {
  ...clinicRoutes,
  ...specialtiesRoutes,
  ...practitionerRoutes,
  ...patientRoutes,
  ...roomRoutes,
  ...serviceRoutes,
  ...appointmentRoutes,
};
