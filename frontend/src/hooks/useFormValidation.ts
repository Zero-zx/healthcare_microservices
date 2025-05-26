import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ValidationSchemas {
  login: typeof loginSchema;
  register: typeof registerSchema;
  appointment: typeof appointmentSchema;
  doctor: typeof doctorSchema;
  patient: typeof patientSchema;
  labResult: typeof labResultSchema;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['patient', 'doctor'], 'Invalid role')
    .required('Role is required'),
});

const appointmentSchema = Yup.object().shape({
  doctorId: Yup.string()
    .required('Doctor is required'),
  date: Yup.date()
    .min(new Date(), 'Date cannot be in the past')
    .required('Date is required'),
  time: Yup.string()
    .required('Time is required'),
});

const doctorSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  specialization: Yup.string()
    .required('Specialization is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s-]+$/, 'Invalid phone number')
    .required('Phone number is required'),
  address: Yup.string()
    .required('Address is required'),
});

const patientSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s-]+$/, 'Invalid phone number')
    .required('Phone number is required'),
  address: Yup.string()
    .required('Address is required'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .required('Gender is required'),
});

const labResultSchema = Yup.object().shape({
  patientId: Yup.string()
    .required('Patient is required'),
  testName: Yup.string()
    .required('Test name is required'),
  testDate: Yup.date()
    .required('Test date is required'),
  result: Yup.string()
    .required('Result is required'),
  notes: Yup.string(),
});

export const useFormValidation = <T extends keyof ValidationSchemas>(
  formType: T,
  initialValues: any,
  onSubmit: (values: any) => void,
) => {
  const schemas: ValidationSchemas = {
    login: loginSchema,
    register: registerSchema,
    appointment: appointmentSchema,
    doctor: doctorSchema,
    patient: patientSchema,
    labResult: labResultSchema,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schemas[formType],
    onSubmit,
  });

  return formik;
}; 