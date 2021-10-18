import { object, string, date } from 'yup';

export const createCourse = object({
  body: object({
    name: string().required('Name is required'),
    description: string().required('Description is required'),
    startDate: date().required('Date required'),
    endDate: date().required('Date required'),
    endIncriptionDate: date().required('Date required'),
    price: string().required('Price required'),
  }),
});

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
