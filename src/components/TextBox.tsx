export type TextBoxProps = React.ComponentPropsWithoutRef<'input'>

/**
 * component for input text; forwards all native input attributes
 * (name, placeholder, required, maxLength, aria-*, ...) and defaults to type="text"
 */
const TextBox: React.FC<TextBoxProps> = ({ type = "text", ...rest }) => {
    return (
        <input type={type} {...rest} />
    )
}

export default TextBox
