import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Loading } from './Loading.tsx'

type User = {
    id: string
    firstName: string
    lastName: string
}

const userQueryOptions =  (userId: number) =>
	 queryOptions({
		queryFn: () =>
			fetch(`https://dummyjson.com/users/${userId}`).then((res) => res.json()),
		queryKey: ['user', userId],
	})

export function UserCard( { userId }: { userId: number } ) {
	const { data, isLoading } = useSuspenseQuery(userQueryOptions(userId))
	if (isLoading) {
		return <Loading />
	}

    const { firstName, lastName } = data as User
    return (
        <div className="userCard">
         Author: {firstName} {lastName}
        </div>
    )
}
