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
}

export interface iServiceCardProps{
    title: string,
    description?: string,
    variant: ModerationType,
}