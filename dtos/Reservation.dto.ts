/* eslint-disable import/prefer-default-export */
import {
  object, string, date,
} from 'yup';

export const updateCourse = object({
  body: object({
    name: string(),
    description: string(),
    startDate: date(),
    endDate: date(),
    endIncriptionDate: date(),
    price: string(),
  }),
});
