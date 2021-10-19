import {
  object, string, date, array, number,
} from 'yup';
import { parse, isDate } from 'date-fns';

export const parseDateString = (value: string, originalValue: string) => {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, 'yyyy-MM-dd', new Date());
  return parsedDate;
};

export const createCourse = object({
  body: object({
    name: string().required('Name is required'),
    description: string().required('Description is required'),
    startDate: date().transform(parseDateString).required('Date required'),
    endDate: date().transform(parseDateString).required('Date required'),
    endInscriptionDate: date().transform(parseDateString).required('Date required'),
    themes: array().of(string()).required('Themes are required'),
    price: number().required('Price required'),
  }),
});

export const updateCourse = object({
  body: object({
    name: string(),
    description: string(),
    startDate: date().transform(parseDateString),
    endDate: date().transform(parseDateString),
    endInscriptionDate: date().transform(parseDateString),
    themes: array().of(string()),
    price: number(),
  }),
});
