-- Table Offres
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  destination VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('vol', 'hotel', 'sejour', 'package')),
  price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
  currency VARCHAR(10) DEFAULT 'FCFA',
  duration INTEGER NOT NULL CHECK (duration > 0),
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  included TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_promotion BOOLEAN DEFAULT false,
  promotion_discount INTEGER CHECK (promotion_discount BETWEEN 0 AND 100),
  promotion_ends_at TIMESTAMP WITH TIME ZONE,
  rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  reviews_count INTEGER DEFAULT 0,
  bookings_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  available_seats INTEGER DEFAULT 0,
  max_capacity INTEGER,
  departure_date TIMESTAMP WITH TIME ZONE,
  return_date TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche et filtres
CREATE INDEX idx_offers_category ON offers(category);
CREATE INDEX idx_offers_destination ON offers(destination);
CREATE INDEX idx_offers_price ON offers(price);
CREATE INDEX idx_offers_is_active ON offers(is_active);
CREATE INDEX idx_offers_is_promotion ON offers(is_promotion);
CREATE INDEX idx_offers_slug ON offers(slug);
CREATE INDEX idx_offers_created_at ON offers(created_at DESC);

-- Index pour recherche full-text
CREATE INDEX idx_offers_search ON offers USING gin(to_tsvector('french', title || ' ' || description || ' ' || destination));

-- Trigger updated_at
CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON offers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

