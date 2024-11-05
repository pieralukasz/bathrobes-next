import { Category } from "./category";

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const categoryId = (await params).categoryId;

  return <Category categoryId={categoryId} />;
}
