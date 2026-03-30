-- Enable pg_trgm for ILIKE / trigram name search on events
create extension if not exists pg_trgm;
