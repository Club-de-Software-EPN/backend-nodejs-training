import { object, string } from 'yup';

export const createUser = object({
  body: object({
    name: string().required('Name is required'),
    lastName: string().required('Last Name is required'),
    email: string().email().required('Email is not correct'),
    phone: string().min(10).max(10).required('Phone format is not correct'),
    organization: string().required('Organization is required'),
    password: string().min(8).max(20).required('Password is not secure'),
  }),
});

export const updateUser = object({
  body: object({
    name: string(),
    lastName: string(),
    email: string().email(),
    phone: string().min(10).max(10),
    organization: string(),
    password: string().min(8).max(20),
  }),
});
