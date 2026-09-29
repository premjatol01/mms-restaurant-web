export default async function RestaurantPortfolioPage({ params }) {
  const { subdomain } = await params;
  
  // Here you will eventually fetch the restaurant data using the subdomain
  // const restaurant = await fetchRestaurantData(subdomain);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', textAlign: 'center' }}>
      <h1>Welcome to {subdomain}'s Portfolio!</h1>
      <p>This is the auto-generated website for the restaurant.</p>
      
      <div style={{ marginTop: '30px' }}>
        <a 
          href="/menu/1" 
          style={{ padding: '10px 20px', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
        >
          View Our Menu
        </a>
      </div>
    </div>
  );
}
