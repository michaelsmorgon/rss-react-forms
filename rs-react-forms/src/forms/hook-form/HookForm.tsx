import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { baseSchema, type BaseSchema } from '../../validation/schema';
import { fileToBase64 } from '../../utils/fileToBase64';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addUser } from '../../store/userSlice';
import styles from '../Form.module.css';
import { PasswordStrength } from '../../components/password/PasswordStrength';
import Countries from '../../components/countries/Countries';

type HookFormProps = {
  onSuccess: () => void;
};

export const HookForm = ({ onSuccess }: HookFormProps) => {
  const dispatch = useDispatch();
  const [pwd, setPwd] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = useForm<BaseSchema>({
    resolver: yupResolver(baseSchema),
    mode: 'all',
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      age: undefined as unknown as number,
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'other',
      acceptedTC: false,
      country: '',
      imageFile: undefined as unknown as File,
    },
    shouldFocusError: true,
  });
  const onSubmit = async (data: BaseSchema) => {
    const imageBase64 = await fileToBase64(data.imageFile);
    dispatch(
      addUser({
        name: data.name,
        age: Number(data.age),
        email: data.email,
        password: data.password,
        gender: data.gender,
        acceptedTC: !!data.acceptedTC,
        country: data.country,
        imageBase64,
      })
    );
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.grid}>
        <div className={styles.formField}>
          <label htmlFor="r-name">Name</label>
          <input id="r-name" {...register('name')} />
          <div className={styles.fieldError} aria-live="polite">
            {errors.name?.message || '\u00A0'}
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="r-age">Age</label>
          <input
            id="r-age"
            type="number"
            min={0}
            inputMode="numeric"
            {...register('age')}
          />
          <div className={styles.fieldError} aria-live="polite">
            {errors.age?.message || '\u00A0'}
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="r-email">Email</label>
          <input id="r-email" type="email" {...register('email')} />
          <div className={styles.fieldError} aria-live="polite">
            {errors.email?.message || '\u00A0'}
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="r-password">Password</label>
          <input
            id="r-password"
            type="password"
            {...register('password')}
            onChange={(e) => {
              setPwd(e.target.value);
              setValue('password', e.target.value, { shouldValidate: true });
            }}
          />
          <PasswordStrength value={pwd} />
          <div className={styles.fieldError} aria-live="polite">
            {errors.password?.message || '\u00A0'}
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="r-confirm">Confirm password</label>
          <input
            id="r-confirm"
            type="password"
            {...register('confirmPassword')}
          />
          <div className={styles.fieldError} aria-live="polite">
            {errors.confirmPassword?.message || '\u00A0'}
          </div>
        </div>

        <fieldset className={styles.formField}>
          <legend>Gender</legend>
          <div className={styles.radioRow}>
            <label>
              <input type="radio" value="male" {...register('gender')} /> Male
            </label>
            <label>
              <input type="radio" value="female" {...register('gender')} />
              Female
            </label>
            <label>
              <input type="radio" value="other" {...register('gender')} /> Other
            </label>
          </div>
          <div className={styles.fieldError} aria-live="polite">
            {errors.gender?.message || '\u00A0'}
          </div>
          <div className={styles.fieldError} aria-live="polite">
            {errors.gender?.message || '\u00A0'}
          </div>
        </fieldset>

        <Countries
          id="r-country"
          label="Country"
          name="country"
          error={errors.country?.message}
          value={getValues('country')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue('country', e.currentTarget.value, { shouldValidate: true })
          }
        />

        <div className={styles.formField}>
          <label htmlFor="r-image">Picture (PNG/JPEG, ≤2MB)</label>
          <input
            id="r-image"
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const f = e.currentTarget.files?.[0];
              if (!f) {
                return;
              }
              setValue('imageFile', f, { shouldValidate: true });
            }}
          />
          <div className={styles.fieldError} aria-live="polite">
            {errors.imageFile?.message || '\u00A0'}
          </div>
        </div>

        <div className="form-field checkbox">
          <label>
            <input type="checkbox" {...register('acceptedTC')} />
            <span> I accept Terms & Conditions</span>
          </label>
          <div className={styles.fieldError} aria-live="polite">
            {errors.acceptedTC?.message || '\u00A0'}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={!isValid} aria-disabled={!isValid}>
          Submit
        </button>
      </div>
    </form>
  );
};
