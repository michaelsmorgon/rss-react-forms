import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { baseSchema } from '../../validation/schema';
import { fileToBase64 } from '../../utils/fileToBase64';
import { addUser } from '../../store/userSlice';
import type { Gender } from '../../utils/types';
import styles from '../Form.module.css';
import { PasswordStrength } from '../../components/password/PasswordStrength';
import Countries from '../../components/countries/Countries';

type HookFormProps = {
  onSuccess: () => void;
};

export const UncontrolledForm = ({ onSuccess }: HookFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pwd, setPwd] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) {
      throw new Error('Form ref is not assigned');
    }
    const fd = new FormData(formRef.current);

    const imageFile = (fd.get('imageFile') as File) || undefined;
    const acceptedTC = fd.get('acceptedTC') === 'on';
    const raw = {
      name: String(fd.get('name') || ''),
      age: Number(fd.get('age') || ''),
      email: String(fd.get('email') || ''),
      password: String(fd.get('password') || ''),
      confirmPassword: String(fd.get('confirmPassword') || ''),
      gender: String(fd.get('gender') || ''),
      acceptedTC,
      country: String(fd.get('country') || ''),
      imageFile: imageFile && imageFile.size ? imageFile : undefined,
    };

    try {
      await baseSchema.validate(raw, { abortEarly: false });
      let imageBase64: string | undefined;
      if (raw.imageFile) imageBase64 = await fileToBase64(raw.imageFile);
      dispatch(
        addUser({
          name: raw.name,
          age: raw.age,
          email: raw.email,
          password: raw.password,
          gender: raw.gender as Gender,
          acceptedTC: raw.acceptedTC,
          country: raw.country,
          imageBase64: imageBase64 as string,
        })
      );
      setErrors({});
      onSuccess();
    } catch (error: unknown) {
      const es: Record<string, string> = {};
      if (error instanceof Error) {
        es.form = 'Validation error';
      } else {
        es.form = `Unknown error: ${error}`;
      }
      setErrors(es);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <div className={styles.formField}>
          <label htmlFor="u-name">Name</label>
          <input id="u-name" name="name" type="text" />
          <div className={styles.fieldError} aria-live="polite">
            {errors.name || '\u00A0'}
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="u-age">Age</label>
          <input
            id="u-age"
            name="age"
            type="number"
            min={0}
            inputMode="numeric"
          />
          <div className={styles.fieldError} aria-live="polite">
            {errors.age || '\u00A0'}
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="u-email">Email</label>
          <input id="u-email" name="email" type="email" />
          <div className={styles.fieldError} aria-live="polite">
            {errors.email || '\u00A0'}
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="u-password">Password</label>
          <input
            id="u-password"
            name="password"
            type="password"
            onChange={(e) => setPwd(e.target.value)}
          />
          <PasswordStrength value={pwd} />
          <div className={styles.fieldError} aria-live="polite">
            {errors.password || '\u00A0'}
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="u-confirm">Confirm password</label>
          <input id="u-confirm" name="confirmPassword" type="password" />
          <div className={styles.fieldError} aria-live="polite">
            {errors.confirmPassword || '\u00A0'}
          </div>
        </div>

        <fieldset className={styles.formField}>
          <legend>Gender</legend>
          <div className={styles.radioRow}>
            <label>
              <input type="radio" name="gender" value="male" /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" /> Female
            </label>
            <label>
              <input type="radio" name="gender" value="other" /> Other
            </label>
          </div>
          <div className={styles.fieldError} aria-live="polite">
            {errors.gender || '\u00A0'}
          </div>
        </fieldset>

        <Countries
          id="u-country"
          label="Country"
          name="country"
          error={errors.country}
        />

        <div className={styles.formField}>
          <label htmlFor="u-image">Picture (PNG/JPEG, ≤2MB)</label>
          <input
            id="u-image"
            name="imageFile"
            type="file"
            accept="image/png,image/jpeg"
          />
          <div className={styles.fieldError} aria-live="polite">
            {errors.imageFile || '\u00A0'}
          </div>
        </div>

        <div className={styles.formField}>
          <label>
            <input type="checkbox" name="acceptedTC" />I accept Terms &
            Conditions
          </label>
          <div className={styles.fieldError} aria-live="polite">
            {errors.acceptedTC || '\u00A0'}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit">Submit</button>
      </div>

      <div className={styles.fieldError} aria-live="polite">
        {errors.form || '\u00A0'}
      </div>
    </form>
  );
};
