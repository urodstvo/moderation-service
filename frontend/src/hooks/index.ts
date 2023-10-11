import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'
import { ChangeEvent, ChangeEventHandler, useEffect,  useState } from 'react'
import { iTextInputProps } from '@/interfaces'


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

export const useTextInputProps = (props : Omit<iTextInputProps, "onChange" | "value">) : iTextInputProps => {
  const {placeholder, disabled, className, isHidden} = props
  const [value, setValue] = useState<string>('');
  const handleChange : ChangeEventHandler = (e: ChangeEvent) => setValue((e.target as HTMLInputElement).value);

  const inputProps : iTextInputProps =  {
    className: className || '',
    value: value,
    placeholder: placeholder || '',
    onChange: handleChange,
    disabled: disabled || false,
    isHidden: isHidden || false
  }

  return inputProps
}

export const usePageTitle = (title: string) => {useEffect(() => {document.title = title}, [])}
