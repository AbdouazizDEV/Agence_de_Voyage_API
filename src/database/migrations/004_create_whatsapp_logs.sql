-- Table Logs WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_name VARCHAR(255),
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'offer_inquiry',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_logs_offer_id ON whatsapp_logs(offer_id);
CREATE INDEX idx_whatsapp_logs_status ON whatsapp_logs(status);
CREATE INDEX idx_whatsapp_logs_sent_at ON whatsapp_logs(sent_at DESC);

