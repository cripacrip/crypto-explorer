import { getCurrencies } from '@/api/currencies';
import { useQuery } from '@tanstack/react-query'

// const queryClient = new QueryClient()

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => getCurrencies(),
  })
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Home Page</h1>
      <p>Welcome to the Crypto Explorer!</p>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading currencies: {error.message}</p>}
      {data && (
        <ul>
          {data.data.map((currency: any) => (
            <li key={currency.id}>
              {currency.name} ({currency.symbol}): ${currency.quote.USD.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      <p>Check the console for sidebar state.</p>
      <p>Use the sidebar to navigate through the app.</p>
      <p>Make sure to have the API key set in your environment variables.</p>
      <p>Enjoy exploring cryptocurrencies!</p>
    </div>
  );
}