
export type TextBoxProps = {
    readonly name: string,
    readonly className?: string,
    readonly placeholder?: string,
    readonly required?: boolean
}

/**
 * component for input text
 */
const TextBox: React.FC<TextBoxProps> = ({
    name,
    className,
    placeholder,
    required
}) => {
    return (
        <input
            type="text"
            name={name}
            className={className}
            placeholder={placeholder}
            required={required} />
    )
}

export default TextBox