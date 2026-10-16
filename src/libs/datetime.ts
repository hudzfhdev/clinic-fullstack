import dayjs from "./dayjs";

/** @description for HEROUI datepicker localization */
export const LOCALE_DATEPICKER = "en-MY-u-ca-gregory";

export const toClientDateFormat = (server_date: string) => {
  return dayjs(server_date, "YYYY/MM/DD").format("DD/MM/YYYY");
};
