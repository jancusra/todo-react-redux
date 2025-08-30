import { Icon } from "../Icons"

export type ButtonProps = {
    type: "submit" | "reset" | "button" | undefined,
    innerText?: string,
    className?: string,
    iconName?: string,
    onClick?: () => void,
    onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * general button component
 */
const Button: React.FC<ButtonProps> = ({
    type,
    innerText,
    className,
    iconName,
    onClick,
    onMouseDown
}) => {
    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            onMouseDown={onMouseDown}>
            {iconName &&
                <Icon name={iconName} />
            }
            {innerText}
        </button>
    )
}

export default Button