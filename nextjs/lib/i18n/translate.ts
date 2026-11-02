export type Messages = Record<string, string>;
export type Translator = (
  text: string,
  values?: Record<string, string | number>,
) => string;

export function createTranslator(messages: Messages = {}): Translator {
  return (text, values) => {
    const value = messages[text];
    // Inline copy can surround links, emphasis or code. Keep its source spacing.
    const translated =
      value === undefined
        ? text
        : `${text.match(/^\s+/)?.[0] ?? ""}${value.trim()}${text.match(/\s+$/)?.[0] ?? ""}`;
    return values
      ? translated.replace(/\{(\w+)\}/g, (match, key: string) =>
          String(values[key] ?? match),
        )
      : translated;
  };
}
