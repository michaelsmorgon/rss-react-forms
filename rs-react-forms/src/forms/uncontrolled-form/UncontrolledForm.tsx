import { useEffect } from 'react';

type HookFormProps = {
  onSuccess: () => void;
};

export const UncontrolledForm = ({ onSuccess }: HookFormProps) => {
  useEffect(() => {
    setTimeout(() => {
      onSuccess();
    }, 3000);
  }, [onSuccess]);

  return <div>Uncontrolled Form</div>;
};
