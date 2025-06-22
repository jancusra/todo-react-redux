
export type TextBoxProps = {
    name: string,
    className?: string,
    placeholder?: string,
    required?: boolean
}

const TextBox = (props: TextBoxProps) => {
    return (
        <input
            type="text"
            name={props.name}
            className={props.className}
            placeholder={props.placeholder}
            required={props.required} />
    )
}

export default TextBox