import { iButtonProps } from "@/interfaces";

const Button = ({text, variant, className, onClick} : iButtonProps) => {
    return (
        <button className={[variant, className].join(' ')} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;