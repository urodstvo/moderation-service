import { ChangeEventHandler, MouseEventHandler } from "react";

export enum ColorVariant {
  black = "black",
  white = "white",
}

export enum ModerationType {
  text = "text",
  image = "image",
  audio = "audio",
  video = "video",
}

export interface iButtonProps {
  text: string;
  variant?: ColorVariant;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler;
}

export interface iServiceCardProps {
  title: string;
  description?: string;
  path: string;
  variant: ModerationType;
  disabled?: boolean;
}

export interface iPricingCardProps {
  name: string;
  price: string;
  offers: string[];
  terms: string[];
  disabled?: boolean;
  onChoose?: MouseEventHandler;
}

export enum ModPageTab {
  info = "INFO",
  playground = "PLAYGROUND",
  integration = "INTEGRATION",
}

export interface iServicePageHeaderProps {
  title: string;
  description?: string;
  tab: ModPageTab;
  variant: ModerationType;
}

export enum StateStatus {
  None = "None",
  Loading = "Loading",
  Error = "Error",
  Success = "Success",
  Verified = "Verified",
}

export enum RoleEnum {
  User = "user",
  Student = "student",
  Company = "company",
  Admin = "admin",
}

export interface iAuthState {
  isAuth: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    registered_at: Date;
    is_verified: boolean;
    role: RoleEnum;
    api_token: string;
  };
}

export interface iTextInputProps {
  name?: string;
  className?: string;
  value: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
  disabled?: boolean;
  isHidden?: boolean;
  validation?: {
    rule: RegExp;
    error: string;
  };
}

export interface iCheckBoxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export interface iTimerProps {
  seconds: number;
  className?: string;
  callback?: () => void;
}

export interface iModState {
  status: StateStatus;
  text: string;
  response: {
    toxic: string;
    severe_toxic: string;
    insult: string;
    obscene: string;
    identity_hate: string;
    threat: string;
  };
}
