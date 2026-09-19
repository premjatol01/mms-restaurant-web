export const categories = [
  { id: 1, name: "Starters", emoji: "🥟" },
  { id: 2, name: "Main Course", emoji: "🍛" },
  { id: 3, name: "Pizza", emoji: "🍕" },
  { id: 4, name: "Desserts", emoji: "🍰" },
  { id: 5, name: "Drinks", emoji: "🍹" },
];

// `price` is what's charged, `mrp` is the struck-through original (optional).
export const menuItems = [
  {
    id: "smoked-paneer-tikka",
    categoryId: 1,
    title: "Smoked Paneer Tikka",
    description: "Charred paneer, kasundi & pickled onion",
    price: 420,
    mrp: 480,
    isBestseller: true,
    imageUrl:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "crispy-corn-chaat",
    categoryId: 1,
    title: "Crispy Corn Chaat",
    description: "Sweet corn, tangy tamarind & mint chutney",
    price: 260,
    isBestseller: false,
    imageUrl:
      "https://images.unsplash.com/photo-1626500457731-ecd8b45a1f57?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "chilli-mushroom",
    categoryId: 1,
    title: "Chilli Garlic Mushroom",
    description: "Wok-tossed mushroom, spring onion & soy glaze",
    price: 310,
    mrp: 350,
    isBestseller: false,
    imageUrl:
      "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "dal-makhani",
    categoryId: 2,
    title: "Dal Makhani",
    description: "Slow-cooked black lentils, cultured butter",
    price: 390,
    isBestseller: true,
    imageUrl:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "butter-chicken",
    categoryId: 2,
    title: "Butter Chicken",
    description: "Tandoori chicken simmered in tomato-makhani gravy",
    price: 480,
    mrp: 540,
    isBestseller: true,
    imageUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "veg-biryani",
    categoryId: 2,
    title: "Vegetable Dum Biryani",
    description: "Basmati rice layered with saffron & garden vegetables",
    price: 340,
    isBestseller: false,
    imageUrl:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "margherita-pizza",
    categoryId: 3,
    title: "Margherita",
    description: "San Marzano, fior di latte, basil",
    price: 340,
    mrp: 400,
    isBestseller: true,
    imageUrl:
      "https://images.unsplash.com/photo-1604068549290-62edd9c05b81?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "tandoori-paneer-pizza",
    categoryId: 3,
    title: "Tandoori Paneer Pizza",
    description: "Smoked paneer, peppers & mint drizzle",
    price: 380,
    isBestseller: false,
    imageUrl:
      "https://images.unsplash.com/photo-1548369937-47519962c11a?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "gulab-jamun",
    categoryId: 4,
    title: "Gulab Jamun",
    description: "Warm milk dumplings in cardamom syrup",
    price: 180,
    isBestseller: true,
    imageUrl:
      "https://images.unsplash.com/photo-1666190092208-2d5d7bad3d81?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "chocolate-lava-cake",
    categoryId: 4,
    title: "Chocolate Lava Cake",
    description: "Molten dark chocolate, vanilla bean ice cream",
    price: 240,
    mrp: 280,
    isBestseller: false,
    imageUrl:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "masala-chaas",
    categoryId: 5,
    title: "Masala Chaas",
    description: "Spiced buttermilk, curry leaf tempering",
    price: 110,
    isBestseller: false,
    imageUrl:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "watermelon-mint-cooler",
    categoryId: 5,
    title: "Watermelon Mint Cooler",
    description: "Fresh watermelon, mint & lime",
    price: 160,
    isBestseller: true,
    imageUrl:
      "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=600&auto=format&fit=crop",
  },
];

export const getItemsByCategory = (categoryId) =>
  menuItems.filter((item) => item.categoryId === categoryId);

export const getItemById = (id) => menuItems.find((item) => item.id === id);

export const bestsellerItems = menuItems.filter((item) => item.isBestseller);

export const categoryItems = [
  {
    id: 1,
    name: "Starters",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Main Course",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Desserts",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Breads",
    image:
      "https://images.unsplash.com/photo-1601050690117-9c8c2c2b1b1b?q=80&w=400&auto=format&fit=crop", // Using a generic food image placeholder
  },
  {
    id: 7,
    name: "North Indian",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Sweets",
    image:
      "https://images.unsplash.com/photo-1548848221-0c2e497ed557?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 9,
    name: "Paneer",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&auto=format&fit=crop",
  },
];
