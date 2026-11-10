import RestaurantPortfolioPage from "../page";

export default async function RestaurantPreviewPage(props) {
  const resolvedParams = await props.params;
  const resolvedSearchParams = (await props.searchParams) || {};

  return (
    <RestaurantPortfolioPage
      params={Promise.resolve(resolvedParams)}
      searchParams={Promise.resolve({
        ...resolvedSearchParams,
        preview: resolvedSearchParams.preview || "true",
      })}
    />
  );
}
