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
}

export interface iServiceCardProps{
    title: string,
    description?: string,
    variant: ModerationType,
}

export interface iPricingCardProps{
    name: string, 
    price: string, 
    offers: string[],
    terms: string[] 
}