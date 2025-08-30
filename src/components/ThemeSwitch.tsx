import { useEffect, useState } from 'react'
import { Icon } from "../Icons"

export type ThemeSwitchProps = {
    darkAsDefault?: boolean
}

/**
 * light/dark theme switching component
 */
const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
    darkAsDefault
}) => {
    const [lightTheme, setLightTheme] = useState<boolean>(true)

    useEffect(() => {
        if (darkAsDefault) {
            document.documentElement.classList.toggle('dark')
            setLightTheme(false)
        }
    }, [])

    function switchTheme() {
        document.documentElement.classList.toggle('dark')
        setLightTheme(!lightTheme)
    }

    return (
        <button id="theme-toggle" className="p-2 rounded-full bg-gray-200 dark:bg-gray-700" onClick={switchTheme}>
            <Icon name={lightTheme ? "theme-dark" : "theme-light"} />
        </button>
    )
}

export default ThemeSwitch