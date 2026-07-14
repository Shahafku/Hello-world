// Sample product catalog with per-chain prices in ILS (₪).
//
// A `null` price means the chain does not carry that item (it will be flagged
// as "missing" when comparing baskets). Prices are representative samples in
// the spirit of the price-transparency data; replace with a live feed for
// production (see data/README-prices.md).
//
// keywords: lowercase Hebrew/English aliases used to match free-text and
// uploaded lists against catalog items.

export const products = [
  // ---- Dairy & eggs (מוצרי חלב וביצים) ----
  { id: 'milk-3', nameHe: 'חלב תנובה 3% 1 ליטר', name: 'Milk 3% 1L', category: 'מוצרי חלב', unit: 'קרטון', keywords: ['חלב', 'milk', 'תנובה'],
    prices: { shufersal: 6.20, ramilevy: 5.90, victory: 6.10, yochananof: 5.95, osherad: 5.80, tivtaam: 6.40 } },
  { id: 'cottage', nameHe: 'קוטג׳ תנובה 5% 250 גרם', name: 'Cottage cheese 5%', category: 'מוצרי חלב', unit: 'גביע', keywords: ['קוטג', 'cottage'],
    prices: { shufersal: 6.90, ramilevy: 6.50, victory: 6.80, yochananof: 6.60, osherad: 6.40, tivtaam: 7.10 } },
  { id: 'eggs-12', nameHe: 'ביצים L אריזת 12', name: 'Eggs L (12)', category: 'מוצרי חלב', unit: 'אריזה', keywords: ['ביצים', 'ביצה', 'eggs'],
    prices: { shufersal: 13.90, ramilevy: 12.90, victory: 13.50, yochananof: 13.20, osherad: 12.50, tivtaam: 14.20 } },
  { id: 'yogurt', nameHe: 'יופלה יוגורt 150 גרם', name: 'Yogurt', category: 'מוצרי חלב', unit: 'גביע', keywords: ['יוגורט', 'יופלה', 'yogurt'],
    prices: { shufersal: 4.50, ramilevy: 4.20, victory: 4.40, yochananof: 4.30, osherad: 4.10, tivtaam: 4.80 } },
  { id: 'butter', nameHe: 'חמאה תנובה 200 גרם', name: 'Butter 200g', category: 'מוצרי חלב', unit: 'חבילה', keywords: ['חמאה', 'butter'],
    prices: { shufersal: 8.90, ramilevy: 8.30, victory: 8.70, yochananof: 8.50, osherad: 7.90, tivtaam: 9.20 } },
  { id: 'yellow-cheese', nameHe: 'גבינה צהובה עמק 400 גרם', name: 'Yellow cheese', category: 'מוצרי חלב', unit: 'חבילה', keywords: ['גבינה צהובה', 'עמק', 'cheese'],
    prices: { shufersal: 24.90, ramilevy: 22.90, victory: 23.90, yochananof: 23.50, osherad: 21.90, tivtaam: 25.90 } },

  // ---- Bakery (מאפים) ----
  { id: 'bread-white', nameHe: 'לחם אחיד פרוס 750 גרם', name: 'Sliced white bread', category: 'מאפים', unit: 'כיכר', keywords: ['לחם', 'bread'],
    prices: { shufersal: 8.30, ramilevy: 7.90, victory: 8.10, yochananof: 8.00, osherad: 7.70, tivtaam: 8.50 } },
  { id: 'pita', nameHe: 'פיתות אריזת 10', name: 'Pita (10)', category: 'מאפים', unit: 'אריזה', keywords: ['פיתה', 'פיתות', 'pita'],
    prices: { shufersal: 9.90, ramilevy: 8.90, victory: 9.50, yochananof: 9.20, osherad: 8.50, tivtaam: 10.20 } },
  { id: 'challah', nameHe: 'חלה מתוקה 500 גרם', name: 'Challah', category: 'מאפים', unit: 'כיכר', keywords: ['חלה', 'challah'],
    prices: { shufersal: 12.90, ramilevy: 11.90, victory: 12.50, yochananof: null, osherad: 11.50, tivtaam: 13.90 } },

  // ---- Produce (פירות וירקות) ----
  { id: 'tomato', nameHe: 'עגבניות ק״ג', name: 'Tomatoes (kg)', category: 'פירות וירקות', unit: 'ק״ג', keywords: ['עגבניה', 'עגבניות', 'tomato'],
    prices: { shufersal: 6.90, ramilevy: 5.90, victory: 6.50, yochananof: 6.20, osherad: 5.50, tivtaam: 7.90 } },
  { id: 'cucumber', nameHe: 'מלפפונים ק״ג', name: 'Cucumbers (kg)', category: 'פירות וירקות', unit: 'ק״ג', keywords: ['מלפפון', 'מלפפונים', 'cucumber'],
    prices: { shufersal: 5.90, ramilevy: 4.90, victory: 5.50, yochananof: 5.20, osherad: 4.50, tivtaam: 6.90 } },
  { id: 'onion', nameHe: 'בצל יבש ק״ג', name: 'Onions (kg)', category: 'פירות וירקות', unit: 'ק״ג', keywords: ['בצל', 'onion'],
    prices: { shufersal: 4.90, ramilevy: 3.90, victory: 4.50, yochananof: 4.20, osherad: 3.50, tivtaam: 5.50 } },
  { id: 'potato', nameHe: 'תפוחי אדמה ק״ג', name: 'Potatoes (kg)', category: 'פירות וירקות', unit: 'ק״ג', keywords: ['תפוח אדמה', 'תפוחי אדמה', 'תפוד', 'potato'],
    prices: { shufersal: 5.50, ramilevy: 4.50, victory: 5.10, yochananof: 4.80, osherad: 4.20, tivtaam: 5.90 } },
  { id: 'banana', nameHe: 'בננות ק״ג', name: 'Bananas (kg)', category: 'פירות וירקות', unit: 'ק״ג', keywords: ['בננה', 'בננות', 'banana'],
    prices: { shufersal: 8.90, ramilevy: 7.90, victory: 8.50, yochananof: 8.20, osherad: 7.50, tivtaam: 9.90 } },
  { id: 'apple', nameHe: 'תפוחים ק״ג', name: 'Apples (kg)', category: 'פירות וירקות', unit: 'ק״ג', keywords: ['תפוח', 'תפוחים', 'apple'],
    prices: { shufersal: 9.90, ramilevy: 8.90, victory: 9.50, yochananof: 9.20, osherad: 8.50, tivtaam: 10.90 } },
  { id: 'lemon', nameHe: 'לימונים ק״ג', name: 'Lemons (kg)', category: 'פירות וירקות', unit: 'ק״ג', keywords: ['לימון', 'לימונים', 'lemon'],
    prices: { shufersal: 7.90, ramilevy: 6.90, victory: null, yochananof: 7.20, osherad: 6.50, tivtaam: 8.50 } },

  // ---- Meat, fish & deli (בשר ודגים) ----
  { id: 'chicken-breast', nameHe: 'חזה עוף טרי ק״ג', name: 'Chicken breast (kg)', category: 'בשר ודגים', unit: 'ק״ג', keywords: ['חזה עוף', 'עוף', 'chicken'],
    prices: { shufersal: 39.90, ramilevy: 34.90, victory: 37.90, yochananof: 36.90, osherad: 33.90, tivtaam: 42.90 } },
  { id: 'ground-beef', nameHe: 'בשר טחון בקר ק״ג', name: 'Ground beef (kg)', category: 'בשר ודגים', unit: 'ק״ג', keywords: ['בשר טחון', 'טחון', 'beef'],
    prices: { shufersal: 54.90, ramilevy: 49.90, victory: 52.90, yochananof: 51.90, osherad: 47.90, tivtaam: 59.90 } },
  { id: 'salmon', nameHe: 'פילה סלמון טרי ק״ג', name: 'Salmon fillet (kg)', category: 'בשר ודגים', unit: 'ק״ג', keywords: ['סלמון', 'דג', 'salmon'],
    prices: { shufersal: 89.90, ramilevy: 79.90, victory: 84.90, yochananof: null, osherad: 74.90, tivtaam: 94.90 } },

  // ---- Pantry & dry goods (מזון יבש) ----
  { id: 'rice', nameHe: 'אורז לבן 1 ק״ג', name: 'White rice 1kg', category: 'מזון יבש', unit: 'חבילה', keywords: ['אורז', 'rice'],
    prices: { shufersal: 9.90, ramilevy: 8.50, victory: 9.20, yochananof: 8.90, osherad: 7.90, tivtaam: 10.50 } },
  { id: 'pasta', nameHe: 'פסטה ספגטי 500 גרם', name: 'Spaghetti 500g', category: 'מזון יבש', unit: 'חבילה', keywords: ['פסטה', 'ספגטי', 'pasta', 'spaghetti'],
    prices: { shufersal: 5.90, ramilevy: 4.90, victory: 5.50, yochananof: 5.20, osherad: 4.50, tivtaam: 6.20 } },
  { id: 'flour', nameHe: 'קמח לבן 1 ק״ג', name: 'White flour 1kg', category: 'מזון יבש', unit: 'חבילה', keywords: ['קמח', 'flour'],
    prices: { shufersal: 4.90, ramilevy: 3.90, victory: 4.50, yochananof: 4.20, osherad: 3.50, tivtaam: 5.20 } },
  { id: 'sugar', nameHe: 'סוכר לבן 1 ק״ג', name: 'White sugar 1kg', category: 'מזון יבש', unit: 'חבילה', keywords: ['סוכר', 'sugar'],
    prices: { shufersal: 5.50, ramilevy: 4.50, victory: 5.10, yochananof: 4.90, osherad: 4.20, tivtaam: 5.90 } },
  { id: 'oil', nameHe: 'שמן קנולה 1 ליטר', name: 'Canola oil 1L', category: 'מזון יבש', unit: 'בקבוק', keywords: ['שמן', 'קנולה', 'oil'],
    prices: { shufersal: 11.90, ramilevy: 9.90, victory: 10.90, yochananof: 10.50, osherad: 8.90, tivtaam: 12.90 } },
  { id: 'olive-oil', nameHe: 'שמן זית כתית 750 מ״ל', name: 'Olive oil 750ml', category: 'מזון יבש', unit: 'בקבוק', keywords: ['שמן זית', 'זית', 'olive'],
    prices: { shufersal: 34.90, ramilevy: 29.90, victory: 32.90, yochananof: 31.90, osherad: 27.90, tivtaam: 37.90 } },
  { id: 'tuna', nameHe: 'טונה בשמן 5 יחידות', name: 'Canned tuna (5)', category: 'מזון יבש', unit: 'מארז', keywords: ['טונה', 'tuna'],
    prices: { shufersal: 24.90, ramilevy: 21.90, victory: 23.50, yochananof: 22.90, osherad: 19.90, tivtaam: 26.90 } },
  { id: 'chickpeas', nameHe: 'חומוס יבש 500 גרם', name: 'Dry chickpeas', category: 'מזון יבש', unit: 'חבילה', keywords: ['חומוס', 'גרגירי חומוס', 'chickpeas'],
    prices: { shufersal: 6.90, ramilevy: 5.90, victory: 6.50, yochananof: 6.20, osherad: 5.50, tivtaam: 7.20 } },
  { id: 'salt', nameHe: 'מלח שולחן 1 ק״ג', name: 'Table salt 1kg', category: 'מזון יבש', unit: 'חבילה', keywords: ['מלח', 'salt'],
    prices: { shufersal: 3.90, ramilevy: 2.90, victory: 3.50, yochananof: 3.20, osherad: 2.50, tivtaam: 4.20 } },
  { id: 'coffee', nameHe: 'קפה נמס עלית 200 גרם', name: 'Instant coffee 200g', category: 'מזון יבש', unit: 'צנצנת', keywords: ['קפה', 'עלית', 'coffee'],
    prices: { shufersal: 29.90, ramilevy: 25.90, victory: 27.90, yochananof: 26.90, osherad: 23.90, tivtaam: 31.90 } },

  // ---- Beverages (משקאות) ----
  { id: 'water-6', nameHe: 'מים מינרלים 6x1.5 ליטר', name: 'Mineral water 6-pack', category: 'משקאות', unit: 'מארז', keywords: ['מים', 'water'],
    prices: { shufersal: 15.90, ramilevy: 12.90, victory: 14.50, yochananof: 13.90, osherad: 11.90, tivtaam: 16.90 } },
  { id: 'cola', nameHe: 'קוקה קולה 1.5 ליטר', name: 'Coca-Cola 1.5L', category: 'משקאות', unit: 'בקבוק', keywords: ['קולה', 'קוקה', 'cola', 'coca'],
    prices: { shufersal: 8.50, ramilevy: 7.50, victory: 8.10, yochananof: 7.90, osherad: 6.90, tivtaam: 8.90 } },
  { id: 'orange-juice', nameHe: 'מיץ תפוזים טרי 1 ליטר', name: 'Orange juice 1L', category: 'משקאות', unit: 'קרטון', keywords: ['מיץ', 'תפוזים', 'juice'],
    prices: { shufersal: 12.90, ramilevy: 10.90, victory: 11.90, yochananof: 11.50, osherad: 9.90, tivtaam: 13.90 } },

  // ---- Snacks & sweets (חטיפים) ----
  { id: 'bamba', nameHe: 'במבה אסם 80 גרם', name: 'Bamba 80g', category: 'חטיפים', unit: 'שקית', keywords: ['במבה', 'bamba'],
    prices: { shufersal: 4.90, ramilevy: 4.20, victory: 4.60, yochananof: 4.40, osherad: 3.90, tivtaam: 5.20 } },
  { id: 'chocolate', nameHe: 'שוקולד פרה 100 גרם', name: 'Milk chocolate 100g', category: 'חטיפים', unit: 'חבילה', keywords: ['שוקולד', 'פרה', 'chocolate'],
    prices: { shufersal: 5.90, ramilevy: 4.90, victory: 5.50, yochananof: 5.20, osherad: 4.50, tivtaam: 6.20 } },
  { id: 'cornflakes', nameHe: 'קורנפלקס תלמה 500 גרם', name: 'Cornflakes 500g', category: 'חטיפים', unit: 'חבילה', keywords: ['קורנפלקס', 'דגני בוקר', 'cornflakes'],
    prices: { shufersal: 16.90, ramilevy: 13.90, victory: 15.50, yochananof: 14.90, osherad: 12.90, tivtaam: 17.90 } },

  // ---- Household & cleaning (ניקיון) ----
  { id: 'toilet-paper', nameHe: 'נייר טואלט 48 גלילים', name: 'Toilet paper (48)', category: 'ניקיון', unit: 'מארז', keywords: ['נייר טואלט', 'טואלט', 'toilet'],
    prices: { shufersal: 44.90, ramilevy: 36.90, victory: 41.90, yochananof: 39.90, osherad: 34.90, tivtaam: 47.90 } },
  { id: 'dish-soap', nameHe: 'סבון כלים פיירי 750 מ״ל', name: 'Dish soap 750ml', category: 'ניקיון', unit: 'בקבוק', keywords: ['סבון כלים', 'פיירי', 'dish'],
    prices: { shufersal: 12.90, ramilevy: 10.90, victory: 11.90, yochananof: 11.50, osherad: 9.90, tivtaam: 13.90 } },
  { id: 'laundry', nameHe: 'אבקת כביסה אריאל 4 ק״ג', name: 'Laundry powder 4kg', category: 'ניקיון', unit: 'חבילה', keywords: ['אבקת כביסה', 'כביסה', 'אריאל', 'laundry'],
    prices: { shufersal: 49.90, ramilevy: 42.90, victory: 46.90, yochananof: 44.90, osherad: 39.90, tivtaam: 52.90 } },
  { id: 'trash-bags', nameHe: 'שקיות אשפה 50 יחידות', name: 'Trash bags (50)', category: 'ניקיון', unit: 'גליל', keywords: ['שקיות אשפה', 'אשפה', 'trash'],
    prices: { shufersal: 14.90, ramilevy: 11.90, victory: 13.50, yochananof: 12.90, osherad: 10.90, tivtaam: 15.90 } },

  // ---- Baby & personal (טיפוח ותינוקות) ----
  { id: 'diapers', nameHe: 'חיתולים האגיס מידה 4', name: 'Diapers size 4', category: 'טיפוח ותינוקות', unit: 'חבילה', keywords: ['חיתולים', 'האגיס', 'diapers'],
    prices: { shufersal: 59.90, ramilevy: 49.90, victory: 54.90, yochananof: 52.90, osherad: 46.90, tivtaam: 62.90 } },
  { id: 'shampoo', nameHe: 'שמפו הד אנד שולדרס 700 מ״ל', name: 'Shampoo 700ml', category: 'טיפוח ותינוקות', unit: 'בקבוק', keywords: ['שמפו', 'shampoo'],
    prices: { shufersal: 24.90, ramilevy: 19.90, victory: 22.90, yochananof: 21.90, osherad: 18.90, tivtaam: 26.90 } },
  { id: 'toothpaste', nameHe: 'משחת שיניים קולגייט 100 מ״ל', name: 'Toothpaste 100ml', category: 'טיפוח ותינוקות', unit: 'שפופרת', keywords: ['משחת שיניים', 'קולגייט', 'toothpaste'],
    prices: { shufersal: 12.90, ramilevy: 9.90, victory: 11.50, yochananof: 10.90, osherad: 8.90, tivtaam: 13.90 } },
];

export const productById = Object.fromEntries(products.map((p) => [p.id, p]));
