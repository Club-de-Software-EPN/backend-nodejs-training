import { object, string } from 'yup';

export const createAdministrator = object({
  body: object({
    name: string().required('Name is required'),
    lastName: string().required('Last Name is required'),
    email: string().email().required('Email is not correct'),
    password: string().min(8).max(20).required('Password is not secure'),
  }),
});

export const updateAdministrator = object({
  body: object({
    name: string(),
    lastName: string(),
    email: string().email(),
    password: string().min(8).max(20).required('Password is not secure'),
  }),
});
