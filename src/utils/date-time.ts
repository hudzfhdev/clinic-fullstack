import dayjs from "#/libs/dayjs.ts";

/**
 * @param {string} time_server Expected time with `HH:mm:ss` format as input (server format)
 * @returns {string} expect this format `09:00 AM` (example) to be returned
 * */
export const toClientTimeFormat = (time_server: string) => {
  return dayjs(time_server, "HH:mm:ss").format("hh:mm A");
};

export const toReadableTimestamp = (
  created_or_updated_db_timestamp: string,
) => {
  return dayjs(created_or_updated_db_timestamp).format("DD/MM/YYYY, hh:mm A");
};
