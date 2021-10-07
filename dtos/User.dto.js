const yup = require('yup');

const createUser = yup.object({
    body: yup.object({
        name: yup.string().required('Name is required'),
        lastName: yup.string().required('Last Name is required'),
        email: yup.string().email().required('Email is not correct'),
        phone: yup.string().min(10).max(10).required('Phone format is not correct'),
        organization: yup.string().required('Organization is required'),
        password: yup.string().min(8).max(20).required('Password is not secure')
    }),
});

const updateUser = yup.object({
    body: yup.object({
        name: yup.string(),
        lastName: yup.string(),
        email: yup.string().email(),
        phone: yup.string().min(10).max(10),
        organization: yup.string(),
        password: yup.string().min(8).max(20)
    })
});


module.exports = {
    createUser,
    updateUser
}