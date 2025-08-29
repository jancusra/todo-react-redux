import { useState } from 'react'

export type SelectItem = {
    value: string,
    text: string
}

export type SelectBoxProps = {
    items: SelectItem[],
    onChange?: (value: string) => void
}

/**
 * responsive selection component (Tabs on desktop & DropDown on mobile devices)
 */
const SelectBox = (props: SelectBoxProps) => {
    const [selectedValue, setSelectedValue] = useState<string | null>(props.items.length > 0 ? props.items[0].value : null)

    const onChange = (value: string) => {
        setSelectedValue(value)

        if (props.onChange) {
            props.onChange(value)
        }
    }

    return (
        <>
            <div className="sm:hidden pb-4">
                <label htmlFor="tabs" className="sr-only">Select option</label>
                <select id="tabs" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => { onChange(e.target.value) }}>
                    {props.items.map(item => {
                        return <option key={item.value} value={item.value}>{item.text}</option>
                    })}
                </select>
            </div>
            <ul className="hidden pb-4 text-sm font-medium text-center text-gray-500 rounded-lg shadow-sm sm:flex dark:divide-gray-700 dark:text-gray-400">
                {props.items.map(item => {
                    return <li key={item.value} className="w-full focus-within:z-10">
                        <a href={void (0)} className={`inline-block w-full p-2 border-gray-200 dark:border-gray-700 focus:outline-none dark:bg-gray-800 ${selectedValue === item.value ? 'bg-primary-light text-white dark:bg-primary-dark text-gray-900 dark:bg-gray-700 dark:text-white active' : ''} ${item.value === props.items[0].value ? 'rounded-s-lg' : ''} ${item.value === props.items[props.items.length - 1].value ? 'border-s-0 rounded-e-lg' : 'border-r'}`} onClick={() => { onChange(item.value) }}>{item.text}</a>
                    </li>
                })}
            </ul>
        </>
    )
}

export default SelectBox