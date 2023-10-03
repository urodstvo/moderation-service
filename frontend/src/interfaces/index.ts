import { ChangeEventHandler, MouseEventHandler } from "react"

export enum ColorVariant{
    black='black',
    white='white'
}

export enum ModerationType{
    text='text',
    image='image',
    audio='audio',
    video='video'
}

export interface iButtonProps{
    text: string,
    variant?: ColorVariant,
    className?: string,
    disabled?: boolean,
    onClick: MouseEventHandler
}

export interface iServiceCardProps{
    title: string,
    description?: string,
    path: string,
    variant: ModerationType,
}

export interface iPricingCardProps{
    name: string, 
    price: string, 
    offers: string[],
    terms: string[] 
}

export interface iServicePageHeaderProps{
    title: string,
    description: string,
    tab: "INFO" | "PLAYGROUND" | "INTEGRATION",
    variant: ModerationType,

}

export enum AuthStatus{
    None="None",
    Loading="Loading",
    Error="Error",
    Success="Success",
    
}

export interface iAuthState {
    status: AuthStatus,
    isAuth: boolean,
    token?: string,
    user?:{
        id: string,
        username: string,
        email: string,
        registered_at: Date,
        is_verified: boolean
    }
}

export interface iTextInputProps{
    className?: string,
    value?: string,
    placeholder?: string, 
    onChange?: ChangeEventHandler<HTMLInputElement>,
    disabled? : boolean
}

export interface iPasswordInputProps extends iTextInputProps{
    isShown?: boolean
}

export interface iCheckBoxProps{
    checked?: boolean,
    disabled?: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement>
}

export interface iTimerProps{
    seconds: number, 
    className?: string,
    callback?: () => void
}