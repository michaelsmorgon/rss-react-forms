import * as yup from 'yup';

const uppercaseFirst = /^[A-Z]/;
const pwdNum = /[0-9]/;
const pwdUpper = /[A-Z]/;
const pwdLower = /[a-z]/;
const pwdSpecial = /[^A-Za-z0-9]/;

export const baseSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .matches(uppercaseFirst, 'First letter must be uppercase'),
  age: yup
    .number()
    .required('Age is required')
    .integer('Age must be an integer')
    .min(0, 'Age must be a positive number')
    .typeError('Age must be a number'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .test('has-number', 'Needs a number', (v) => !!v && pwdNum.test(v))
    .test(
      'has-upper',
      'Needs an uppercase letter',
      (v) => !!v && pwdUpper.test(v)
    )
    .test(
      'has-lower',
      'Needs a lowercase letter',
      (v) => !!v && pwdLower.test(v)
    )
    .test(
      'has-special',
      'Needs a special character',
      (v) => !!v && pwdSpecial.test(v)
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Select gender')
    .required('Gender is required'),
  acceptedTC: yup
    .boolean()
    .required('The terms and conditions must be accepted.')
    .oneOf([true], 'You must accept Terms & Conditions'),
  country: yup.string().required('Country is required'),
  imageFile: yup
    .mixed<File>()
    .required('File is required')
    .test('file-type', 'Only PNG/JPEG allowed', (file) =>
      file ? ['image/png', 'image/jpeg'].includes(file.type) : false
    )
    .test('file-size', 'Max file size is 2MB', (file) =>
      file ? file.size <= 2 * 1024 * 1024 : false
    ),
});
export type BaseSchema = yup.InferType<typeof baseSchema>;
