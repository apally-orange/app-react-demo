/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <explanation> */
/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <explanation> */
/** biome-ignore-all lint/style/noNestedTernary: <explanation> */
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { ErrorCard } from '../../core/components/ErrorCard.tsx'
import { Loading } from '../../core/components/Loading.tsx'

export const Route = createFileRoute('/users/')({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.fetchInfiniteQuery(usersQueryOptions(initialPagination))
	},
})

type User = {
	id: number
	firstName: string
	lastName: string
	email: string
}

const usersQueryOptions = (props: { pageIndex: number; pageSize: number }) => ({
	getNextPageParam: (_lastGroup, groups) => groups.length,
	initialPageParam: 0,
	placeholderData: keepPreviousData,
	queryFn: ({ pageParam = 0 }) => {
		const skip = pageParam * props.pageSize
		return fetch(
			// biome-ignore lint/security/noSecrets: no secret
			`https://dummyjson.com/users?limit=${props.pageSize}&skip=${skip}&select=firstName,lastName,email`,
		)
			.then((res) => res.json())
			.then((data) => ({
				total: data.total,
				users: data.users,
			}))
	},
	queryKey: ['users'],
	refetchOnWindowFocus: false,
})

const columnHelper = createColumnHelper<User>()
const columns = [
	columnHelper.accessor('firstName', { header: () => 'Prénom' }),
	columnHelper.accessor('lastName', { header: () => 'Nom' }),
	columnHelper.accessor('email', { header: () => 'Email' }),
]
const initialPagination = { pageIndex: 0, pageSize: 10 }

function RouteComponent() {
	const [sorting, setSorting] = useState([])
	const [pagination, setPagination] = useState(initialPagination)

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteQuery(usersQueryOptions(pagination))

	const users = useMemo<User[]>(
		() => data?.pages.flatMap((page) => page.users) || [],
		[data],
	)
	const totalDBRowCount = data?.pages?.[0]?.total ?? 0
	const totalFetched = users.length
	const totalPages = useMemo(
		() => Math.ceil(totalDBRowCount / pagination.pageSize),
		[totalDBRowCount, pagination.pageSize],
	)

	const table = useReactTable({
		columns,
		data: users,
		debugTable: true,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: { pagination, sorting },
	})

	if (isLoading) {
		return <Loading />
	}
	if (error) {
		return <ErrorCard />
	}

	const handleNext = async () => {
		const nextPageIndex = pagination.pageIndex + 1

		if (totalFetched < totalDBRowCount && hasNextPage && !isFetchingNextPage) {
			await fetchNextPage()
		}
		// Avance la page explicitement :
		setPagination((prev) => ({ ...prev, pageIndex: nextPageIndex }))
		table.nextPage()
	}

	return (
		<div>
			<h2>Utilisateurs</h2>
			<table
				aria-label='Utilisateurs'
				style={{ borderCollapse: 'collapse', width: '100%' }}>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									onClick={
										header.column.getCanSort()
											? header.column.getToggleSortingHandler()
											: undefined
									}
									style={{
										borderBottom: '1px solid #ddd',
										cursor: header.column.getCanSort() ? 'pointer' : 'default',
										padding: '8px',
										textAlign: 'left',
									}}>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
									{header.column.getCanSort()
										? header.column.getIsSorted()
											? header.column.getIsSorted() === 'asc'
												? ' 🔼'
												: ' 🔽'
											: ''
										: null}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			<div
				style={{
					alignItems: 'center',
					display: 'flex',
					gap: '0.5rem',
					marginTop: 12,
				}}>
				<button
					disabled={pagination.pageIndex === 0}
					onClick={() =>
						setPagination((prev) => ({
							...prev,
							pageIndex: prev.pageIndex - 1,
						}))
					}>
					Précédent
				</button>
				<span>
					Page {pagination.pageIndex + 1} sur {totalPages}
				</span>
				<button
					disabled={
						isFetchingNextPage || !hasNextPage || !table.getCanNextPage()
					}
					onClick={handleNext}>
					{isFetchingNextPage ? 'Chargement...' : 'Suivant'}
				</button>
				<span style={{ marginLeft: 'auto' }}>Afficher</span>
				<select
					onChange={(e) =>
						setPagination((prev) => ({
							...prev,
							pageIndex: 0,
							pageSize: Number(e.target.value),
						}))
					}
					value={pagination.pageSize}>
					{[5, 10, 20].map((size) => (
						<option key={size} value={size}>
							{size}
						</option>
					))}
				</select>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginTop: '1rem',
				}}>
				<Link to='/users/add'>
					<button>Ajouter un utilisateur</button>
				</Link>
			</div>
		</div>
	)
}
