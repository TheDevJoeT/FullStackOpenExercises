import { useSelector } from 'react-redux'
import { Alert, Container } from 'react-bootstrap'

const Notification = () => {
  const message = useSelector((state) => state.notification)

  if (!message) return null

  return (
    <Container className="mt-3">
      <Alert variant="info">
        {message}
      </Alert>
    </Container>
  )
}

export default Notification