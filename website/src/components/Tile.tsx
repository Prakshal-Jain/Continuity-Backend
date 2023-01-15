export type Props = {
    title: JSX.Element[] | String,
    description?: JSX.Element[] | String,
    image: String | null,
}

export default function ({ title, description, image }: Props) {
    return (
        <div>
            {title}
        </div>
    )
}