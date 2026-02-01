import { DishForm } from '@/components/features/dishes/DishForm';

export const metadata = {
  title: '料理を登録 - Life Platter',
};

export default async function AddDishPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  return <DishForm defaultDate={date} />;
}
