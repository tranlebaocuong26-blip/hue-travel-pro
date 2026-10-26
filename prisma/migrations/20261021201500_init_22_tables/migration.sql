-- ==============================================================================
-- HUẾ TRAVEL PRO V2.3 — MIGRATION 20261021201500_init_22_tables
-- Target: Supabase PostgreSQL DEV (Project ID: rgoqdykpqyedambkrlvr)
-- Scope: 22 Application Tables + Constraints + Deferrable Triggers in public schema
-- Safety: Strictly avoids touching 'auth' or 'storage' schemas
-- ==============================================================================

-- 1. CONTENT ITEMS (ROOT)
CREATE TABLE IF NOT EXISTS public.content_items (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    slug TEXT NOT NULL,
    publication_status TEXT NOT NULL DEFAULT 'draft',
    verification_status TEXT NOT NULL DEFAULT 'reference_only',
    area_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_content_items_kind CHECK (kind IN ('place', 'rental', 'accommodation', 'article')),
    CONSTRAINT chk_content_items_pub_status CHECK (publication_status IN ('draft', 'review', 'published', 'archived')),
    CONSTRAINT chk_content_items_ver_status CHECK (verification_status IN ('verified', 'reference_only', 'illustrative')),
    CONSTRAINT chk_content_items_slug_kebab CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT uq_content_items_kind_slug UNIQUE (kind, slug),
    CONSTRAINT uq_content_items_id_kind UNIQUE (id, kind)
);

CREATE INDEX IF NOT EXISTS idx_content_items_kind_status ON public.content_items (kind, publication_status);
CREATE INDEX IF NOT EXISTS idx_content_items_area_id ON public.content_items (area_id);

-- 2. AREAS
CREATE TABLE IF NOT EXISTS public.areas (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    vietnamese_label TEXT NOT NULL,
    parent_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_areas_parent FOREIGN KEY (parent_id) REFERENCES public.areas(id) ON DELETE RESTRICT
);

-- Add foreign key from content_items to areas
ALTER TABLE public.content_items 
    ADD CONSTRAINT fk_content_items_area 
    FOREIGN KEY (area_id) REFERENCES public.areas(id) ON DELETE RESTRICT;

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    vietnamese_label TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. TAGS
CREATE TABLE IF NOT EXISTS public.tags (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. CONTENT CATEGORIES (M:N)
CREATE TABLE IF NOT EXISTS public.content_categories (
    content_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (content_id, category_id),
    CONSTRAINT fk_content_categories_content FOREIGN KEY (content_id) REFERENCES public.content_items(id) ON DELETE RESTRICT,
    CONSTRAINT fk_content_categories_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT
);

-- 6. CONTENT TAGS (M:N)
CREATE TABLE IF NOT EXISTS public.content_tags (
    content_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (content_id, tag_id),
    CONSTRAINT fk_content_tags_content FOREIGN KEY (content_id) REFERENCES public.content_items(id) ON DELETE RESTRICT,
    CONSTRAINT fk_content_tags_tag FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE RESTRICT
);

-- 7. SUBTYPE: PLACES
CREATE TABLE IF NOT EXISTS public.places (
    content_id TEXT PRIMARY KEY,
    kind TEXT NOT NULL DEFAULT 'place',
    name TEXT NOT NULL,
    vietnamese_title TEXT,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    history_highlight TEXT,
    address TEXT NOT NULL,
    google_maps_url TEXT NOT NULL,
    opening_hours TEXT NOT NULL,
    suggested_duration TEXT,
    best_time_to_visit TEXT,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    CONSTRAINT chk_places_kind CHECK (kind = 'place'),
    CONSTRAINT chk_places_coordinates CHECK (
        (latitude IS NULL AND longitude IS NULL) OR 
        (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180 AND latitude IS NOT NULL AND longitude IS NOT NULL)
    ),
    CONSTRAINT uq_places_content_id_kind UNIQUE (content_id, kind),
    CONSTRAINT fk_places_content_composite FOREIGN KEY (content_id, kind) REFERENCES public.content_items(id, kind) ON DELETE RESTRICT
);

-- 8. SUBTYPE: RENTAL PROVIDERS
CREATE TABLE IF NOT EXISTS public.rental_providers (
    content_id TEXT PRIMARY KEY,
    kind TEXT NOT NULL DEFAULT 'rental',
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    address TEXT NOT NULL,
    hotline TEXT NOT NULL,
    notes TEXT,
    CONSTRAINT chk_rental_kind CHECK (kind = 'rental'),
    CONSTRAINT uq_rental_providers_content_id_kind UNIQUE (content_id, kind),
    CONSTRAINT fk_rentals_content_composite FOREIGN KEY (content_id, kind) REFERENCES public.content_items(id, kind) ON DELETE RESTRICT
);

-- 9. SUBTYPE: ACCOMMODATIONS
CREATE TABLE IF NOT EXISTS public.accommodations (
    content_id TEXT PRIMARY KEY,
    kind TEXT NOT NULL DEFAULT 'accommodation',
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    type_label TEXT NOT NULL,
    address TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    google_maps_url TEXT NOT NULL,
    hotline TEXT,
    website TEXT,
    CONSTRAINT chk_accommodations_kind CHECK (kind = 'accommodation'),
    CONSTRAINT chk_accommodations_type CHECK (type IN ('homestay', 'khach-san', 'resort')),
    CONSTRAINT uq_accommodations_content_id_kind UNIQUE (content_id, kind),
    CONSTRAINT fk_accommodations_content_composite FOREIGN KEY (content_id, kind) REFERENCES public.content_items(id, kind) ON DELETE RESTRICT
);

-- 10. SUBTYPE: ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
    content_id TEXT PRIMARY KEY,
    kind TEXT NOT NULL DEFAULT 'article',
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,
    author TEXT,
    published_at TIMESTAMPTZ,
    CONSTRAINT chk_articles_kind CHECK (kind = 'article'),
    CONSTRAINT uq_articles_content_id_kind UNIQUE (content_id, kind),
    CONSTRAINT fk_articles_content_composite FOREIGN KEY (content_id, kind) REFERENCES public.content_items(id, kind) ON DELETE RESTRICT
);

-- 11. AMENITIES
CREATE TABLE IF NOT EXISTS public.amenities (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. ACCOMMODATION AMENITIES (M:N)
CREATE TABLE IF NOT EXISTS public.accommodation_amenities (
    accommodation_id TEXT NOT NULL,
    amenity_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (accommodation_id, amenity_id),
    CONSTRAINT fk_acc_amenities_acc FOREIGN KEY (accommodation_id) REFERENCES public.accommodations(content_id) ON DELETE RESTRICT,
    CONSTRAINT fk_acc_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES public.amenities(id) ON DELETE RESTRICT
);

-- 13. VEHICLE TYPES
CREATE TABLE IF NOT EXISTS public.vehicle_types (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    vietnamese_label TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. RENTAL VEHICLE TYPES (M:N)
CREATE TABLE IF NOT EXISTS public.rental_vehicle_types (
    rental_id TEXT NOT NULL,
    vehicle_type_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rental_id, vehicle_type_id),
    CONSTRAINT fk_rental_veh_rental FOREIGN KEY (rental_id) REFERENCES public.rental_providers(content_id) ON DELETE RESTRICT,
    CONSTRAINT fk_rental_veh_type FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(id) ON DELETE RESTRICT
);

-- 15. PRICING STRUCTURE (BIGINT VND)
CREATE TABLE IF NOT EXISTS public.content_prices (
    content_id TEXT PRIMARY KEY,
    currency TEXT NOT NULL DEFAULT 'VND',
    unit TEXT,
    price_type TEXT NOT NULL,
    amount BIGINT,
    min_amount BIGINT,
    max_amount BIGINT,
    display_label TEXT,
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_date TIMESTAMPTZ,
    CONSTRAINT fk_prices_content FOREIGN KEY (content_id) REFERENCES public.content_items(id) ON DELETE RESTRICT,
    CONSTRAINT chk_price_type CHECK (price_type IN ('unknown', 'contact', 'free', 'fixed', 'range')),
    CONSTRAINT chk_price_amounts_non_negative CHECK (
        (amount IS NULL OR amount >= 0) AND
        (min_amount IS NULL OR min_amount >= 0) AND
        (max_amount IS NULL OR max_amount >= 0) AND
        (min_amount IS NULL OR max_amount IS NULL OR min_amount <= max_amount)
    ),
    CONSTRAINT chk_price_structure_matrix CHECK (
        (price_type IN ('unknown', 'contact') AND amount IS NULL AND min_amount IS NULL AND max_amount IS NULL AND is_free = FALSE) OR
        (price_type = 'free' AND amount IS NULL AND min_amount IS NULL AND max_amount IS NULL AND is_free = TRUE AND is_verified = TRUE) OR
        (price_type = 'fixed' AND amount IS NOT NULL AND min_amount IS NULL AND max_amount IS NULL) OR
        (price_type = 'range' AND amount IS NULL AND min_amount IS NOT NULL AND max_amount IS NOT NULL)
    )
);

-- 16. CONTENT SOURCES
CREATE TABLE IF NOT EXISTS public.content_sources (
    id TEXT PRIMARY KEY,
    source_url TEXT NOT NULL,
    publisher_name TEXT NOT NULL,
    retrieved_date TIMESTAMPTZ,
    last_checked_date TIMESTAMPTZ,
    source_type TEXT,
    license_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. SOURCE ASSERTIONS
CREATE TABLE IF NOT EXISTS public.source_assertions (
    id TEXT PRIMARY KEY,
    content_id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    field_key TEXT NOT NULL,
    excerpt TEXT,
    verification_status TEXT NOT NULL DEFAULT 'reference_only',
    checked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assertions_content FOREIGN KEY (content_id) REFERENCES public.content_items(id) ON DELETE RESTRICT,
    CONSTRAINT fk_assertions_source FOREIGN KEY (source_id) REFERENCES public.content_sources(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_assertions_content_field ON public.source_assertions (content_id, field_key);

-- 18. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.media_assets (
    id TEXT PRIMARY KEY,
    storage_bucket TEXT NOT NULL,
    object_key TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    byte_size INTEGER NOT NULL,
    alt_text TEXT NOT NULL,
    credit TEXT,
    license_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_media_assets_bucket_key UNIQUE (storage_bucket, object_key)
);

-- 19. MEDIA LINKS (M:N)
CREATE TABLE IF NOT EXISTS public.media_links (
    content_id TEXT NOT NULL,
    media_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'gallery',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (content_id, media_id),
    CONSTRAINT fk_media_links_content FOREIGN KEY (content_id) REFERENCES public.content_items(id) ON DELETE RESTRICT,
    CONSTRAINT fk_media_links_media FOREIGN KEY (media_id) REFERENCES public.media_assets(id) ON DELETE RESTRICT
);

-- 20. ADMIN MEMBERSHIPS
CREATE TABLE IF NOT EXISTS public.admin_memberships (
    id TEXT PRIMARY KEY,
    auth_user_id UUID NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'editor',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMPTZ,
    CONSTRAINT chk_admin_role CHECK (role IN ('super_admin', 'editor', 'reviewer'))
);

-- 21. CONTENT REVISIONS
CREATE TABLE IF NOT EXISTS public.content_revisions (
    id TEXT PRIMARY KEY,
    content_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    snapshot JSONB NOT NULL,
    created_by_auth_user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_revisions_content_version UNIQUE (content_id, version),
    CONSTRAINT chk_revisions_version_positive CHECK (version > 0),
    CONSTRAINT fk_revisions_content FOREIGN KEY (content_id) REFERENCES public.content_items(id) ON DELETE RESTRICT
);

-- 22. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    content_id TEXT,
    action TEXT NOT NULL,
    actor_auth_user_id UUID,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details JSONB,
    CONSTRAINT fk_audit_logs_content FOREIGN KEY (content_id) REFERENCES public.content_items(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_occurred_at ON public.audit_logs (occurred_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_content_id ON public.audit_logs (content_id);

-- ------------------------------------------------------------------------------
-- DEFERRABLE CONSTRAINT TRIGGER: EXACTLY ONE SUBTYPE AT COMMIT
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_content_item_subtype_constraint()
RETURNS TRIGGER AS $$
DECLARE
    v_target_ids TEXT[] := ARRAY[]::TEXT[];
    v_target_id TEXT;
    v_kind TEXT;
    v_place_count INT;
    v_rental_count INT;
    v_accommodation_count INT;
    v_article_count INT;
    v_total_subtypes INT;
BEGIN
    IF TG_TABLE_NAME = 'content_items' THEN
        IF TG_OP = 'INSERT' THEN
            v_target_ids := ARRAY[NEW.id];
        ELSIF TG_OP = 'UPDATE' THEN
            v_target_ids := ARRAY[NEW.id];
            IF OLD.id IS DISTINCT FROM NEW.id THEN
                v_target_ids := v_target_ids || OLD.id;
            END IF;
        END IF;
    ELSE
        -- Subtype tables: places, rental_providers, accommodations, articles
        IF TG_OP = 'INSERT' THEN
            v_target_ids := ARRAY[NEW.content_id];
        ELSIF TG_OP = 'UPDATE' THEN
            v_target_ids := ARRAY[NEW.content_id];
            IF OLD.content_id IS DISTINCT FROM NEW.content_id THEN
                v_target_ids := v_target_ids || OLD.content_id;
            END IF;
        ELSIF TG_OP = 'DELETE' THEN
            v_target_ids := ARRAY[OLD.content_id];
        END IF;
    END IF;

    FOREACH v_target_id IN ARRAY v_target_ids LOOP
        IF v_target_id IS NOT NULL THEN
            -- If parent content item does not exist (e.g. deleted within transaction or not yet created),
            -- composite FK enforces reference integrity; if parent exists, it MUST have exactly 1 matching subtype.
            IF EXISTS (SELECT 1 FROM public.content_items WHERE id = v_target_id) THEN
                SELECT kind INTO v_kind FROM public.content_items WHERE id = v_target_id;

                SELECT COUNT(*) INTO v_place_count FROM public.places WHERE content_id = v_target_id;
                SELECT COUNT(*) INTO v_rental_count FROM public.rental_providers WHERE content_id = v_target_id;
                SELECT COUNT(*) INTO v_accommodation_count FROM public.accommodations WHERE content_id = v_target_id;
                SELECT COUNT(*) INTO v_article_count FROM public.articles WHERE content_id = v_target_id;

                v_total_subtypes := v_place_count + v_rental_count + v_accommodation_count + v_article_count;

                IF v_total_subtypes <> 1 THEN
                    RAISE EXCEPTION 'Subtype violation: content_item % must have exactly 1 subtype at commit, found %', v_target_id, v_total_subtypes;
                END IF;

                IF v_kind = 'place' AND v_place_count <> 1 THEN
                    RAISE EXCEPTION 'Subtype kind mismatch: content_item % of kind place must have a row in places', v_target_id;
                ELSIF v_kind = 'rental' AND v_rental_count <> 1 THEN
                    RAISE EXCEPTION 'Subtype kind mismatch: content_item % of kind rental must have a row in rental_providers', v_target_id;
                ELSIF v_kind = 'accommodation' AND v_accommodation_count <> 1 THEN
                    RAISE EXCEPTION 'Subtype kind mismatch: content_item % of kind accommodation must have a row in accommodations', v_target_id;
                ELSIF v_kind = 'article' AND v_article_count <> 1 THEN
                    RAISE EXCEPTION 'Subtype kind mismatch: content_item % of kind article must have a row in articles', v_target_id;
                END IF;
            END IF;
        END IF;
    END LOOP;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_subtype_content_items ON public.content_items;
CREATE CONSTRAINT TRIGGER trg_check_subtype_content_items
AFTER INSERT OR UPDATE ON public.content_items
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.check_content_item_subtype_constraint();

DROP TRIGGER IF EXISTS trg_check_subtype_places ON public.places;
CREATE CONSTRAINT TRIGGER trg_check_subtype_places
AFTER INSERT OR UPDATE OR DELETE ON public.places
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.check_content_item_subtype_constraint();

DROP TRIGGER IF EXISTS trg_check_subtype_rental_providers ON public.rental_providers;
CREATE CONSTRAINT TRIGGER trg_check_subtype_rental_providers
AFTER INSERT OR UPDATE OR DELETE ON public.rental_providers
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.check_content_item_subtype_constraint();

DROP TRIGGER IF EXISTS trg_check_subtype_accommodations ON public.accommodations;
CREATE CONSTRAINT TRIGGER trg_check_subtype_accommodations
AFTER INSERT OR UPDATE OR DELETE ON public.accommodations
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.check_content_item_subtype_constraint();

DROP TRIGGER IF EXISTS trg_check_subtype_articles ON public.articles;
CREATE CONSTRAINT TRIGGER trg_check_subtype_articles
AFTER INSERT OR UPDATE OR DELETE ON public.articles
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION public.check_content_item_subtype_constraint();

-- ------------------------------------------------------------------------------
-- SUPABASE POSTGREST SECURITY: ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
-- Bật RLS trên toàn bộ 22 bảng để khóa PostgREST API công khai của Supabase.
-- Prisma kết nối qua vai trò 'postgres' sẽ tự động bypass RLS cho backend Next.js.

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_assertions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. BẢO VỆ NỘI DUNG CÔNG KHAI: CHỈ ĐỌC BẢN GHI ĐÃ XUẤT BẢN (PUBLISHED)
CREATE POLICY "Public read published content items" 
ON public.content_items FOR SELECT TO anon, authenticated 
USING (publication_status = 'published');

CREATE POLICY "Public read published places" 
ON public.places FOR SELECT TO anon, authenticated 
USING (EXISTS (SELECT 1 FROM public.content_items ci WHERE ci.id = places.content_id AND ci.publication_status = 'published'));

CREATE POLICY "Public read published rental providers" 
ON public.rental_providers FOR SELECT TO anon, authenticated 
USING (EXISTS (SELECT 1 FROM public.content_items ci WHERE ci.id = rental_providers.content_id AND ci.publication_status = 'published'));

CREATE POLICY "Public read published accommodations" 
ON public.accommodations FOR SELECT TO anon, authenticated 
USING (EXISTS (SELECT 1 FROM public.content_items ci WHERE ci.id = accommodations.content_id AND ci.publication_status = 'published'));

CREATE POLICY "Public read published articles" 
ON public.articles FOR SELECT TO anon, authenticated 
USING (EXISTS (SELECT 1 FROM public.content_items ci WHERE ci.id = articles.content_id AND ci.publication_status = 'published'));

CREATE POLICY "Public read published content prices" 
ON public.content_prices FOR SELECT TO anon, authenticated 
USING (EXISTS (SELECT 1 FROM public.content_items ci WHERE ci.id = content_prices.content_id AND ci.publication_status = 'published'));

-- 2. CHO PHÉP ĐỌC DANH MỤC THAM CHIẾU CÔNG KHAI (STATIC TAXONOMIES)
CREATE POLICY "Public read areas" ON public.areas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read tags" ON public.tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read amenities" ON public.amenities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read vehicle types" ON public.vehicle_types FOR SELECT TO anon, authenticated USING (true);

-- 3. BẢO VỆ CÁC BẢNG LIÊN KẾT (JUNCTION & ATTRIBUTE TABLES) — CÔ LẬP BẢN NHÁP (DRAFT ISOLATION)
CREATE POLICY "Public read published content categories" 
ON public.content_categories FOR SELECT TO anon, authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.content_items ci 
        WHERE ci.id = content_categories.content_id 
          AND ci.publication_status = 'published'
    )
);

CREATE POLICY "Public read published content tags" 
ON public.content_tags FOR SELECT TO anon, authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.content_items ci 
        WHERE ci.id = content_tags.content_id 
          AND ci.publication_status = 'published'
    )
);

CREATE POLICY "Public read published accommodation amenities" 
ON public.accommodation_amenities FOR SELECT TO anon, authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.content_items ci 
        WHERE ci.id = accommodation_amenities.accommodation_id 
          AND ci.publication_status = 'published'
    )
);

CREATE POLICY "Public read published rental vehicle types" 
ON public.rental_vehicle_types FOR SELECT TO anon, authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.content_items ci 
        WHERE ci.id = rental_vehicle_types.rental_id 
          AND ci.publication_status = 'published'
    )
);

-- 4. BẢO VỆ NGUỒN DỮ LIỆU & MEDIA (PROVENANCE & ASSETS) — CÔ LẬP BẢN NHÁP (DRAFT ISOLATION)
CREATE POLICY "Public read published source assertions" 
ON public.source_assertions FOR SELECT TO anon, authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.content_items ci 
        WHERE ci.id = source_assertions.content_id 
          AND ci.publication_status = 'published'
    )
);

CREATE POLICY "Public read published content sources" 
ON public.content_sources FOR SELECT TO anon, authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.source_assertions sa
        JOIN public.content_items ci ON ci.id = sa.content_id
        WHERE sa.source_id = content_sources.id 
          AND ci.publication_status = 'published'
    )
);

-- ==============================================================================
-- INTERNAL SCHEMA & HELPER FUNCTION (BẢO VỆ RLS & CHỐNG POSTGREST RPC EXPOSURE)
-- ==============================================================================
CREATE SCHEMA IF NOT EXISTS internal;
REVOKE ALL ON SCHEMA internal FROM PUBLIC;
REVOKE ALL ON SCHEMA internal FROM anon, authenticated;
GRANT USAGE ON SCHEMA internal TO anon, authenticated;

-- Hàm hỗ trợ bảo mật SECURITY DEFINER trong schema nội bộ, search_path rỗng ngăn ngừa search-path hijacking
CREATE OR REPLACE FUNCTION internal.fn_is_media_asset_published(p_media_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.media_assets
        WHERE id = p_media_id AND is_published = TRUE
    );
$$;

REVOKE EXECUTE ON FUNCTION internal.fn_is_media_asset_published(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION internal.fn_is_media_asset_published(TEXT) TO anon, authenticated;

CREATE POLICY "Public read published media links" 
ON public.media_links FOR SELECT TO anon, authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.content_items ci 
        WHERE ci.id = media_links.content_id 
          AND ci.publication_status = 'published'
    )
    AND internal.fn_is_media_asset_published(media_links.media_id)
);

CREATE POLICY "Public read published media assets" 
ON public.media_assets FOR SELECT TO anon, authenticated 
USING (
    is_published = true
    AND EXISTS (
        SELECT 1 FROM public.media_links ml
        JOIN public.content_items ci ON ci.id = ml.content_id
        WHERE ml.media_id = media_assets.id 
          AND ci.publication_status = 'published'
    )
);

-- 5. KHÓA HOÀN TOÀN CÁC BẢNG NỘI BỘ VÀ QUYỀN GHI VỚI ANON VÀ AUTHENTICATED
-- Các bảng admin_memberships, content_revisions, audit_logs KHÔNG có policy SELECT cho anon/authenticated
-- => Mặc định PostgreSQL từ chối toàn bộ truy cập từ PostgREST API ngoài mạng.
-- KHÔNG CÓ POLICY GHI (INSERT/UPDATE/DELETE) CHO ANON HOẶC AUTHENTICATED TRÊN TOÀN BỘ 22 BẢNG.

-- ------------------------------------------------------------------------------
-- ROLE PERMISSIONS & SECURITY HARDENING FOR SUPABASE (ANON & AUTHENTICATED)
-- ------------------------------------------------------------------------------
-- Cấp quyền truy cập schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Cấp quyền SELECT trên 19 bảng công khai (RLS sẽ lọc chỉ bản ghi Published)
-- Bảo đảm các truy vấn con (subqueries) trong policy không bị lỗi "permission denied"
GRANT SELECT ON TABLE 
    public.content_items,
    public.areas,
    public.categories,
    public.tags,
    public.content_categories,
    public.content_tags,
    public.places,
    public.rental_providers,
    public.accommodations,
    public.articles,
    public.amenities,
    public.accommodation_amenities,
    public.vehicle_types,
    public.rental_vehicle_types,
    public.content_prices,
    public.content_sources,
    public.source_assertions,
    public.media_assets,
    public.media_links
TO anon, authenticated;

-- Thu hồi triệt để toàn bộ quyền trên 3 bảng quản trị nội bộ
REVOKE ALL ON TABLE 
    public.admin_memberships,
    public.content_revisions,
    public.audit_logs
FROM anon, authenticated;

-- Thu hồi triệt để toàn bộ quyền ghi (INSERT, UPDATE, DELETE, TRUNCATE) trên schema public
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon, authenticated;



