import { Icon } from "../Icons"

export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
    readonly innerText?: string,
    readonly iconName?: string
}

/**
 * general button component; forwards all native button attributes
 * (disabled, aria-label, title, ...) and renders an optional icon + label
 */
const Button: React.FC<ButtonProps> = ({
    innerText,
    iconName,
    children,
    ...rest
}) => {
    return (
        <button {...rest}>
            {iconName &&
                <Icon name={iconName} />
            }
            {innerText}
            {children}
        </button>
    )
}

export default Button
