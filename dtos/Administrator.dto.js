const yup = require('yup');

const createAdministrator = yup.object({
    body: yup.object({
        name: yup.string().required('Name is required'),
        lastName: yup.string().required('Last Name is required'),
        email: yup.string().email().required('Email is not correct'),
        password: yup.string().min(8).max(20).required('Password is not secure')
    }),
});

const updateAdministrator = yup.object({
    body: yup.object({
        name: yup.string(),
        lastName: yup.string(),
        email: yup.string().email(),
        password: yup.string().min(8).max(20).required('Password is not secure')
    })
});


module.exports = {
    createAdministrator,
    updateAdministrator
}