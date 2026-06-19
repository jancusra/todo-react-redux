import { useEffect, useState } from 'react'
import { Icon } from "../Icons"

// the initial theme is decided in index.html (localStorage, default dark) and
// reflected on <html>; read it back here so there is a single source of truth
function getInitialDark() {
    return document.documentElement.classList.contains('dark')
}

/**
 * light/dark theme switching component; persists the choice to localStorage so
 * it survives a reload, in sync with the pre-paint script in index.html
 */
const ThemeSwitch: React.FC = () => {
    const [dark, setDark] = useState<boolean>(getInitialDark)

    // keep the document's `dark` class and the persisted choice in sync
    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark)
        try {
            localStorage.setItem('theme', dark ? 'dark' : 'light')
        } catch {
            // ignore storage failures (e.g. private mode); theme still applies
        }
    }, [dark])

    function switchTheme() {
        setDark((prev) => !prev)
    }

    return (
        <button id="theme-toggle"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            onClick={switchTheme}>
            <Icon name={dark ? "theme-light" : "theme-dark"} />
        </button>
    )
}

export default ThemeSwitch
