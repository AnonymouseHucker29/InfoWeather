export function timezoneHandler(offsetMinutes) {
  const timezones = moment.tz.names();
  return timezones.filter(
    (zoneName) => moment.tz(zoneName).utcOffset() === offsetMinutes
  );
}
