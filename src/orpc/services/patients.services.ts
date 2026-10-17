import { customAlphabet } from "nanoid";

class PatientServices {
  static genPatientNo() {
    const genNanoID = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ")();
    const patient_no = `PMC-${genNanoID}`;
    return patient_no;
  }
}

export default PatientServices;
