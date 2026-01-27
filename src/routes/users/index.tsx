/** biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: <explanation> */
/** biome-ignore-all lint/style/noNestedTernary: <explanation> */
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type Table,
    useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ErrorCard } from '../../core/components/ErrorCard.tsx'
import { Loading } from '../../core/components/Loading.tsx'

export const Route = createFileRoute('/users/')({
	component: RouteComponent,
	loader: ({ context: { queryClient } }) => {
		queryClient.fetchQuery(usersQueryOptions)
	},
})

type User = {
	id: number
	firstName: string
	lastName: string
	email: string
}

const usersQueryOptions = queryOptions({
	queryFn: () => {
		return fetch(
			// biome-ignore lint/security/noSecrets: no secret
			'https://dummyjson.com/users?select=firstName,lastName,email',
		)
			.then((res) => res.json())
			.then((data) => data.users)
	},
	queryKey: ['users'],
})

const columnHelper = createColumnHelper<User>()
const columns = [
	columnHelper.accessor('firstName', { header: () => 'Prénom' }),
	columnHelper.accessor('lastName', { header: () => 'Nom' }),
	columnHelper.accessor('email', { header: () => 'Email' }),
]

function RouteComponent() {
	const {
		data: users = [],
		isLoading,
		error,
	} = useSuspenseQuery(usersQueryOptions)

	const [sorting, setSorting] = useState([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

	const table = useReactTable({
		columns,
		data: users as User[],
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		state: { pagination, sorting },
	})

	if (isLoading) {
		return <Loading />
	}
	if (error) {
		return <ErrorCard />
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

			<FooterTable table={table} />
		</div>
	)
}

function FooterTable({ table }: { table: Table<User> }) {
	return(
            <div
				style={{
					alignItems: 'center',
					display: 'flex',
					gap: '0.5rem',
					marginTop: 12,
				}}>
				<button
					disabled={!table.getCanPreviousPage()}
					onClick={() => table.previousPage()}>
					Précédent
				</button>
				<span>
					Page {table.getState().pagination.pageIndex + 1} sur{' '}
					{table.getPageCount()}
				</span>
				<button
					disabled={!table.getCanNextPage()}
					onClick={() => table.nextPage()}>
					Suivant
				</button>
				<span style={{ marginLeft: 'auto' }}>Afficher</span>
				<select
					onChange={(e) => table.setPageSize(Number(e.target.value))}
					value={table.getState().pagination.pageSize}>
					{[5, 10, 20].map((size) => (
						<option key={size} value={size}>
							{size}
						</option>
					))}
				</select>
			</div>
    )
}
