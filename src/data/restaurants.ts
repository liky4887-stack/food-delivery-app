export interface ChoiceOption {
  id: string;
  label: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  type: 'single' | 'multi';
  required: boolean;
  options: ChoiceOption[];
}

export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'no-dairy' | 'no-nuts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  section: string;
  popular?: boolean;
  customizations?: CustomizationGroup[];
  dietaryTags?: DietaryTag[];
  itemRating?: number;
  reviewCount?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
}

export interface RatingBreakdown {
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryFee: number;
  priceRange: string;
  image: string;
  coverImage: string;
  categories: string[];
  freeDelivery: boolean;
  dashPass: boolean;
  promo?: string;
  distance: string;
  menu: MenuItem[];
  reviews: Review[];
  ratingBreakdown: RatingBreakdown;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'all', name: 'All', icon: 'utensils' },
  { id: 'burgers', name: 'Burgers', icon: 'beef' },
  { id: 'pizza', name: 'Pizza', icon: 'pizza' },
  { id: 'sushi', name: 'Sushi', icon: 'fish' },
  { id: 'chicken', name: 'Chicken', icon: 'drumstick-bite' },
  { id: 'desserts', name: 'Desserts', icon: 'cupcake' },
];

export const restaurants: Restaurant[] = [
  {
    id: 'cw-1',
    name: 'Crispy Wings',
    cuisine: 'American, Wings',
    rating: 4.5,
    ratingCount: 1204,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    priceRange: '$$',
    image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
    coverImage: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
    categories: ['burgers', 'chicken'],
    freeDelivery: true,
    dashPass: true,
    distance: '1.2 mi',
    menu: [
      {
        id: 'cw-1-8',
        name: '8pc Classic Wings',
        description: '8 hand-breaded chicken wings tossed in your choice of sauce',
        price: 12.99,
        image: 'https://images.pexels.com/photos/14661492/pexels-photo-14661492.jpeg',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'cw-1-sauce',
            name: 'Dipping Sauce',
            type: 'single',
            required: true,
            options: [
              { id: 'buffalo', label: 'Buffalo', price: 0 },
              { id: 'bbq', label: 'BBQ', price: 0 },
              { id: 'garlic-parm', label: 'Garlic Parmesan', price: 0 },
              { id: 'lemon-pepper', label: 'Lemon Pepper', price: 0 },
              { id: 'nashville', label: 'Nashville Hot', price: 0.75 },
            ],
          },
        ],
        dietaryTags: ['no-dairy'],
        itemRating: 4.5,
        reviewCount: 156,
      },
      {
        id: 'cw-2',
        name: 'Crispy Tenders Basket',
        description: 'Four hand-breaded chicken tenders with two dipping sauces and fries',
        price: 13.00,
        image: 'https://images.pexels.com/photos/14661492/pexels-photo-14661492.jpeg',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'cw-2-dip',
            name: 'Dipping Sauce',
            type: 'single',
            required: true,
            options: [
              { id: 'ranch', label: 'Ranch', price: 0 },
              { id: 'blue-cheese', label: 'Blue Cheese', price: 0 },
              { id: 'honey-mustard', label: 'Honey Mustard', price: 0 },
              { id: 'buffalo', label: 'Buffalo', price: 0 },
            ],
          },
        ],
        itemRating: 4.2,
        reviewCount: 89,
      },
      {
        id: 'cw-3',
        name: 'Loaded Cheese Fries',
        description: 'Crispy fries topped with melted cheddar, bacon bits, and scallions',
        price: 7.50,
        image: 'https://images.pexels.com/photos/39034206/pexels-photo-39034206.jpeg',
        section: 'Sides',
        itemRating: 4.0,
        reviewCount: 45,
      },
      {
        id: 'cw-4',
        name: 'Chocolate Milkshake',
        description: 'Rich chocolate shake topped with whipped cream and chocolate drizzle',
        price: 5.00,
        image: 'https://images.pexels.com/photos/14373648/pexels-photo-14373648.jpeg',
        section: 'Drinks',
        dietaryTags: ['vegetarian'],
        itemRating: 4.8,
        reviewCount: 203,
      },
    ],
    reviews: [
      { id: 'cw-r1', author: 'Marcus J.', rating: 5, date: '2 days ago', text: 'Best wings in town! The Nashville hot sauce is legit spicy and the wings are always crispy.', helpful: 18 },
      { id: 'cw-r2', author: 'Kelly O.', rating: 4, date: '5 days ago', text: 'Tenders are juicy and the honey mustard dip is bomb. Fries could be crispier.', helpful: 9 },
      { id: 'cw-r3', author: 'Steve P.', rating: 5, date: '2 weeks ago', text: 'The 12-piece combo with two sauces is the perfect game day order. Loaded cheese fries are a must.', helpful: 22 },
      { id: 'cw-r4', author: 'Aisha B.', rating: 4, date: '3 weeks ago', text: 'Lemon pepper wings are my favorite. Chocolate milkshake is thick and creamy.', helpful: 5 },
    ],
    ratingBreakdown: { five: 58, four: 30, three: 8, two: 3, one: 1 },
  },
  {
    id: 'pizza-place',
    name: 'Tony\'s Pizza',
    cuisine: 'Italian, Pizza',
    rating: 4.7,
    ratingCount: 2340,
    deliveryTime: '30-40 min',
    deliveryFee: 0,
    priceRange: '$$',
    image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
    coverImage: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
    categories: ['pizza'],
    freeDelivery: true,
    dashPass: false,
    distance: '0.8 mi',
    menu: [
      {
        id: 'pizza-1',
        name: 'Margherita Pizza',
        description: 'Classic tomato sauce, fresh mozzarella, and basil',
        price: 14.99,
        image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
        section: 'Popular',
        popular: true,
        dietaryTags: ['vegetarian'],
        itemRating: 4.8,
        reviewCount: 312,
      },
      {
        id: 'pizza-2',
        name: 'Pepperoni Supreme',
        description: 'Thin crust loaded with pepperoni and mozzarella',
        price: 16.99,
        image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
        section: 'Popular',
        itemRating: 4.6,
        reviewCount: 189,
      },
    ],
    reviews: [
      { id: 'pizza-r1', author: 'John D.', rating: 5, date: '1 day ago', text: 'Best pizza in the city! The crust is perfectly crispy.', helpful: 45 },
      { id: 'pizza-r2', author: 'Maria S.', rating: 4, date: '3 days ago', text: 'Love the pepperoni. Crust could be a bit thicker.', helpful: 12 },
    ],
    ratingBreakdown: { five: 70, four: 20, three: 5, two: 3, one: 2 },
  },
  {
    id: 'sushi-bar',
    name: 'Sakura Sushi',
    cuisine: 'Japanese, Sushi',
    rating: 4.4,
    ratingCount: 890,
    deliveryTime: '35-45 min',
    deliveryFee: 3.99,
    priceRange: '$$$',
    image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
    coverImage: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
    categories: ['sushi'],
    freeDelivery: false,
    dashPass: true,
    distance: '2.1 mi',
    menu: [
      {
        id: 'sushi-1',
        name: 'California Roll',
        description: 'Classic crab, avocado, and cucumber roll',
        price: 12.99,
        image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
        section: 'Popular',
        popular: true,
        dietaryTags: ['vegetarian'],
        itemRating: 4.3,
        reviewCount: 67,
      },
      {
        id: 'sushi-2',
        name: 'Salmon Nigiri',
        description: 'Fresh salmon sashimi over seasoned rice',
        price: 15.99,
        image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
        section: 'Popular',
        itemRating: 4.7,
        reviewCount: 89,
      },
    ],
    reviews: [
      { id: 'sushi-r1', author: 'Kenji T.', rating: 4, date: '1 week ago', text: 'Fresh sushi and great service. Salmon was delicious.', helpful: 23 },
    ],
    ratingBreakdown: { five: 50, four: 35, three: 10, two: 3, one: 2 },
  },
  {
    id: 'burger-king',
    name: 'Burger Barn',
    cuisine: 'American, Burgers',
    rating: 4.2,
    ratingCount: 1567,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    priceRange: '$$',
    image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
    coverImage: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
    categories: ['burgers'],
    freeDelivery: false,
    dashPass: false,
    distance: '1.5 mi',
    menu: [
      {
        id: 'burger-1',
        name: 'Classic Cheeseburger',
        description: 'Angus beef patty with cheddar, lettuce, tomato, and special sauce',
        price: 9.99,
        image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
        section: 'Popular',
        popular: true,
        itemRating: 4.2,
        reviewCount: 134,
      },
      {
        id: 'burger-2',
        name: 'Bacon BBQ Burger',
        description: 'Beef patty with crispy bacon, BBQ sauce, and onion rings',
        price: 12.99,
        image: 'https://images.pexels.com/photos/1238553/pexels-photo-1238553.jpeg',
        section: 'Popular',
        itemRating: 4.5,
        reviewCount: 98,
      },
    ],
    reviews: [
      { id: 'burger-r1', author: 'Mike R.', rating: 4, date: '2 days ago', text: 'Juicy and flavorful. The bacon BBQ is amazing!', helpful: 34 },
      { id: 'burger-r2', author: 'Sarah L.', rating: 4, date: '4 days ago', text: 'Good burger but fries were a bit soggy.', helpful: 8 },
    ],
    ratingBreakdown: { five: 60, four: 25, three: 8, two: 4, one: 3 },
  },
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find(r => r.id === id);
}

export function getMenuItemById(restaurantId: string, itemId: string): MenuItem | undefined {
  const restaurant = getRestaurantById(restaurantId);
  return restaurant?.menu.find(item => item.id === itemId);
}

export function getMenuSections(restaurantId: string): string[] {
  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) return [];
  const sections: string[] = [];
  restaurant.menu.forEach(item => {
    if (!sections.includes(item.section)) {
      sections.push(item.section);
    }
  });
  return sections;
}

export function filterMenuByDietary(menu: MenuItem[], prefs: string[]): MenuItem[] {
  if (prefs.length === 0) return menu;
  return menu.filter(item => {
    if (!item.dietaryTags) return false;
    return prefs.every(pref => item.dietaryTags?.includes(pref as DietaryTag));
  });
}

export function getDishResults(query: string): { item: MenuItem; restaurant: Restaurant }[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: { item: MenuItem; restaurant: Restaurant }[] = [];
  restaurants.forEach(r => {
    r.menu.forEach(item => {
      if (item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
        results.push({ item, restaurant: r });
      }
    });
  });
  return results;
}
