export interface MenuItem {
  id: string;
  name: string;
  category: 'classics' | 'pourover' | 'coldbrew' | 'bakery' | 'beans';
  price: number;
  description: string;
  tastingNotes?: string[];
  image: string;
  badge?: string;
  prepTime: string;
  origin?: string;
  roastLevel?: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  popular?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'latte-art-artisan',
    name: 'Artisanal Oat Flat White',
    category: 'classics',
    price: 5.75,
    description: 'Double ristretto extracted over velvety microfoam oat milk, finished with our signature swan rosetta pour.',
    tastingNotes: ['Toasted Oats', 'Honey Comb', 'Milk Chocolate'],
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    badge: 'Bestseller',
    prepTime: '3-4 mins',
    roastLevel: 'Medium',
    popular: true,
  },
  {
    id: 'signature-cloud-mocha',
    name: 'Whipped Velvet Cloud Mocha',
    category: 'classics',
    price: 6.50,
    description: 'Single-origin espresso blended with 70% Valrhona dark chocolate, topped with house vanilla whip and shaved cocoa curls.',
    tastingNotes: ['Dark Cocoa', 'Bourbon Vanilla', 'Caramel'],
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    badge: 'Signature',
    prepTime: '4 mins',
    roastLevel: 'Medium-Dark',
    popular: true,
  },
  {
    id: 'cappuccino-cinnamon-dust',
    name: 'Golden Dust Cappuccino',
    category: 'classics',
    price: 5.25,
    description: 'Classic equal third balance of bold espresso, steamed whole milk, and dense foam sprinkled with Ceylon cinnamon.',
    tastingNotes: ['Ceylon Cinnamon', 'Roasted Almond', 'Brown Sugar'],
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    prepTime: '3 mins',
    roastLevel: 'Medium',
    popular: true,
  },
  {
    id: 'spanish-cortado',
    name: 'Spanish Caramel Cortado',
    category: 'classics',
    price: 4.85,
    description: '1:1 ratio of intense espresso and warm condensed milk cut with silky textured foam. Served in a heavy Gibraltar glass.',
    tastingNotes: ['Dulce de Leche', 'Roasted Pecan', 'Molasses'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    prepTime: '2-3 mins',
    roastLevel: 'Dark',
  },
  {
    id: 'ethiopian-yirgacheffe-chemex',
    name: 'Ethiopian Yirgacheffe Pour-Over',
    category: 'pourover',
    price: 6.95,
    description: 'Hand-poured slow extraction using conical Chemex glass. Delicate tea-like body with vibrant floral jasmine aroma.',
    tastingNotes: ['Jasmine Flower', 'Bergamot', 'Wild Peach'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    badge: 'Barista Choice',
    prepTime: '5-6 mins',
    origin: 'Gedeo Zone, Ethiopia (2,050m)',
    roastLevel: 'Light',
    popular: true,
  },
  {
    id: 'panama-geisha-v60',
    name: 'Panama Boquete Geisha V60',
    category: 'pourover',
    price: 9.50,
    description: 'Prestigious Gesha varietal naturally processed. Unrivaled complexity, notes of lemongrass, ripe mango, and honey.',
    tastingNotes: ['Meyer Lemon', 'Mango Nectar', 'White Honey'],
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    badge: 'Reserve Lot',
    prepTime: '6 mins',
    origin: 'Hacienda La Esmeralda, Panama',
    roastLevel: 'Light',
  },
  {
    id: 'nitro-cold-brew-foam',
    name: 'Nitro Cold Brew with Salted Caramel Foam',
    category: 'coldbrew',
    price: 6.25,
    description: 'Steeped for 20 hours and nitrogen-infused for a stout-like creamy cascade, topped with sea-salt caramel sweet foam.',
    tastingNotes: ['Dark Chocolate', 'Guérande Sea Salt', 'Toffee'],
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    badge: 'Trending',
    prepTime: '1-2 mins',
    roastLevel: 'Dark',
    popular: true,
  },
  {
    id: 'brown-sugar-shaken-espresso',
    name: 'Brown Sugar Cinnamon Shaken Espresso',
    category: 'coldbrew',
    price: 6.45,
    description: 'Blonde espresso shots shaken over artisanal ice with organic Muscovado sugar and fresh cinnamon, topped with oat milk.',
    tastingNotes: ['Warm Spice', 'Muscovado', 'Creamy Vanilla'],
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    prepTime: '3 mins',
    roastLevel: 'Medium',
    popular: true,
  },
  {
    id: 'pistachio-cardamom-croissant',
    name: 'Pistachio Cardamom Croissant',
    category: 'bakery',
    price: 5.50,
    description: '72-layer cultured butter lamination filled with roasted Sicilian pistachio paste and fragrant crushed green cardamom.',
    tastingNotes: ['Cultured Butter', 'Pistachio Praline', 'Flaky'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    badge: 'Freshly Baked',
    prepTime: 'Ready',
    popular: true,
  },
  {
    id: 'burnt-basque-cheesecake',
    name: 'Vanilla Bean Basque Cheesecake',
    category: 'bakery',
    price: 6.75,
    description: 'Caramelized burnt exterior with a molten creamy center infused with Madagascar vanilla beans and sea salt flakes.',
    tastingNotes: ['Caramelized Crust', 'Creamy Custard', 'Madagascar Vanilla'],
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    badge: 'House Special',
    prepTime: 'Ready',
  },
  {
    id: 'beans-dawn-patrol-blend',
    name: 'Dawn Roastery Blend (250g Whole Bean)',
    category: 'beans',
    price: 18.00,
    description: 'Our flagship house blend: washed Colombia & natural Ethiopia. Perfect for daily espresso, moka pot, or French press.',
    tastingNotes: ['Dark Chocolate', 'Clementine Orange', 'Hazelnut'],
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
    badge: 'Whole Bean',
    prepTime: 'In Stock',
    roastLevel: 'Medium',
  },
  {
    id: 'beans-midnight-velvet',
    name: 'Midnight Velvet French Roast (250g)',
    category: 'beans',
    price: 18.50,
    description: 'Slow-roasted over fruitwood. Low acidity, deep smoky cacao richness and an unctuous syrupy crema.',
    tastingNotes: ['Smoked Cacao', 'Cedar', 'Black Cherry'],
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    badge: 'Whole Bean',
    prepTime: 'In Stock',
    roastLevel: 'Dark',
  },
];

export interface CartItem {
  cartId: string;
  item: MenuItem;
  quantity: number;
  size?: 'Regular (12oz)' | 'Large (16oz)' | '250g Bag';
  milk?: 'Oat Milk (+0.75)' | 'Whole Milk' | 'Almond Milk (+0.75)' | 'Coconut Milk (+0.75)' | 'None';
  roast?: 'Light Floral' | 'Medium Balanced' | 'Dark French';
  sweetness?: 'No Sugar' | '50% Sweet' | '100% Standard' | 'Vanilla Syrup (+0.60)';
  extraShot?: boolean;
  notes?: string;
  calculatedPrice: number;
}
