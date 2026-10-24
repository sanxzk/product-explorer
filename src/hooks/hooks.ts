// Skip this file if you already have typed hooks.
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();