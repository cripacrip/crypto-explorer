import { api } from "./_api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCurrencies = async (): Promise<any> => {
  // await api.get(`/cryptocurrency/listings/latest?start=1&limit=20&convert=USD`);
  await api.get(`/cryptocurrency/listings/latest`);
}