import { iButtonProps } from "@/interfaces";

const Button = ({text, variant} : iButtonProps) => {
    return (
        <button className={variant}>
            {text}
        </button>
    );
};

export default Button;