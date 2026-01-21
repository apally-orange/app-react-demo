import './global.css'

type ErrorCardProps = {
	message?: string
}

export function ErrorCard({ message }: ErrorCardProps) {
	return (
		<div className='error-card'>
			<span className='error-card__icon'>⛔</span>
			<div className='error-card__content'>
				<div className='error-card__title'>Erreur</div>
				<p className='error-card__message'>
					{message ?? 'Error on loading data'}
				</p>
			</div>
		</div>
	)
}
