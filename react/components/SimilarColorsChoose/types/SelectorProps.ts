export interface SelectorProps {
    title: string | undefined,
    link: string | undefined,
    imageUrl: string | undefined,
    color: string | undefined,
    highlight: boolean,
    setHighlight: (highlight: boolean) => void,
    primary?: boolean,
    ballSize?: string
}
