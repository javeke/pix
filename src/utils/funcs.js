import moment from 'moment';

export const formatDateTime = dateTime => {
  const today = moment();
  const today2 = moment();
  const momentDateTime = moment(dateTime);

  if (today2.diff(momentDateTime, 's') < 60) return `${today2.diff(momentDateTime, 's')}s`;

  if (today2.diff(momentDateTime, 'm') < 60) return `${today2.diff(momentDateTime, 'm')}m`;

  if (today2.diff(momentDateTime, 'h') < 24) return `${today2.diff(momentDateTime, 'h')}h`;

  if (today2.diff(momentDateTime, 'd') < 7) return `${today2.diff(momentDateTime, 'd')}d`;

  if (today2.diff(momentDateTime, 'w') < 4) return `${today2.diff(momentDateTime, 'w')}w`;

  if (today2.diff(momentDateTime, 'y') < 1) return `${momentDateTime.format('MMM d')}`;

  return `${momentDateTime.format('MMM YYYY')}`;
};