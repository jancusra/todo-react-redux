import { Icon } from "../Icons"

export type ButtonProps = {
    type: "submit" | "reset" | "button" | undefined,
    innerText?: string,
    className?: string,
    iconName?: string,
    onClick?: () => void
}

const Button = (props: ButtonProps) => {
    return (
        <button
            type={props.type}
            className={props.className}
            onClick={props.onClick}>
            {props.iconName &&
                <Icon name={props.iconName}/>
            }
            {props.innerText &&
                <>{props.innerText}</>
            }
        </button>
    )
}

export default Button