export const categories = [
  { id: 1, name: "Starters", emoji: "🥟", itemsCount: "12 items" },
  { id: 2, name: "Main Course", emoji: "🍛", itemsCount: "24 items" },
  { id: 3, name: "Pizza", emoji: "🍕", itemsCount: "18 items" },
  { id: 4, name: "Desserts", emoji: "🍰", itemsCount: "9 items" },
  { id: 5, name: "Drinks", emoji: "🍹", itemsCount: "15 items" },
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
    id: "dal-makhani",
    categoryId: 2,
    title: "Dal Makhani",
    description: "Slow-cooked black lentils, cultured butter",
    price: 390,
    isBestseller: false,
    imageUrl:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop",
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
];

export const popularItems = menuItems;