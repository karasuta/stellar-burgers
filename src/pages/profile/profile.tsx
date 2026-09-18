import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { selectUser, useSelector, useDispatch } from '../../services/store';
import { updateUserApi } from '@api';
import { setUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const updates: Partial<{ name: string; email: string; password: string }> =
      {};
    if (formValue.name !== (user?.name ?? '')) {
      updates.name = formValue.name;
    }
    if (formValue.password) updates.password = formValue.password;
    if (!Object.keys(updates).length) return;
    try {
      const response = await updateUserApi(updates);
      dispatch(setUser(response.user));
      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
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
    />
  );
};
