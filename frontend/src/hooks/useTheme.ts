import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { RootState } from '../store';
import { setTheme as setThemeAction } from '../store/slices/themeSlice';

type ThemeMode = 'light' | 'dark';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state: RootState) => state.theme.mode);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    dispatch(setThemeAction(newTheme));
  }, [dispatch, theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    localStorage.setItem('theme', newTheme);
    dispatch(setThemeAction(newTheme));
  }, [dispatch]);

  return {
    theme,
    toggleTheme,
    setTheme,
  };
}; 