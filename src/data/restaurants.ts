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
  { id: 'healthy', name: 'Healthy', icon: 'leaf' },
  { id: 'mexican', name: 'Mexican', icon: 'pepper' },
  { id: 'dessert', name: 'Dessert', icon: 'ice-cream' },
  { id: 'chicken', name: 'Chicken', icon: 'drumstick' },
];

export const restaurants: Restaurant[] = [
  {
    id: 'burger-craft',
    name: 'Burger Craft Co.',
    cuisine: 'Burgers • American',
    rating: 4.8,
    ratingCount: 2400,
    deliveryTime: '20-30 min',
    deliveryFee: 0,
    priceRange: '$$',
    image: 'https://images.pexels.com/photos/5488052/pexels-photo-5488052.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    coverImage: 'https://images.pexels.com/photos/4315148/pexels-photo-4315148.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    categories: ['burgers'],
    freeDelivery: true,
    dashPass: true,
    promo: '20% off orders $15+',
    distance: '0.8 mi',
    menu: [
      {
        id: 'bc-1',
        name: 'Signature Craft Burger',
        description: 'Angus beef patty, aged cheddar, caramelized onions, house sauce on a brioche bun',
        price: 12.50,
        image: 'https://images.pexels.com/photos/8162589/pexels-photo-8162589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'bc-1-size',
            name: 'Size',
            type: 'single',
            required: true,
            options: [
              { id: 'single', label: 'Single Patty', price: 0 },
              { id: 'double', label: 'Double Patty', price: 4.50 },
            ],
          },
          {
            id: 'bc-1-doneness',
            name: 'Cooking Temperature',
            type: 'single',
            required: true,
            options: [
              { id: 'rare', label: 'Rare', price: 0 },
              { id: 'medium-rare', label: 'Medium Rare', price: 0 },
              { id: 'medium', label: 'Medium', price: 0 },
              { id: 'well', label: 'Well Done', price: 0 },
            ],
          },
          {
            id: 'bc-1-extras',
            name: 'Add Extras',
            type: 'multi',
            required: false,
            options: [
              { id: 'bacon', label: 'Smoked Bacon', price: 2.00 },
              { id: 'avocado', label: 'Avocado', price: 1.50 },
              { id: 'egg', label: 'Fried Egg', price: 1.50 },
              { id: 'jalapeno', label: 'Jalapenos', price: 0.75 },
            ],
          },
        ],
      },
      {
        id: 'bc-2',
        name: 'Bacon Blue Burger',
        description: 'Blue cheese crumbles, crispy bacon, arugula, fig jam, toasted brioche',
        price: 14.00,
        image: 'https://images.pexels.com/photos/6088519/pexels-photo-6088519.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'bc-2-extras',
            name: 'Add Extras',
            type: 'multi',
            required: false,
            options: [
              { id: 'extra-bacon', label: 'Extra Bacon', price: 2.50 },
              { id: 'extra-cheese', label: 'Extra Blue Cheese', price: 1.50 },
              { id: 'onion-rings', label: 'Onion Rings', price: 2.00 },
            ],
          },
        ],
      },
      {
        id: 'bc-3',
        name: 'Crispy Chicken Sandwich',
        description: 'Buttermilk-fried chicken, slaw, pickles, spicy mayo on a potato bun',
        price: 11.00,
        image: 'https://images.pexels.com/photos/5374420/pexels-photo-5374420.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'bc-3-spice',
            name: 'Spice Level',
            type: 'single',
            required: true,
            options: [
              { id: 'mild', label: 'Mild', price: 0 },
              { id: 'medium', label: 'Medium', price: 0 },
              { id: 'hot', label: 'Hot', price: 0 },
              { id: 'nashville', label: 'Nashville Hot', price: 0.50 },
            ],
          },
        ],
      },
      {
        id: 'bc-4',
        name: 'Truffle Parm Fries',
        description: 'Hand-cut fries tossed in truffle oil, parmesan, and fresh parsley',
        price: 7.00,
        image: 'https://images.pexels.com/photos/2235832/pexels-photo-2235832.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Sides',
        dietaryTags: ['vegetarian', 'gluten-free', 'no-dairy'],
        itemRating: 4.9,
        reviewCount: 320,
        customizations: [
          {
            id: 'bc-4-size',
            name: 'Size',
            type: 'single',
            required: true,
            options: [
              { id: 'regular', label: 'Regular', price: 0 },
              { id: 'large', label: 'Large', price: 2.50 },
            ],
          },
        ],
      },
      {
        id: 'bc-5',
        name: 'Loaded Buffalo Wings',
        description: 'Eight wings tossed in buffalo sauce, served with blue cheese dip and celery',
        price: 10.50,
        image: 'https://images.pexels.com/photos/9872916/pexels-photo-9872916.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Sides',
        customizations: [
          {
            id: 'bc-5-sauce',
            name: 'Sauce',
            type: 'single',
            required: true,
            options: [
              { id: 'buffalo', label: 'Buffalo', price: 0 },
              { id: 'bbq', label: 'BBQ', price: 0 },
              { id: 'garlic-parm', label: 'Garlic Parmesan', price: 0 },
              { id: 'nashville-hot', label: 'Nashville Hot', price: 0.75 },
            ],
          },
        ],
      },
      {
        id: 'bc-6',
        name: 'Classic Vanilla Shake',
        description: 'Hand-spun vanilla milkshake with whipped cream and a cherry',
        price: 5.50,
        image: 'https://images.pexels.com/photos/28525197/pexels-photo-28525197.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Drinks',
        dietaryTags: ['vegetarian', 'no-nuts'],
        itemRating: 4.7,
        reviewCount: 180,
        customizations: [
          {
            id: 'bc-6-flavor',
            name: 'Flavor',
            type: 'single',
            required: true,
            options: [
              { id: 'vanilla', label: 'Vanilla', price: 0 },
              { id: 'chocolate', label: 'Chocolate', price: 0 },
              { id: 'strawberry', label: 'Strawberry', price: 0.50 },
            ],
          },
        ],
      },
      {
        id: 'bc-7',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
        price: 6.50,
        image: 'https://images.pexels.com/photos/33674414/pexels-photo-33674414.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Desserts',
        dietaryTags: ['vegetarian', 'no-nuts'],
        itemRating: 4.8,
        reviewCount: 95,
      },
    ],
    reviews: [
      { id: 'bc-r1', author: 'Michael R.', rating: 5, date: '2 days ago', text: 'Best burger in the city! The craft burger is absolutely perfect -- juicy, flavorful, and the brioche bun is next level.', helpful: 24 },
      { id: 'bc-r2', author: 'Jessica L.', rating: 5, date: '1 week ago', text: 'The bacon blue burger changed my life. Fig jam on a burger? Sounds weird but trust me, it works.', helpful: 18 },
      { id: 'bc-r3', author: 'David K.', rating: 4, date: '2 weeks ago', text: 'Great burgers but the wait was a bit long during lunch rush. Worth it though.', helpful: 7 },
      { id: 'bc-r4', author: 'Sarah M.', rating: 5, date: '3 weeks ago', text: 'Truffle parmesan fries are addictive. I dream about them. Fast delivery too!', helpful: 12 },
    ],
    ratingBreakdown: { five: 78, four: 16, three: 4, two: 1, one: 1 },
  },
  {
    id: 'pizza-palace',
    name: 'Pizza Palace',
    cuisine: 'Pizza • Italian',
    rating: 4.7,
    ratingCount: 3200,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    priceRange: '$$',
    image: 'https://images.pexels.com/photos/5903317/pexels-photo-5903317.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    coverImage: 'https://images.pexels.com/photos/8471699/pexels-photo-8471699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    categories: ['pizza'],
    freeDelivery: false,
    dashPass: true,
    promo: 'Free delivery over $20',
    distance: '1.2 mi',
    menu: [
      {
        id: 'pp-1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, basil, San Marzano tomato sauce, extra virgin olive oil',
        price: 13.00,
        image: 'https://images.pexels.com/photos/5903378/pexels-photo-5903378.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'pp-1-size',
            name: 'Size',
            type: 'single',
            required: true,
            options: [
              { id: 'small', label: 'Small (10")', price: 0 },
              { id: 'medium', label: 'Medium (14")', price: 5.00 },
              { id: 'large', label: 'Large (18")', price: 10.00 },
            ],
          },
          {
            id: 'pp-1-crust',
            name: 'Crust Style',
            type: 'single',
            required: true,
            options: [
              { id: 'thin', label: 'Thin Crust', price: 0 },
              { id: 'regular', label: 'Regular', price: 0 },
              { id: 'sicilian', label: 'Sicilian', price: 2.00 },
            ],
          },
          {
            id: 'pp-1-toppings',
            name: 'Add Toppings',
            type: 'multi',
            required: false,
            options: [
              { id: 'pepperoni', label: 'Pepperoni', price: 2.00 },
              { id: 'mushrooms', label: 'Mushrooms', price: 1.50 },
              { id: 'sausage', label: 'Italian Sausage', price: 2.00 },
              { id: 'olives', label: 'Black Olives', price: 1.00 },
              { id: 'peppers', label: 'Bell Peppers', price: 1.00 },
            ],
          },
        ],
      },
      {
        id: 'pp-2',
        name: 'Pepperoni Supreme',
        description: 'Double pepperoni, mozzarella, tomato sauce, oregano',
        price: 16.00,
        image: 'https://images.pexels.com/photos/15197931/pexels-photo-15197931.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'pp-2-size',
            name: 'Size',
            type: 'single',
            required: true,
            options: [
              { id: 'small', label: 'Small (10")', price: 0 },
              { id: 'medium', label: 'Medium (14")', price: 5.00 },
              { id: 'large', label: 'Large (18")', price: 10.00 },
            ],
          },
        ],
      },
      {
        id: 'pp-3',
        name: 'Garlic Knots',
        description: 'Six hand-rolled knots baked with garlic butter and parmesan, served with marinara',
        price: 5.50,
        image: 'https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Sides',
      },
      {
        id: 'pp-4',
        name: 'Chocolate Chip Cookie Pie',
        description: 'Warm cookie pie baked in a pizza pan, served with a scoop of vanilla ice cream',
        price: 7.00,
        image: 'https://images.pexels.com/photos/8081573/pexels-photo-8081573.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Desserts',
      },
    ],
    reviews: [
      { id: 'pp-r1', author: 'Anthony T.', rating: 5, date: '3 days ago', text: 'The margherita pizza is authentic Italian perfection. Fresh mozzarella makes all the difference.', helpful: 31 },
      { id: 'pp-r2', author: 'Maria G.', rating: 5, date: '1 week ago', text: 'Pepperoni supreme is loaded! Best value pizza delivery around.', helpful: 15 },
      { id: 'pp-r3', author: 'Tom B.', rating: 4, date: '1 week ago', text: 'Garlic knots are a must-order. Pizza is great but sometimes arrives slightly lukewarm.', helpful: 9 },
      { id: 'pp-r4', author: 'Lisa P.', rating: 5, date: '3 weeks ago', text: 'The cookie pie dessert is unreal. Warm, gooey, and that ice cream on top -- chef\'s kiss.', helpful: 22 },
    ],
    ratingBreakdown: { five: 72, four: 20, three: 5, two: 2, one: 1 },
  },
  {
    id: 'sushi-sakura',
    name: 'Sushi Sakura',
    cuisine: 'Sushi • Japanese',
    rating: 4.9,
    ratingCount: 1800,
    deliveryTime: '30-45 min',
    deliveryFee: 3.99,
    priceRange: '$$$',
    image: 'https://images.pexels.com/photos/31393436/pexels-photo-31393436.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    coverImage: 'https://images.pexels.com/photos/4353087/pexels-photo-4353087.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    categories: ['sushi'],
    freeDelivery: false,
    dashPass: true,
    promo: 'Free miso soup over $25',
    distance: '1.5 mi',
    menu: [
      {
        id: 'ss-1',
        name: 'Dragon Roll',
        description: 'Shrimp tempura, avocado, eel, unagi sauce, tobiko',
        price: 15.00,
        image: 'https://images.pexels.com/photos/11470545/pexels-photo-11470545.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'ss-1-count',
            name: 'Pieces',
            type: 'single',
            required: true,
            options: [
              { id: '6pc', label: '6 Pieces', price: 0 },
              { id: '8pc', label: '8 Pieces', price: 4.00 },
            ],
          },
          {
            id: 'ss-1-extras',
            name: 'Add Ons',
            type: 'multi',
            required: false,
            options: [
              { id: 'extra-unagi', label: 'Extra Unagi Sauce', price: 1.00 },
              { id: 'wasabi', label: 'Extra Wasabi', price: 0.50 },
              { id: 'ginger', label: 'Extra Ginger', price: 0.50 },
            ],
          },
        ],
      },
      {
        id: 'ss-2',
        name: 'Salmon Sashimi',
        description: 'Five pieces of fresh Atlantic salmon, sliced to perfection',
        price: 12.00,
        image: 'https://images.pexels.com/photos/13869853/pexels-photo-13869853.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'ss-2-count',
            name: 'Pieces',
            type: 'single',
            required: true,
            options: [
              { id: '5pc', label: '5 Pieces', price: 0 },
              { id: '10pc', label: '10 Pieces', price: 10.00 },
            ],
          },
        ],
      },
      {
        id: 'ss-3',
        name: 'Tonkotsu Ramen',
        description: 'Rich pork bone broth, chashu, soft-boiled egg, scallions, bamboo shoots',
        price: 14.50,
        image: 'https://images.pexels.com/photos/31393431/pexels-photo-31393431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Mains',
        dietaryTags: ['no-dairy', 'no-nuts'],
        itemRating: 4.9,
        reviewCount: 210,
        customizations: [
          {
            id: 'ss-3-broth',
            name: 'Broth Richness',
            type: 'single',
            required: true,
            options: [
              { id: 'light', label: 'Light', price: 0 },
              { id: 'regular', label: 'Regular', price: 0 },
              { id: 'rich', label: 'Extra Rich', price: 1.50 },
            ],
          },
          {
            id: 'ss-3-extras',
            name: 'Add Ons',
            type: 'multi',
            required: false,
            options: [
              { id: 'extra-egg', label: 'Extra Egg', price: 2.00 },
              { id: 'extra-chashu', label: 'Extra Chashu', price: 3.50 },
              { id: 'nori', label: 'Nori', price: 1.00 },
            ],
          },
        ],
      },
      {
        id: 'ss-4',
        name: 'California Roll',
        description: 'Crab, avocado, cucumber, sesame seeds — 8 pieces',
        price: 8.00,
        image: 'https://images.pexels.com/photos/7719906/pexels-photo-7719906.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Mains',
        dietaryTags: ['no-dairy'],
        itemRating: 4.6,
        reviewCount: 140,
      },
      {
        id: 'ss-5',
        name: 'Mochi Ice Cream',
        description: 'Three pieces: matcha, mango, and chocolate',
        price: 6.00,
        image: 'https://images.pexels.com/photos/4869435/pexels-photo-4869435.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Desserts',
      },
    ],
    reviews: [
      { id: 'ss-r1', author: 'Kenji Y.', rating: 5, date: '1 day ago', text: 'The dragon roll is the best I\'ve had outside of Japan. Presentation is beautiful and fish is incredibly fresh.', helpful: 28 },
      { id: 'ss-r2', author: 'Emily C.', rating: 5, date: '5 days ago', text: 'Tonkotsu ramen with extra rich broth = perfection. The chashu melts in your mouth.', helpful: 19 },
      { id: 'ss-r3', author: 'James W.', rating: 4, date: '2 weeks ago', text: 'Excellent sushi but pricey. Worth it for a treat though. Salmon sashimi was buttery and fresh.', helpful: 11 },
      { id: 'ss-r4', author: 'Yuki N.', rating: 5, date: '3 weeks ago', text: 'The mochi ice cream trio is the perfect ending. Matcha flavor is authentic and not too sweet.', helpful: 8 },
    ],
    ratingBreakdown: { five: 82, four: 13, three: 3, two: 1, one: 1 },
  },
  {
    id: 'fresh-bowl',
    name: 'Fresh Bowl',
    cuisine: 'Healthy • Salads',
    rating: 4.6,
    ratingCount: 950,
    deliveryTime: '15-25 min',
    deliveryFee: 0,
    priceRange: '$$',
    image: 'https://images.pexels.com/photos/842545/pexels-photo-842545.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    coverImage: 'https://images.pexels.com/photos/3070968/pexels-photo-3070968.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    categories: ['healthy'],
    freeDelivery: true,
    dashPass: false,
    distance: '0.5 mi',
    menu: [
      {
        id: 'fb-1',
        name: 'Power Chicken Bowl',
        description: 'Grilled chicken, quinoa, kale, roasted sweet potato, avocado, lemon tahini dressing',
        price: 12.00,
        image: 'https://images.pexels.com/photos/1591226/pexels-photo-1591226.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        dietaryTags: ['no-dairy', 'no-nuts'],
        itemRating: 4.8,
        reviewCount: 260,
        customizations: [
          {
            id: 'fb-1-protein',
            name: 'Protein',
            type: 'single',
            required: true,
            options: [
              { id: 'chicken', label: 'Grilled Chicken', price: 0 },
              { id: 'tofu', label: 'Tofu', price: 0 },
              { id: 'steak', label: 'Steak', price: 3.00 },
              { id: 'salmon', label: 'Salmon', price: 4.00 },
            ],
          },
          {
            id: 'fb-1-base',
            name: 'Base',
            type: 'single',
            required: true,
            options: [
              { id: 'quinoa', label: 'Quinoa', price: 0 },
              { id: 'greens', label: 'Mixed Greens', price: 0 },
              { id: 'brown-rice', label: 'Brown Rice', price: 0 },
            ],
          },
          {
            id: 'fb-1-extras',
            name: 'Add Ons',
            type: 'multi',
            required: false,
            options: [
              { id: 'avocado', label: 'Avocado', price: 1.50 },
              { id: 'egg', label: 'Hard Boiled Egg', price: 1.00 },
              { id: 'hummus', label: 'Hummus', price: 1.50 },
            ],
          },
        ],
      },
      {
        id: 'fb-2',
        name: 'Falafel Mediterranean Bowl',
        description: 'Crispy falafel, hummus, cucumber tomato salad, olives, tzatziki, pita chips',
        price: 10.50,
        image: 'https://images.pexels.com/photos/4958946/pexels-photo-4958946.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        dietaryTags: ['vegetarian', 'vegan', 'no-dairy', 'no-nuts'],
        itemRating: 4.7,
        reviewCount: 190,
        customizations: [
          {
            id: 'fb-2-base',
            name: 'Base',
            type: 'single',
            required: true,
            options: [
              { id: 'greens', label: 'Mixed Greens', price: 0 },
              { id: 'rice', label: 'Brown Rice', price: 0 },
              { id: 'pita', label: 'Pita Bowl', price: 0 },
            ],
          },
        ],
      },
      {
        id: 'fb-3',
        name: 'Garden Fresh Salad',
        description: 'Mixed greens, cherry tomatoes, cucumber, walnuts, mozzarella, balsamic vinaigrette',
        price: 9.00,
        image: 'https://images.pexels.com/photos/33323285/pexels-photo-33323285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Mains',
        dietaryTags: ['vegetarian', 'no-nuts'],
        itemRating: 4.5,
        reviewCount: 85,
        customizations: [
          {
            id: 'fb-3-dressing',
            name: 'Dressing',
            type: 'single',
            required: true,
            options: [
              { id: 'balsamic', label: 'Balsamic Vinaigrette', price: 0 },
              { id: 'ranch', label: 'Ranch', price: 0 },
              { id: 'caesar', label: 'Caesar', price: 0 },
              { id: 'lemon', label: 'Lemon Herb', price: 0 },
            ],
          },
        ],
      },
      {
        id: 'fb-4',
        name: 'Mango Smoothie',
        description: 'Fresh mango, banana, coconut water, and a hint of lime',
        price: 5.50,
        image: 'https://images.pexels.com/photos/8394976/pexels-photo-8394976.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Drinks',
        dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'no-dairy', 'no-nuts'],
        itemRating: 4.6,
        reviewCount: 72,
      },
    ],
    reviews: [
      { id: 'fb-r1', author: 'Rachel G.', rating: 5, date: '2 days ago', text: 'The power chicken bowl is my go-to healthy lunch. Perfectly portioned and the lemon tahini dressing is amazing.', helpful: 16 },
      { id: 'fb-r2', author: 'Alex M.', rating: 4, date: '1 week ago', text: 'Falafel bowl is delicious and filling. Would love more sauce options but still great.', helpful: 8 },
      { id: 'fb-r3', author: 'Nina P.', rating: 5, date: '2 weeks ago', text: 'Fresh, fast, and healthy. The mango smoothie is the best I\'ve had from any delivery place.', helpful: 12 },
      { id: 'fb-r4', author: 'Chris D.', rating: 4, date: '3 weeks ago', text: 'Good portions and fresh ingredients. Garden salad could use more variety in veggies.', helpful: 4 },
    ],
    ratingBreakdown: { five: 65, four: 25, three: 7, two: 2, one: 1 },
  },
  {
    id: 'taco-fiesta',
    name: 'Taco Fiesta',
    cuisine: 'Mexican • Tacos',
    rating: 4.5,
    ratingCount: 1500,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    priceRange: '$',
    image: 'https://images.pexels.com/photos/36498696/pexels-photo-36498696.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    coverImage: 'https://images.pexels.com/photos/4958779/pexels-photo-4958779.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    categories: ['mexican'],
    freeDelivery: false,
    dashPass: false,
    promo: 'Buy 3 tacos, get 1 free',
    distance: '0.9 mi',
    menu: [
      {
        id: 'tf-1',
        name: 'Al Pastor Tacos',
        description: 'Marinated pork, pineapple, cilantro, onion, on corn tortillas — set of 3',
        price: 9.00,
        image: 'https://images.pexels.com/photos/7388095/pexels-photo-7388095.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'tf-1-tortilla',
            name: 'Tortilla',
            type: 'single',
            required: true,
            options: [
              { id: 'corn', label: 'Corn', price: 0 },
              { id: 'flour', label: 'Flour', price: 0 },
            ],
          },
          {
            id: 'tf-1-salsa',
            name: 'Salsa',
            type: 'single',
            required: true,
            options: [
              { id: 'mild', label: 'Mild Pico', price: 0 },
              { id: 'verde', label: 'Salsa Verde', price: 0 },
              { id: 'roja', label: 'Salsa Roja', price: 0 },
              { id: 'habanero', label: 'Habanero', price: 0.50 },
            ],
          },
        ],
      },
      {
        id: 'tf-2',
        name: 'Chicken Tinga Tacos',
        description: 'Shredded chicken in chipotle tomato sauce, avocado, queso fresco — set of 3',
        price: 8.50,
        image: 'https://images.pexels.com/photos/36498704/pexels-photo-36498704.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
      },
      {
        id: 'tf-3',
        name: 'Chips & Guacamole',
        description: 'Freshly made guacamole with lime and cilantro, served with warm tortilla chips',
        price: 6.00,
        image: 'https://images.pexels.com/photos/36498699/pexels-photo-36498699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Sides',
        dietaryTags: ['vegetarian', 'vegan', 'no-dairy', 'no-nuts'],
        itemRating: 4.7,
        reviewCount: 130,
      },
      {
        id: 'tf-4',
        name: 'Churros with Chocolate',
        description: 'Four warm churros dusted in cinnamon sugar with a rich chocolate dipping sauce',
        price: 5.00,
        image: 'https://images.pexels.com/photos/4662035/pexels-photo-4662035.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Desserts',
        dietaryTags: ['vegetarian', 'no-dairy', 'no-nuts'],
        itemRating: 4.8,
        reviewCount: 60,
      },
    ],
    reviews: [
      { id: 'tf-r1', author: 'Carlos R.', rating: 5, date: '1 day ago', text: 'Al pastor tacos are the real deal. Pineapple on pork is authentic Mexico City style. Salsa roja packs a punch!', helpful: 20 },
      { id: 'tf-r2', author: 'Beth S.', rating: 4, date: '4 days ago', text: 'Chicken tinga tacos are flavorful and juicy. Wish they had more salsa options.', helpful: 7 },
      { id: 'tf-r3', author: 'Miguel A.', rating: 5, date: '1 week ago', text: 'The guacamole is made fresh and you can taste it. Best chips and guac for the price.', helpful: 14 },
      { id: 'tf-r4', author: 'Dana F.', rating: 4, date: '2 weeks ago', text: 'Churros with chocolate dipping sauce = dessert heaven. Tacos are solid too.', helpful: 6 },
    ],
    ratingBreakdown: { five: 60, four: 28, three: 8, two: 3, one: 1 },
  },
  {
    id: 'wing-stop',
    name: 'Crispy Wing Co.',
    cuisine: 'Chicken • Wings',
    rating: 4.4,
    ratingCount: 2100,
    deliveryTime: '15-25 min',
    deliveryFee: 2.49,
    priceRange: '$',
    image: 'https://images.pexels.com/photos/5652266/pexels-photo-5652266.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    coverImage: 'https://images.pexels.com/photos/6941026/pexels-photo-6941026.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    categories: ['chicken'],
    freeDelivery: false,
    dashPass: false,
    distance: '0.7 mi',
    menu: [
      {
        id: 'cw-1',
        name: '12 Piece Wing Combo',
        description: 'Twelve jumbo wings with your choice of two sauces, served with fries and a dip',
        price: 18.00,
        image: 'https://images.pexels.com/photos/36617209/pexels-photo-36617209.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Popular',
        popular: true,
        customizations: [
          {
            id: 'cw-1-sauce1',
            name: 'First Sauce',
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
          {
            id: 'cw-1-sauce2',
            name: 'Second Sauce',
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
      },
      {
        id: 'cw-2',
        name: 'Crispy Tenders Basket',
        description: 'Four hand-breaded chicken tenders with two dipping sauces and fries',
        price: 13.00,
        image: 'https://images.pexels.com/photos/14661492/pexels-photo-14661492.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
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
      },
      {
        id: 'cw-3',
        name: 'Loaded Cheese Fries',
        description: 'Crispy fries topped with melted cheddar, bacon bits, and scallions',
        price: 7.50,
        image: 'https://images.pexels.com/photos/39034206/pexels-photo-39034206.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Sides',
      },
      {
        id: 'cw-4',
        name: 'Chocolate Milkshake',
        description: 'Rich chocolate shake topped with whipped cream and chocolate drizzle',
        price: 5.00,
        image: 'https://images.pexels.com/photos/14373648/pexels-photo-14373648.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        section: 'Drinks',
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
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}

export function getMenuItemById(restaurantId: string, itemId: string): MenuItem | undefined {
  const restaurant = getRestaurantById(restaurantId);
  return restaurant?.menu.find((item) => item.id === itemId);
}

export function getMenuSections(restaurantId: string): string[] {
  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) return [];
  const sections: string[] = [];
  restaurant.menu.forEach((item) => {
    if (!sections.includes(item.section)) {
      sections.push(item.section);
    }
  });
  return sections;
}

export function filterMenuByDietary(menu: MenuItem[], prefs: string[]): MenuItem[] {
  if (prefs.length === 0) return menu;
  return menu.filter((item) => {
    if (!item.dietaryTags) return false;
    return prefs.every((pref) => item.dietaryTags?.includes(pref as DietaryTag));
  });
}

export function getDishResults(query: string): { item: MenuItem; restaurant: Restaurant }[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: { item: MenuItem; restaurant: Restaurant }[] = [];
  restaurants.forEach((r) => {
    r.menu.forEach((item) => {
      if (item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
        results.push({ item, restaurant: r });
      }
    });
  });
  return results;
}
