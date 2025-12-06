import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Génère un slug à partir d'un texte
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Hash un mot de passe
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Seed des administrateurs
 */
async function seedAdmins() {
  console.log('🌱 Seeding admins...');

  const admins = [
    {
      email: 'admin@travelagency.sn',
      password: await hashPassword('Admin123!'),
      first_name: 'Amadou',
      last_name: 'Diallo',
      role: 'super_admin',
      is_active: true,
    },
    {
      email: 'manager@travelagency.sn',
      password: await hashPassword('Manager123!'),
      first_name: 'Fatou',
      last_name: 'Ndiaye',
      role: 'admin',
      is_active: true,
    },
    {
      email: 'assistant@travelagency.sn',
      password: await hashPassword('Assistant123!'),
      first_name: 'Ibrahima',
      last_name: 'Sarr',
      role: 'admin',
      is_active: true,
    },
  ];

  for (const admin of admins) {
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: admin,
    });
  }

  console.log(`✅ ${admins.length} admins créés`);
}

/**
 * Seed des clients
 */
async function seedClients() {
  console.log('🌱 Seeding clients...');

  const clients = [
    {
      email: 'client1@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Moussa',
      last_name: 'Ba',
      phone: '221771234567',
      is_active: true,
    },
    {
      email: 'client2@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Aissatou',
      last_name: 'Fall',
      phone: '221771234568',
      is_active: true,
    },
    {
      email: 'client3@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Ousmane',
      last_name: 'Cissé',
      phone: '221771234569',
      is_active: true,
    },
    {
      email: 'client4@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Mariama',
      last_name: 'Diop',
      phone: '221771234570',
      is_active: true,
    },
    {
      email: 'client5@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Cheikh',
      last_name: 'Thiam',
      phone: '221771234571',
      is_active: true,
    },
    {
      email: 'client6@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Aminata',
      last_name: 'Sy',
      phone: '221771234572',
      is_active: true,
    },
    {
      email: 'client7@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Mamadou',
      last_name: 'Kane',
      phone: '221771234573',
      is_active: true,
    },
    {
      email: 'client8@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Rokhaya',
      last_name: 'Gueye',
      phone: '221771234574',
      is_active: true,
    },
    {
      email: 'client9@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Abdoulaye',
      last_name: 'Ndiaye',
      phone: '221771234575',
      is_active: true,
    },
    {
      email: 'client10@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Khady',
      last_name: 'Seck',
      phone: '221771234576',
      is_active: true,
    },
    {
      email: 'client11@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Modou',
      last_name: 'Faye',
      phone: '221771234577',
      is_active: false,
    },
    {
      email: 'client12@example.com',
      password: await hashPassword('Client123!'),
      first_name: 'Awa',
      last_name: 'Mbaye',
      phone: '221771234578',
      is_active: true,
    },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { email: client.email },
      update: {},
      create: client,
    });
  }

  console.log(`✅ ${clients.length} clients créés`);
}

/**
 * Seed des catégories
 */
async function seedCategories() {
  console.log('🌱 Seeding categories...');

  const categories = [
    {
      name: 'Vols',
      slug: generateSlug('Vols'),
      description: 'Réservez vos billets d\'avion vers toutes les destinations',
      icon: '✈️',
      display_order: 1,
      is_active: true,
    },
    {
      name: 'Hôtels',
      slug: generateSlug('Hôtels'),
      description: 'Trouvez l\'hôtel parfait pour votre séjour',
      icon: '🏨',
      display_order: 2,
      is_active: true,
    },
    {
      name: 'Séjours',
      slug: generateSlug('Séjours'),
      description: 'Séjours tout compris dans les plus belles destinations',
      icon: '🏖️',
      display_order: 3,
      is_active: true,
    },
    {
      name: 'Packages',
      slug: generateSlug('Packages'),
      description: 'Forfaits complets vol + hôtel + activités',
      icon: '🎁',
      display_order: 4,
      is_active: true,
    },
    {
      name: 'Croisières',
      slug: generateSlug('Croisières'),
      description: 'Découvrez le monde en croisière',
      icon: '🚢',
      display_order: 5,
      is_active: true,
    },
    {
      name: 'Circuits',
      slug: generateSlug('Circuits'),
      description: 'Circuits organisés avec guide',
      icon: '🗺️',
      display_order: 6,
      is_active: true,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`✅ ${categories.length} catégories créées`);
}

/**
 * Seed des offres
 */
async function seedOffers() {
  console.log('🌱 Seeding offers...');

  const categories = await prisma.category.findMany();
  const categoryMap = {
    vol: categories.find((c) => c.slug === 'vols')?.name || 'Vols',
    hotel: categories.find((c) => c.slug === 'hotels')?.name || 'Hôtels',
    sejour: categories.find((c) => c.slug === 'sejours')?.name || 'Séjours',
    package: categories.find((c) => c.slug === 'packages')?.name || 'Packages',
  };

  const offers = [
    // Vols
    {
      title: 'Vol Dakar - Paris Aller-Retour',
      destination: 'Paris, France',
      category: categoryMap.vol,
      price: 450000,
      currency: 'FCFA',
      duration: 1,
      description: 'Vol direct Dakar-Paris avec Air France. Bagage en soute inclus. Dates flexibles disponibles.',
      images: [
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
        'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800',
      ],
      itinerary: [],
      included: ['Vol aller-retour', 'Bagage en soute (23kg)', 'Repas à bord', 'Assurance voyage'],
      excluded: ['Transfert aéroport', 'Hébergement'],
      is_active: true,
      is_promotion: false,
      rating: 4.5,
      reviews_count: 23,
      bookings_count: 156,
      views_count: 1245,
      available_seats: 45,
      max_capacity: 200,
      tags: ['vol', 'paris', 'europe'],
      difficulty: 'easy',
    },
    {
      title: 'Vol Dakar - New York',
      destination: 'New York, USA',
      category: categoryMap.vol,
      price: 850000,
      currency: 'FCFA',
      duration: 1,
      description: 'Vol avec escale vers New York. Découvrez la Big Apple !',
      images: [
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      ],
      itinerary: [],
      included: ['Vol aller-retour', 'Bagage en soute', 'Repas'],
      excluded: ['Transfert', 'Hébergement'],
      is_active: true,
      is_promotion: true,
      promotion_discount: 15,
      promotion_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      rating: 4.7,
      reviews_count: 18,
      bookings_count: 89,
      views_count: 987,
      available_seats: 12,
      max_capacity: 150,
      tags: ['vol', 'new-york', 'usa'],
      difficulty: 'easy',
    },
    // Hôtels
    {
      title: 'Hôtel Radisson Blu Dakar',
      destination: 'Dakar, Sénégal',
      category: categoryMap.hotel,
      price: 75000,
      currency: 'FCFA',
      duration: 1,
      description: 'Hôtel 5 étoiles en bord de mer avec vue panoramique. Piscine, spa et restaurants gastronomiques.',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      ],
      itinerary: [],
      included: ['Petit-déjeuner buffet', 'WiFi gratuit', 'Piscine', 'Spa'],
      excluded: ['Déjeuner', 'Dîner', 'Transfert'],
      is_active: true,
      is_promotion: false,
      rating: 4.8,
      reviews_count: 145,
      bookings_count: 523,
      views_count: 3456,
      available_seats: 25,
      max_capacity: 100,
      tags: ['hotel', 'dakar', 'luxe'],
      difficulty: 'easy',
    },
    {
      title: 'Hôtel Pullman Paris Tour Eiffel',
      destination: 'Paris, France',
      category: categoryMap.hotel,
      price: 120000,
      currency: 'FCFA',
      duration: 1,
      description: 'Hôtel de luxe avec vue sur la Tour Eiffel. Situé dans le 15ème arrondissement.',
      images: [
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      ],
      itinerary: [],
      included: ['Petit-déjeuner', 'WiFi', 'Salle de sport'],
      excluded: ['Repas', 'Parking'],
      is_active: true,
      is_promotion: true,
      promotion_discount: 20,
      promotion_ends_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      rating: 4.6,
      reviews_count: 89,
      bookings_count: 234,
      views_count: 1876,
      available_seats: 8,
      max_capacity: 50,
      tags: ['hotel', 'paris', 'luxe'],
      difficulty: 'easy',
    },
    // Séjours
    {
      title: 'Séjour Romantique à Zanzibar',
      destination: 'Zanzibar, Tanzanie',
      category: categoryMap.sejour,
      price: 650000,
      currency: 'FCFA',
      duration: 7,
      description: 'Séjour tout compris dans un resort de luxe en bord de mer. Plages de sable blanc, eaux turquoise.',
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      ],
      itinerary: [
        { day: 1, title: 'Arrivée et installation', description: 'Transfert aéroport, check-in, dîner de bienvenue' },
        { day: 2, title: 'Journée plage', description: 'Détente sur la plage, activités nautiques' },
        { day: 3, title: 'Excursion Stone Town', description: 'Visite de la vieille ville de Zanzibar' },
        { day: 4, title: 'Snorkeling', description: 'Découverte des fonds marins' },
        { day: 5, title: 'Journée libre', description: 'Activités au choix' },
        { day: 6, title: 'Safari bleu', description: 'Excursion en bateau, observation des dauphins' },
        { day: 7, title: 'Départ', description: 'Petit-déjeuner, transfert aéroport' },
      ],
      included: ['Vol aller-retour', 'Hébergement 7 nuits', 'Petit-déjeuner', 'Dîner', 'Transferts'],
      excluded: ['Déjeuner', 'Boissons', 'Activités optionnelles'],
      is_active: true,
      is_promotion: false,
      rating: 4.9,
      reviews_count: 67,
      bookings_count: 189,
      views_count: 2341,
      available_seats: 15,
      max_capacity: 30,
      tags: ['sejour', 'zanzibar', 'romantique', 'plage'],
      difficulty: 'easy',
      departure_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      return_date: new Date(Date.now() + 67 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Séjour Découverte Marrakech',
      destination: 'Marrakech, Maroc',
      category: categoryMap.sejour,
      price: 420000,
      currency: 'FCFA',
      duration: 5,
      description: 'Immersion dans la culture marocaine. Médina, souks, palais et jardins.',
      images: [
        'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
        'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800',
      ],
      itinerary: [
        { day: 1, title: 'Arrivée', description: 'Transfert, installation, dîner' },
        { day: 2, title: 'Visite de la Médina', description: 'Place Jemaa el-Fnaa, souks' },
        { day: 3, title: 'Palais et jardins', description: 'Palais Bahia, Jardin Majorelle' },
        { day: 4, title: 'Excursion Atlas', description: 'Journée dans les montagnes de l\'Atlas' },
        { day: 5, title: 'Départ', description: 'Temps libre, transfert aéroport' },
      ],
      included: ['Vol aller-retour', 'Hébergement 4 nuits', 'Petit-déjeuner', 'Guide local'],
      excluded: ['Repas', 'Entrées monuments'],
      is_active: true,
      is_promotion: true,
      promotion_discount: 10,
      promotion_ends_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      rating: 4.4,
      reviews_count: 45,
      bookings_count: 123,
      views_count: 1567,
      available_seats: 20,
      max_capacity: 40,
      tags: ['sejour', 'marrakech', 'culture', 'decouverte'],
      difficulty: 'moderate',
      departure_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      return_date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Séjour Aventure Cap-Vert',
      destination: 'Sal, Cap-Vert',
      category: categoryMap.sejour,
      price: 580000,
      currency: 'FCFA',
      duration: 6,
      description: 'Découverte des îles du Cap-Vert. Kitesurf, randonnées, culture créole.',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      ],
      itinerary: [
        { day: 1, title: 'Arrivée à Sal', description: 'Transfert, installation' },
        { day: 2, title: 'Kitesurf', description: 'Cours de kitesurf pour débutants' },
        { day: 3, title: 'Excursion Santiago', description: 'Visite de l\'île de Santiago' },
        { day: 4, title: 'Randonnée', description: 'Découverte des paysages volcaniques' },
        { day: 5, title: 'Plage et détente', description: 'Journée libre' },
        { day: 6, title: 'Départ', description: 'Transfert aéroport' },
      ],
      included: ['Vol aller-retour', 'Hébergement 5 nuits', 'Petit-déjeuner', 'Activités'],
      excluded: ['Repas', 'Équipement kitesurf'],
      is_active: true,
      is_promotion: false,
      rating: 4.6,
      reviews_count: 34,
      bookings_count: 78,
      views_count: 987,
      available_seats: 10,
      max_capacity: 25,
      tags: ['sejour', 'cap-vert', 'aventure', 'kitesurf'],
      difficulty: 'moderate',
      departure_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      return_date: new Date(Date.now() + 96 * 24 * 60 * 60 * 1000),
    },
    // Packages
    {
      title: 'Package Complet Dubaï',
      destination: 'Dubaï, Émirats Arabes Unis',
      category: categoryMap.package,
      price: 1200000,
      currency: 'FCFA',
      duration: 5,
      description: 'Forfait complet : vol, hôtel 4*, excursions, transferts. Découvrez Dubaï dans toute sa splendeur.',
      images: [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800',
      ],
      itinerary: [
        { day: 1, title: 'Arrivée', description: 'Transfert, check-in, dîner croisière' },
        { day: 2, title: 'Burj Khalifa', description: 'Visite de la tour la plus haute du monde' },
        { day: 3, title: 'Desert Safari', description: 'Safari dans le désert, dîner bédouin' },
        { day: 4, title: 'Dubai Mall', description: 'Shopping et aquarium' },
        { day: 5, title: 'Départ', description: 'Temps libre, transfert' },
      ],
      included: ['Vol aller-retour', 'Hébergement 4 nuits', 'Petit-déjeuner', 'Excursions', 'Transferts'],
      excluded: ['Déjeuner', 'Dîner (sauf croisière)', 'Shopping'],
      is_active: true,
      is_promotion: false,
      rating: 4.7,
      reviews_count: 56,
      bookings_count: 145,
      views_count: 2134,
      available_seats: 8,
      max_capacity: 20,
      tags: ['package', 'dubai', 'luxe', 'shopping'],
      difficulty: 'easy',
      departure_date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      return_date: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Package Découverte Istanbul',
      destination: 'Istanbul, Turquie',
      category: categoryMap.package,
      price: 750000,
      currency: 'FCFA',
      duration: 6,
      description: 'Voyage culturel à Istanbul. Mosquées, palais, bazar et croisière sur le Bosphore.',
      images: [
        'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
      ],
      itinerary: [
        { day: 1, title: 'Arrivée', description: 'Transfert, installation' },
        { day: 2, title: 'Sultanahmet', description: 'Sainte-Sophie, Mosquée Bleue' },
        { day: 3, title: 'Palais Topkapi', description: 'Visite du palais et musées' },
        { day: 4, title: 'Grand Bazar', description: 'Shopping et découverte' },
        { day: 5, title: 'Croisière Bosphore', description: 'Découverte des deux continents' },
        { day: 6, title: 'Départ', description: 'Transfert aéroport' },
      ],
      included: ['Vol aller-retour', 'Hébergement 5 nuits', 'Petit-déjeuner', 'Guide', 'Transferts'],
      excluded: ['Repas', 'Entrées monuments'],
      is_active: true,
      is_promotion: true,
      promotion_discount: 12,
      promotion_ends_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      rating: 4.5,
      reviews_count: 38,
      bookings_count: 98,
      views_count: 1234,
      available_seats: 12,
      max_capacity: 30,
      tags: ['package', 'istanbul', 'culture', 'histoire'],
      difficulty: 'moderate',
      departure_date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      return_date: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Package Safari Kenya',
      destination: 'Nairobi, Kenya',
      category: categoryMap.package,
      price: 950000,
      currency: 'FCFA',
      duration: 8,
      description: 'Safari authentique dans les parcs nationaux du Kenya. Observation des Big Five.',
      images: [
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
        'https://images.unsplash.com/photo-1541781289445-9b5c0b0e2539?w=800',
      ],
      itinerary: [
        { day: 1, title: 'Arrivée Nairobi', description: 'Transfert, nuit à Nairobi' },
        { day: 2, title: 'Parc Amboseli', description: 'Safari, observation des éléphants' },
        { day: 3, title: 'Parc Tsavo', description: 'Safari journée complète' },
        { day: 4, title: 'Route vers Maasai Mara', description: 'Transfert, installation' },
        { day: 5, title: 'Maasai Mara', description: 'Safari matin et soir' },
        { day: 6, title: 'Maasai Mara', description: 'Safari journée complète' },
        { day: 7, title: 'Retour Nairobi', description: 'Transfert, dernière nuit' },
        { day: 8, title: 'Départ', description: 'Transfert aéroport' },
      ],
      included: ['Vol aller-retour', 'Hébergement 7 nuits', 'Tous les repas', 'Safaris', 'Guide', 'Transferts'],
      excluded: ['Boissons', 'Pourboires'],
      is_active: true,
      is_promotion: false,
      rating: 4.9,
      reviews_count: 42,
      bookings_count: 67,
      views_count: 1456,
      available_seats: 6,
      max_capacity: 12,
      tags: ['package', 'kenya', 'safari', 'aventure'],
      difficulty: 'moderate',
      departure_date: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
      return_date: new Date(Date.now() + 108 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const offer of offers) {
    const slug = generateSlug(offer.title);
    await prisma.offer.upsert({
      where: { slug },
      update: {},
      create: {
        ...offer,
        slug,
        itinerary: offer.itinerary as any,
      },
    });
  }

  console.log(`✅ ${offers.length} offres créées`);
}

/**
 * Seed des logs WhatsApp
 */
async function seedWhatsAppLogs() {
  console.log('🌱 Seeding WhatsApp logs...');

  const offers = await prisma.offer.findMany({ take: 5 });
  const clients = await prisma.client.findMany({ take: 5 });

  if (offers.length === 0 || clients.length === 0) {
    console.log('⚠️  Pas d\'offres ou de clients, skip des logs WhatsApp');
    return;
  }

  const logs = [
    {
      offer_id: offers[0].id,
      customer_phone: '221771234567',
      customer_name: 'Moussa Ba',
      message: 'Bonjour, je suis intéressé par cette offre. Pouvez-vous me donner plus de détails ?',
      type: 'offer_inquiry',
      status: 'sent',
      sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      offer_id: offers[1].id,
      customer_phone: '221771234568',
      customer_name: 'Aissatou Fall',
      message: 'Quel est le prix pour 2 personnes ?',
      type: 'offer_inquiry',
      status: 'sent',
      sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      offer_id: offers[2].id,
      customer_phone: '221771234569',
      customer_name: 'Ousmane Cissé',
      message: 'Y a-t-il encore des places disponibles ?',
      type: 'offer_inquiry',
      status: 'pending',
      sent_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
      offer_id: offers[3].id,
      customer_phone: '221771234570',
      customer_name: 'Mariama Diop',
      message: 'Je voudrais réserver pour le mois prochain',
      type: 'offer_inquiry',
      status: 'sent',
      sent_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      offer_id: null,
      customer_phone: '221771234571',
      customer_name: 'Cheikh Thiam',
      message: 'Bonjour, avez-vous des offres pour le Cap-Vert ?',
      type: 'general_inquiry',
      status: 'sent',
      sent_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const log of logs) {
    await prisma.whatsAppLog.create({
      data: log,
    });
  }

  console.log(`✅ ${logs.length} logs WhatsApp créés`);
}

/**
 * Fonction principale de seed
 */
async function main() {
  console.log('🚀 Démarrage du seeding...\n');

  try {
    await seedAdmins();
    await seedClients();
    await seedCategories();
    await seedOffers();
    await seedWhatsAppLogs();

    console.log('\n✅ Seeding terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

