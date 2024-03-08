import * as React from 'react';
import { Container, Box, Grid, Typography, TextField, InputLabel, Button, Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'

const SNACK_TIMEOUT = 3000,
    DAYS = Array.from({ length: 31 }, (_, i) => i + 1),
    MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 18 - i),
    DEFAULT_SNACK_STATE = { show: false, type: undefined, message: "" },
    DEFAULTFORM = {
        full_name: "",
        contact_number: "",
        day: DAYS[0],
        month: MONTHS[0],
        year: YEARS[0],
        email: "",
        password: "",
        confirm_password: ""
    },
    phoneRegEx = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    passRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/,
    SignupSchema = Yup.object().shape({
        full_name: Yup.string()
            .matches(/^([a-zA-Z ])+$/, 'Full Name is not valid')
            .required('Required'),
        contact_number: Yup.string()
            .matches(phoneRegEx, 'Contact Number is not valid')
            .required('Required'),
        email: Yup.string().email('Email is not valid')
            .required('Required'),
        password: Yup.string()
            .min(8, 'Password is too short')
            .matches(passRegEx, 'Password is not valid, Password should contain 1 lower case letter, 1 uppercase letter and 1 number')
            .required('Required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Confirm Passwords should match with Password')
            .required('Required')
    });

function SignUp() {
    const [loading, setLoading] = React.useState(false),
        [snack, setSnack] = React.useState({ ...DEFAULT_SNACK_STATE }),
        handleClose = _ => {
            setSnack({ ...DEFAULT_SNACK_STATE })
        },
        formik = useFormik({
            initialValues: { ...DEFAULTFORM },
            validationSchema: SignupSchema,
            onSubmit: async (values, { resetForm }) => {
                try {
                    setLoading(true)
                    const body = {
                        ...values,
                        date_of_birth: `${values.month} ${values.day}, ${values.year}`,
                        month: undefined,
                        day: undefined,
                        year: undefined,
                        confirm_password: undefined
                    },
                        response = await Axios.post(`https://fullstack-test-navy.vercel.app/api/users/create`, body)
                    console.log(response)
                    setSnack({ show: true, type: 'success', message: response.data.description })
                    resetForm()
                } catch (error) {
                    console.log(error)
                    setSnack({ show: true, type: 'error', message: error.response.data.description })
                } finally {
                    setLoading(false)
                }
            },
            enableReinitialize: true,
        })
    return (
        <Container maxWidth="lg" disableGutters>
            <Box sx={{ width: 1, maxWidth: '520px', margin: '20px auto 0' }}>
                <Box className='form-header-container'>
                    <Typography
                        variant='body1'
                        sx={{
                            fontWeight: '700',
                            fontSize: '20px',
                            marginBottom: '10px'
                        }}
                    >
                        Create User Account
                    </Typography>
                </Box>
                <hr id='separator' />
                <form onSubmit={formik.handleSubmit} onReset={formik.resetForm}>
                    <Box className="form-container">
                        <Grid container justifyContent="center" spacing={2} >
                            <Grid item xs={12}>
                                <InputLabel htmlFor="full_name" className="input-labels">Full Name</InputLabel>
                                <TextField
                                    required
                                    id="full_name"
                                    type='text'
                                    name="full_name"
                                    label="Full Name"
                                    variant="outlined"
                                    size="small"
                                    value={formik.values.full_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.full_name && Boolean(formik.errors.full_name)
                                    }
                                    helperText={formik.touched.full_name && formik.errors.full_name}
                                    disabled={loading}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="contact_number" className="input-labels">Contact Number</InputLabel>
                                <TextField
                                    required
                                    id="contact_number"
                                    type='text'
                                    name="contact_number"
                                    label="Contact Number"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formik.values.contact_number}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.contact_number && Boolean(formik.errors.contact_number)
                                    }
                                    helperText={formik.touched.contact_number && formik.errors.contact_number}
                                    disabled={loading}
                                />

                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="date_of_birth" className="input-labels">Birthdate</InputLabel>
                            </Grid>
                            <Grid item xs={4} pt={'0!important'}>
                                <TextField
                                    required
                                    id="day"
                                    name="day"
                                    label="Day"
                                    select
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    SelectProps={{ native: true }}
                                    value={formik.values.day}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={loading}
                                >
                                    {DAYS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4} pt={'0!important'}>
                                <TextField
                                    required
                                    id="month"
                                    name="month"
                                    label="Month"
                                    select
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    SelectProps={{ native: true }}
                                    value={formik.values.month}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={loading}
                                >
                                    {MONTHS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4} pt={'0!important'}>
                                <TextField
                                    required
                                    id="year"
                                    name="year"
                                    label="Year"
                                    select
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    SelectProps={{ native: true }}
                                    value={formik.values.year}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={loading}
                                >
                                    {YEARS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="email" className="input-labels">Email Address</InputLabel>
                                <TextField
                                    required
                                    id="email"
                                    type='email'
                                    name="email"
                                    label="Email Address"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.email && Boolean(formik.errors.email)
                                    }
                                    helperText={formik.touched.email && formik.errors.email}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="password" className="input-labels">Password</InputLabel>
                                <TextField
                                    required
                                    id="password"
                                    type='password'
                                    name="password"
                                    label="Create Password"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.password && Boolean(formik.errors.password)
                                    }
                                    helperText={formik.touched.password && formik.errors.password}
                                    disabled={loading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel htmlFor="confirm_password" className="input-labels">Confirm Password</InputLabel>
                                <TextField
                                    required
                                    id="confirm_password"
                                    type='password'
                                    name="confirm_password"
                                    label="Confirm Password"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.confirm_password && Boolean(formik.errors.confirm_password)
                                    }
                                    helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                                    disabled={loading}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className="button-container">
                        <Button variant="outlined" type='reset' disabled={loading}>Cancel</Button>
                        <Button variant="contained" className='contained-btn' type='submit' disabled={loading}>Submit</Button>
                    </Box>
                </form>
            </Box>
            <Snackbar
                open={snack.show}
                autoHideDuration={SNACK_TIMEOUT}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={_ => { setSnack({ ...DEFAULT_SNACK_STATE }) }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snack.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: 1000 }}
                open={loading}
            >
                <CircularProgress />
            </Backdrop>
        </Container >
    );
}

export default SignUp;
