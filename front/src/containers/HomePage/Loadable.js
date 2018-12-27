import dynamic from 'next/dynamic'
import LoadingIndicator from 'components/LoadingIndicator'

export default dynamic({
  loader: () => import('./index'),
  loading: LoadingIndicator,
  ssr: false,
})
