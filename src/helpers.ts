// Common helper methods

// method combines classes (some string of base classes and various conditions separated by commas)
export function cj(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}