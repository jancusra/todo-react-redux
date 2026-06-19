import { cj } from '../helpers'

export type SelectItem = {
    readonly value: string,
    readonly text: string
}

export type SelectBoxProps = {
    readonly items: readonly SelectItem[],
    readonly value: string,
    readonly onChange?: (value: string) => void
}

/**
 * responsive, controlled selection component
 * (Tabs on desktop & DropDown on mobile devices)
 */
const SelectBox: React.FC<SelectBoxProps> = ({
    items,
    value,
    onChange
}) => {
    const onSelectChange = (newValue: string) => {
        if (onChange) {
            onChange(newValue)
        }
    }

    return (
        <>
            <div className="sm:hidden pb-4">
                <label htmlFor="tabs" className="sr-only">Select option</label>
                <select id="tabs"
                    value={value}
                    className={cj("bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg",
                        "focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
                        "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500")}
                    onChange={(e) => { onSelectChange(e.target.value) }}>
                    {items.map(item =>
                        <option key={item.value} value={item.value}>{item.text}</option>
                    )}
                </select>
            </div>
            <ul className="hidden pb-4 text-sm font-medium text-center text-gray-500 rounded-lg shadow-sm sm:flex dark:divide-gray-700 dark:text-gray-400">
                {items.map((item, index) =>
                    <li key={item.value} className="w-full focus-within:z-10">
                        <button type="button"
                            aria-pressed={value === item.value}
                            className={cj("inline-block w-full p-2 border-gray-200 dark:border-gray-700 focus:outline-none dark:bg-gray-800",
                                value === item.value && "bg-primary-light text-white dark:bg-primary-dark dark:text-white active",
                                index === 0 && "rounded-s-lg",
                                index === items.length - 1 ? "border-s-0 rounded-e-lg" : "border-r"
                            )}
                            onClick={() => { onSelectChange(item.value) }}>
                            {item.text}
                        </button>
                    </li>
                )}
            </ul>
        </>
    )
}

export default SelectBox
