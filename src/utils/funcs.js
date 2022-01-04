import moment from 'moment';

export const formatDateTime = dateTime => {
  const today = moment();
  const momentDateTime = moment(dateTime);

  if (today.diff(momentDateTime, 's') < 60) return `${today.diff(momentDateTime, 's')}s`;

  if (today.diff(momentDateTime, 'm') < 60) return `${today.diff(momentDateTime, 'm')}m`;

  if (today.diff(momentDateTime, 'h') < 24) return `${today.diff(momentDateTime, 'h')}h`;

  if (today.diff(momentDateTime, 'd') < 7) return `${today.diff(momentDateTime, 'd')}d`;

  if (today.diff(momentDateTime, 'w') < 4) return `${today.diff(momentDateTime, 'w')}w`;

  if (today.diff(momentDateTime, 'y') < 1) return `${momentDateTime.format('MMM d')}`;

  return `${momentDateTime.format('MMM YYYY')}`;
};