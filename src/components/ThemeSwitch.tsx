import { useEffect, useState } from 'react'
import { Icon } from "../Icons"

export type ThemeSwitchProps = {
    readonly darkAsDefault?: boolean
}

/**
 * light/dark theme switching component
 */
const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
    darkAsDefault
}) => {
    const [lightTheme, setLightTheme] = useState<boolean>(!darkAsDefault)

    // keep the document's `dark` class in sync with the current theme state
    useEffect(() => {
        document.documentElement.classList.toggle('dark', !lightTheme)
    }, [lightTheme])

    function switchTheme() {
        setLightTheme((prev) => !prev)
    }

    return (
        <button id="theme-toggle"
            aria-label={lightTheme ? "Switch to dark theme" : "Switch to light theme"}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            onClick={switchTheme}>
            <Icon name={lightTheme ? "theme-dark" : "theme-light"} />
        </button>
    )
}

export default ThemeSwitch