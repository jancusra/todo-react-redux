
export type TextBoxProps = {
    name: string,
    className?: string,
    placeholder?: string,
    required?: boolean
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