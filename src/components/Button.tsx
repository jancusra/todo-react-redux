import { Icon } from "../Icons"

export type ButtonProps = {
    readonly type: "submit" | "reset" | "button" | undefined,
    readonly innerText?: string,
    readonly className?: string,
    readonly iconName?: string,
    readonly onClick?: () => void,
    readonly onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void
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