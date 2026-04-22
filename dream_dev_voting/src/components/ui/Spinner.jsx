export default function Spinner({ large = false }) {
  return <div className={`spinner${large ? ' spinner-lg' : ''}`} />;
}
