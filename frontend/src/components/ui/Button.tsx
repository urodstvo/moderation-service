import { iButtonProps } from "@/interfaces";

const Button = ({text, variant, className} : iButtonProps) => {
    return (
        <button className={[variant, className].join(' ')}>
            {text}
        </button>
    );
};

export default Button;