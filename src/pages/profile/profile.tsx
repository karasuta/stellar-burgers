import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { TRegisterData } from '@api';
import {
  selectUser,
  useSelector,
  useDispatch,
  selectProfileUpdateError
} from '../../services/store';
import { updateProfile } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const profileUpdateError = useSelector(selectProfileUpdateError);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const updates: Partial<TRegisterData> = {};
    if (formValue.name !== (user?.name ?? '')) {
      updates.name = formValue.name;
    }
    if (formValue.email !== (user?.email ?? '')) {
      updates.email = formValue.email;
    }
    if (formValue.password) updates.password = formValue.password;
    if (!Object.keys(updates).length) return;
    dispatch(updateProfile(updates));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={profileUpdateError ?? ''}
    />
  );
};
