import dayjs from 'dayjs';

export const getFormatDate = (date, format) => dayjs(date).format(format);

