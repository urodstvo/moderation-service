import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { useEffect, useState } from 'react'


export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useCountDown = (seconds : number) => {
    const [countDown, setCountDown] = useState(seconds);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCountDown(prev => prev - 1);
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    return countDown;
}

