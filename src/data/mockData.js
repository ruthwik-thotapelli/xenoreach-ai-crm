// Mock data generators for XenoReach AI CRM
import { format, subDays, subMonths, addDays } from 'date-fns';

// ── Helpers ──────────────────────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const uuid = () => Math.random().toString(36).substr(2, 9);

const firstNames = [
  'Aarav','Aditi','Akash','Ananya','Arjun','Avni','Deepika','Dev','Dhruv',
  'Diya','Gaurav','Ishaan','Ishita','Kabir','Kavya','Kiara','Kritika','Laksh',
  'Manav','Meera','Mihir','Natasha','Neel','Neha','Nisha','Om','Pari','Priya',
  'Rahul','Riya','Rohit','Rohan','Sakshi','Samar','Sara','Sanya','Shaan',
  'Shreya','Siddharth','Simran','Sneha','Tanvi','Tara','Uday','Vansh','Vanya',
  'Varun','Vikram','Vivaan','Zara',
];
const lastNames = [
  'Sharma','Gupta','Singh','Kumar','Patel','Mehta','Kapoor','Joshi','Verma',
  'Agarwal','Bose','Chatterjee','Das','Dubey','Iyer','Khan','Malhotra','Nair',
  'Pandey','Rao','Reddy','Saxena','Shah','Srivastava','Tiwari',
];
const cities = [
  'Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad',
  'Jaipur','Surat','Lucknow','Kochi','Chandigarh','Indore','Nagpur','Coimbatore',
  'Bhopal','Vadodara','Gurgaon','Noida',
];
const brands = ['Zara','H&M','Levi\'s','Nike','Puma','Adidas','Mango','Forever 21','Westside','FabIndia'];
const categories = ['Clothing','Footwear','Accessories','Beauty','Electronics','Home Decor','Sportswear','Ethnic Wear'];
const channels = ['WhatsApp','SMS','Email','RCS'];
const statuses = ['active','inactive','at_risk','champion','new'];
const genders = ['Male','Female','Non-binary'];

// ── Customers ─────────────────────────────────────────────────────────────────
const generateCustomer = (id) => {
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  const gender = pick(genders);
  const city = pick(cities);
  const createdAt = subDays(new Date(), rand(30, 730));
  const lastPurchase = subDays(new Date(), rand(1, 180));
  const orderCount = rand(1, 40);
  const totalSpend = rand(500, 150000);
  const avgOrderValue = Math.round(totalSpend / orderCount);

  return {
    id: `cust_${id}`,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rand(1,99)}@gmail.com`,
    phone: `+91${rand(7000000000, 9999999999)}`,
    gender,
    age: rand(18, 55),
    city,
    state: pick(['Maharashtra','Delhi','Karnataka','Tamil Nadu','Gujarat','Rajasthan','UP','West Bengal','Kerala','Punjab']),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${id}`,
    status: pick(statuses),
    totalSpend,
    orderCount,
    avgOrderValue,
    lastPurchaseDate: format(lastPurchase, 'yyyy-MM-dd'),
    createdAt: format(createdAt, 'yyyy-MM-dd'),
    preferredChannel: pick(channels),
    tags: [pick(['VIP','Loyal','New','At Risk','Champion']), pick(['Fashion','Sports','Beauty','Tech'])].slice(0, rand(1, 2)),
    loyaltyPoints: rand(0, 5000),
    rfmScore: rand(1, 5),
  };
};

export const customers = Array.from({ length: 500 }, (_, i) => generateCustomer(i + 1));

// ── Orders ────────────────────────────────────────────────────────────────────
const generateOrder = (id, customerId) => {
  const orderDate = subDays(new Date(), rand(1, 365));
  const items = rand(1, 5);
  const totalAmount = rand(299, 25000);
  const deliveryStatuses = ['delivered','processing','shipped','returned','cancelled'];

  return {
    id: `ord_${id}`,
    customerId,
    orderNumber: `XR${String(id).padStart(6, '0')}`,
    date: format(orderDate, 'yyyy-MM-dd'),
    items,
    totalAmount,
    status: pick(deliveryStatuses),
    category: pick(categories),
    brand: pick(brands),
    channel: pick(['website','app','store','whatsapp']),
    paymentMethod: pick(['UPI','Credit Card','Debit Card','Net Banking','Cash']),
  };
};

let orderIdx = 1;
export const orders = customers.flatMap((c) => {
  const count = Math.min(c.orderCount, rand(1, 8)); // Cap for performance
  return Array.from({ length: count }, () => generateOrder(orderIdx++, c.id));
}).slice(0, 1000);

// ── Segments ──────────────────────────────────────────────────────────────────
export const segments = [
  {
    id: 'seg_1',
    name: 'High Value Champions',
    description: 'Customers with spend > ₹50,000 in last 90 days',
    count: 47,
    conditions: [
      { field: 'totalSpend', operator: 'greater_than', value: 50000 },
      { field: 'lastPurchaseDate', operator: 'within_days', value: 90 },
    ],
    createdAt: '2026-05-01',
    color: 'emerald',
  },
  {
    id: 'seg_2',
    name: 'At-Risk Customers',
    description: 'Haven\'t purchased in 60+ days',
    count: 132,
    conditions: [
      { field: 'lastPurchaseDate', operator: 'older_than_days', value: 60 },
      { field: 'orderCount', operator: 'greater_than', value: 2 },
    ],
    createdAt: '2026-05-10',
    color: 'rose',
  },
  {
    id: 'seg_3',
    name: 'Mumbai VIP Shoppers',
    description: 'Mumbai customers with 5+ orders',
    count: 63,
    conditions: [
      { field: 'city', operator: 'equals', value: 'Mumbai' },
      { field: 'orderCount', operator: 'greater_than', value: 5 },
    ],
    createdAt: '2026-05-15',
    color: 'violet',
  },
  {
    id: 'seg_4',
    name: 'New Customers (30 days)',
    description: 'Joined in the last 30 days',
    count: 88,
    conditions: [
      { field: 'createdAt', operator: 'within_days', value: 30 },
    ],
    createdAt: '2026-05-20',
    color: 'brand',
  },
  {
    id: 'seg_5',
    name: 'Win-Back Targets',
    description: 'High spenders inactive for 45+ days',
    count: 29,
    conditions: [
      { field: 'totalSpend', operator: 'greater_than', value: 20000 },
      { field: 'lastPurchaseDate', operator: 'older_than_days', value: 45 },
    ],
    createdAt: '2026-06-01',
    color: 'amber',
  },
];

// ── Campaigns ─────────────────────────────────────────────────────────────────
const campaignNames = [
  'Monsoon Sale Blast','Summer Reactivation','VIP Early Access','New Collection Launch',
  'Win-Back Warriors','Diwali Countdown','Birthday Special','Loyalty Reward Program',
  'Flash Sale 24hrs','Weekend Warriors','App Download Push','Referral Bonanza',
  'Cart Abandonment Recovery','Post-Purchase Upsell','Anniversary Celebration',
  'New Customer Welcome','High Value Retention','Seasonal Clearance',
  'Festive Collection Drop','End of Season Sale',
];

const generateCampaign = (id) => {
  const sent = rand(100, 5000);
  const delivered = Math.round(sent * (rand(85, 98) / 100));
  const opened = Math.round(delivered * (rand(20, 65) / 100));
  const clicked = Math.round(opened * (rand(10, 40) / 100));
  const converted = Math.round(clicked * (rand(5, 25) / 100));
  const failed = sent - delivered;
  const createdDate = subDays(new Date(), rand(5, 120));
  const campaignStatuses = ['active','completed','draft','scheduled','paused'];

  return {
    id: `camp_${id}`,
    name: campaignNames[id - 1] || `Campaign ${id}`,
    status: pick(campaignStatuses),
    channel: pick(channels),
    segment: pick(segments),
    segmentName: pick(segments).name,
    createdAt: format(createdDate, 'yyyy-MM-dd'),
    scheduledAt: format(addDays(createdDate, rand(1, 7)), 'yyyy-MM-dd HH:mm'),
    message: pick([
      'Hi {{name}}! 🎉 Your exclusive offer is waiting. Shop now and get 20% off on all orders. Use code XENO20.',
      'Hey {{name}}, we miss you! Come back and enjoy ₹500 off your next purchase. Limited time only!',
      'Exciting news {{name}}! Our new collection is live. Be among the first to explore. Shop now →',
      '{{name}}, you\'re one of our VIPs! Enjoy early access to our Monsoon Sale - 30% off everything.',
      'Hi {{name}}! Happy Birthday month! 🎂 Here\'s a special 25% gift just for you.',
    ]),
    stats: { sent, delivered, opened, clicked, converted, failed },
    conversionRate: ((converted / sent) * 100).toFixed(1),
    openRate: ((opened / delivered) * 100).toFixed(1),
    clickRate: ((clicked / opened) * 100).toFixed(1),
    revenue: converted * rand(500, 5000),
    aiGenerated: Math.random() > 0.5,
  };
};

export const campaigns = Array.from({ length: 20 }, (_, i) => generateCampaign(i + 1));

// ── Communication Timeline ────────────────────────────────────────────────────
const timelineEventTypes = ['sent','delivered','opened','read','clicked','converted','failed'];

export const generateTimeline = (campaignId, count = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `event_${uuid()}`,
    campaignId,
    customerId: pick(customers).id,
    customerName: pick(customers).name,
    eventType: pick(timelineEventTypes),
    channel: pick(channels),
    timestamp: format(subDays(new Date(), rand(0, 7)), 'yyyy-MM-dd HH:mm:ss'),
    metadata: {
      deviceType: pick(['mobile','desktop','tablet']),
      location: pick(cities),
    },
  }));
};

// ── Dashboard KPIs ────────────────────────────────────────────────────────────
export const dashboardKPIs = {
  totalCustomers: customers.length,
  totalOrders: orders.length,
  activeCampaigns: campaigns.filter(c => c.status === 'active').length,
  totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
  avgConversionRate: (campaigns.reduce((sum, c) => sum + parseFloat(c.conversionRate), 0) / campaigns.length).toFixed(1),
  revenueGrowth: '+18.4%',
  customerGrowth: '+12.7%',
  campaignGrowth: '+5',
};

// ── Chart Data ────────────────────────────────────────────────────────────────
export const monthlyRevenueData = [
  { month: 'Jan', revenue: 285000, campaigns: 3, customers: 420 },
  { month: 'Feb', revenue: 310000, campaigns: 2, customers: 435 },
  { month: 'Mar', revenue: 298000, campaigns: 4, customers: 448 },
  { month: 'Apr', revenue: 425000, campaigns: 5, customers: 461 },
  { month: 'May', revenue: 380000, campaigns: 3, customers: 475 },
  { month: 'Jun', revenue: 520000, campaigns: 6, customers: 500 },
];

export const channelPerformanceData = [
  { channel: 'WhatsApp', sent: 12500, delivered: 11800, opened: 6900, clicked: 2100 },
  { channel: 'Email', sent: 8200, delivered: 7100, opened: 2800, clicked: 640 },
  { channel: 'SMS', sent: 5600, delivered: 5300, opened: 1900, clicked: 420 },
  { channel: 'RCS', sent: 3200, delivered: 3050, opened: 1850, clicked: 680 },
];

export const conversionFunnelData = [
  { stage: 'Targeted', value: 10000, color: '#6366f1' },
  { stage: 'Sent', value: 8500, color: '#8b5cf6' },
  { stage: 'Delivered', value: 7800, color: '#06b6d4' },
  { stage: 'Opened', value: 4200, color: '#10b981' },
  { stage: 'Clicked', value: 1800, color: '#f59e0b' },
  { stage: 'Converted', value: 380, color: '#f43f5e' },
];

export const audienceGrowthData = Array.from({ length: 30 }, (_, i) => ({
  day: format(subDays(new Date(), 29 - i), 'MMM dd'),
  customers: 420 + Math.floor(i * 2.7) + rand(-5, 10),
  segments: 3 + Math.floor(i / 10),
}));

export const recentActivities = [
  { id: 1, type: 'campaign_launched', message: 'Monsoon Sale Blast launched to 4,280 customers', time: '2 mins ago', icon: 'zap', color: 'brand' },
  { id: 2, type: 'segment_created', message: 'New segment "High Value Champions" created with AI', time: '18 mins ago', icon: 'users', color: 'violet' },
  { id: 3, type: 'conversion', message: '47 conversions from Win-Back Warriors campaign', time: '1 hr ago', icon: 'trending-up', color: 'emerald' },
  { id: 4, type: 'customer_added', message: '24 new customers imported from Shopify', time: '2 hrs ago', icon: 'user-plus', color: 'brand' },
  { id: 5, type: 'campaign_completed', message: 'Birthday Special campaign completed — 12.4% conversion', time: '3 hrs ago', icon: 'check-circle', color: 'emerald' },
  { id: 6, type: 'ai_suggestion', message: 'AI suggests reaching 132 at-risk customers this week', time: '4 hrs ago', icon: 'cpu', color: 'amber' },
];

export const aiInsights = [
  {
    id: 1,
    title: '132 customers at risk',
    description: 'Haven\'t purchased in 60+ days. Recommend a win-back campaign with a 15% discount.',
    action: 'Create Campaign',
    priority: 'high',
    icon: 'alert-triangle',
  },
  {
    id: 2,
    title: 'WhatsApp outperforms Email',
    description: 'WhatsApp campaigns show 2.4x higher open rates. Consider migrating segments.',
    action: 'View Analytics',
    priority: 'medium',
    icon: 'trending-up',
  },
  {
    id: 3,
    title: 'Best time to send: 6–9 PM',
    description: 'Your audience is most active in the evening. Schedule campaigns accordingly.',
    action: 'Schedule Now',
    priority: 'low',
    icon: 'clock',
  },
];
