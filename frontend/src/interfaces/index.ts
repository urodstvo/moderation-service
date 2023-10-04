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
    onClick?: MouseEventHandler
}

export interface iServiceCardProps{
    title: string,
    description?: string,
    path: string,
    variant: ModerationType,
    disabled?: boolean
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

export enum RoleEnum{
    User = "user",
    Student = "student",
    Company = "company",
    Admin = "admin"
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
        is_verified: boolean,
        // role: RoleEnum
    }
}

export interface iTextInputProps{
    className?: string,
    value: string,
    placeholder?: string, 
    onChange: ChangeEventHandler<HTMLInputElement> | undefined,
    disabled? : boolean,
    isHidden? : boolean
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