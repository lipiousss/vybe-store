--
-- PostgreSQL database dump
--

\restrict dtECtVLpaZ8bQgM38Td4lhy9ngcgLhEjeATiA8dNCaRCNKcBQkB4aoaDFbr4zGI

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS vybe_store;
--
-- Name: vybe_store; Type: DATABASE; Schema: -; Owner: vybe
--

CREATE DATABASE vybe_store WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE vybe_store OWNER TO vybe;

\unrestrict dtECtVLpaZ8bQgM38Td4lhy9ngcgLhEjeATiA8dNCaRCNKcBQkB4aoaDFbr4zGI
\connect vybe_store
\restrict dtECtVLpaZ8bQgM38Td4lhy9ngcgLhEjeATiA8dNCaRCNKcBQkB4aoaDFbr4zGI

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: vybe
--

CREATE TYPE public."DiscountType" AS ENUM (
    'NONE',
    'PERCENT',
    'FIXED'
);


ALTER TYPE public."DiscountType" OWNER TO vybe;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: vybe
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'NEW',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO vybe;

--
-- Name: ProductStatus; Type: TYPE; Schema: public; Owner: vybe
--

CREATE TYPE public."ProductStatus" AS ENUM (
    'ACTIVE',
    'DRAFT',
    'ARCHIVED',
    'OUT_OF_STOCK'
);


ALTER TYPE public."ProductStatus" OWNER TO vybe;

--
-- Name: StockMovementType; Type: TYPE; Schema: public; Owner: vybe
--

CREATE TYPE public."StockMovementType" AS ENUM (
    'INCREASE',
    'DECREASE',
    'SALE',
    'MANUAL'
);


ALTER TYPE public."StockMovementType" OWNER TO vybe;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: vybe
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO vybe;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "userId" text NOT NULL,
    city text NOT NULL,
    street text NOT NULL,
    house text NOT NULL,
    apartment text,
    "postalCode" text,
    "isDefault" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Address" OWNER TO vybe;

--
-- Name: AdminLog; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."AdminLog" (
    id text NOT NULL,
    "adminId" text,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AdminLog" OWNER TO vybe;

--
-- Name: Artwork; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."Artwork" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    image text NOT NULL,
    category text,
    tags text[],
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Artwork" OWNER TO vybe;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO vybe;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "cartId" text NOT NULL,
    "productId" text NOT NULL,
    "variantId" text,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO vybe;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    image text,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO vybe;

--
-- Name: Collection; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."Collection" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    image text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Collection" OWNER TO vybe;

--
-- Name: Favorite; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."Favorite" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Favorite" OWNER TO vybe;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text,
    status public."OrderStatus" DEFAULT 'NEW'::public."OrderStatus" NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    "customerName" text NOT NULL,
    "customerPhone" text NOT NULL,
    "customerEmail" text NOT NULL,
    "deliveryCity" text NOT NULL,
    "deliveryAddress" text NOT NULL,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO vybe;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    "variantId" text,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO vybe;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    "oldPrice" numeric(10,2),
    "discountType" public."DiscountType" DEFAULT 'NONE'::public."DiscountType" NOT NULL,
    "discountValue" numeric(10,2) DEFAULT 0 NOT NULL,
    "finalPrice" numeric(10,2) NOT NULL,
    status public."ProductStatus" DEFAULT 'ACTIVE'::public."ProductStatus" NOT NULL,
    brand text,
    designer text,
    material text,
    color text,
    "isNew" boolean DEFAULT false NOT NULL,
    "isLimited" boolean DEFAULT false NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isCollectible" boolean DEFAULT false NOT NULL,
    characteristics jsonb,
    "categoryId" text NOT NULL,
    "collectionId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO vybe;

--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."ProductImage" (
    id text NOT NULL,
    "productId" text NOT NULL,
    url text NOT NULL,
    alt text,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."ProductImage" OWNER TO vybe;

--
-- Name: ProductVariant; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."ProductVariant" (
    id text NOT NULL,
    "productId" text NOT NULL,
    size text,
    color text,
    sku text NOT NULL,
    stock integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."ProductVariant" OWNER TO vybe;

--
-- Name: SiteAsset; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."SiteAsset" (
    id text NOT NULL,
    key text NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SiteAsset" OWNER TO vybe;

--
-- Name: StockMovement; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."StockMovement" (
    id text NOT NULL,
    "productVariantId" text NOT NULL,
    type public."StockMovementType" NOT NULL,
    quantity integer NOT NULL,
    comment text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."StockMovement" OWNER TO vybe;

--
-- Name: User; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    avatar text,
    phone text,
    "isBlocked" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO vybe;

--
-- Name: UserProfile; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public."UserProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text,
    "lastName" text,
    bio text,
    "birthDate" timestamp(3) without time zone
);


ALTER TABLE public."UserProfile" OWNER TO vybe;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: vybe
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO vybe;

--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: vybe
--



--
-- Data for Name: AdminLog; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."AdminLog" VALUES ('d413a2ac-3564-4747-bc05-23b792b0c2f7', 'eebf2168-efc2-42a6-a83b-c3f6c249d9f9', 'UPDATE_ORDER_STATUS', 'Order', '1b775909-961a-4367-b130-23868dd07b6a', 'Order status changed to PROCESSING', '2026-05-24 18:18:37.785');


--
-- Data for Name: Artwork; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."Artwork" VALUES ('b169c080-fa29-436c-a996-c332c3be366b', 'Gate of Ash', 'gate-of-ash', 'Gate of Ash: стартовая работа визуального архива.', '/images/placeholders/artwork-placeholder.png', 'Environment', '{dark-fantasy,vybe}', 0, true, '2026-05-25 09:56:21.644', '2026-05-28 03:58:47.133');
INSERT INTO public."Artwork" VALUES ('ffb8e9c7-34c0-4b79-9ebd-28a9eac63606', 'pip', 'pip', 'go go go', '/uploads/artworks/artwork-eebf2168-efc2-42a6-a83b-c3f6c249d9f9-1779789783232.jpg', 'Night Collection', '{dark-fantasy}', 1, true, '2026-05-23 17:49:24.046', '2026-05-26 10:03:15.757');
INSERT INTO public."Artwork" VALUES ('606afafe-a14d-4275-bf56-f9900cdcc57b', 'Blue Eclipse Saint', 'blue-eclipse-saint', 'Blue Eclipse Saint: стартовая работа визуального архива.', '/images/placeholders/artwork-placeholder.png', 'Character', '{dark-fantasy,vybe}', 1, true, '2026-05-23 17:49:24.049', '2026-05-28 03:58:47.135');
INSERT INTO public."Artwork" VALUES ('9a479e93-1fbe-4360-bf04-12e1c6403cb2', 'Obsidian Market', 'obsidian-market', 'Obsidian Market: стартовая работа визуального архива.', '/images/placeholders/artwork-placeholder.png', 'Environment', '{dark-fantasy,vybe}', 2, true, '2026-05-23 17:49:24.05', '2026-05-28 03:58:47.137');
INSERT INTO public."Artwork" VALUES ('82290a0e-9a77-406a-8109-11545289ad9f', 'Ancient Gold Idol', 'ancient-gold-idol', 'Ancient Gold Idol: стартовая работа визуального архива.', '/images/placeholders/artwork-placeholder.png', 'Relic', '{dark-fantasy,vybe}', 3, true, '2026-05-23 17:49:24.052', '2026-05-28 03:58:47.138');
INSERT INTO public."Artwork" VALUES ('4a9c1593-0167-4f73-9e58-c8bc8fd4d2ae', 'Night Courier', 'night-courier', 'Night Courier: стартовая работа визуального архива.', '/images/placeholders/artwork-placeholder.png', 'Character', '{dark-fantasy,vybe}', 4, true, '2026-05-23 17:49:24.054', '2026-05-28 03:58:47.139');
INSERT INTO public."Artwork" VALUES ('194906e8-d37d-42d3-8e83-0346e6cffb1c', 'Relic Workshop', 'relic-workshop', 'Relic Workshop: стартовая работа визуального архива.', '/images/placeholders/artwork-placeholder.png', 'Environment', '{dark-fantasy,vybe}', 5, true, '2026-05-23 17:49:24.055', '2026-05-28 03:58:47.14');
INSERT INTO public."Artwork" VALUES ('15687f61-cfc7-4660-8159-45ea7bac497e', 'Glass Moon Ritual', 'glass-moon-ritual', 'Glass Moon Ritual: стартовая работа визуального архива.', '/images/placeholders/artwork-placeholder.png', 'Concept', '{dark-fantasy,vybe}', 6, true, '2026-05-23 17:49:24.056', '2026-05-28 03:58:47.141');
INSERT INTO public."Artwork" VALUES ('97f7e4f0-7655-4cf9-8bc7-b246e2a9f132', 'Silent Cathedral', 'silent-cathedral', 'Silent Cathedral: стартовая работа визуального архива.', '/images/placeholders/artwork-placeholder.png', 'Environment', '{dark-fantasy,vybe}', 7, true, '2026-05-23 17:49:24.058', '2026-05-28 03:58:47.143');


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."Cart" VALUES ('f7a45b5c-809f-4540-aa6d-97fc8f2e41b3', 'c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc', '2026-05-24 17:48:29.567', '2026-05-24 17:48:29.567');
INSERT INTO public."Cart" VALUES ('ecf46d58-a9db-436a-b149-c5758b6e1f75', '66b0a068-0eb0-41f5-ac9d-7fb1bb485355', '2026-05-24 18:02:32.787', '2026-05-24 18:02:32.787');
INSERT INTO public."Cart" VALUES ('9322840d-ddf7-490d-8024-391f677e3250', 'eebf2168-efc2-42a6-a83b-c3f6c249d9f9', '2026-05-25 08:45:04.256', '2026-05-25 08:45:04.256');
INSERT INTO public."Cart" VALUES ('30fcfc94-35be-40d8-81f8-fd668b1ef016', 'd77e6950-48cc-4cf9-a41a-b8be5d9b071a', '2026-05-26 11:32:36.969', '2026-05-26 11:32:36.969');


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."CartItem" VALUES ('4ecb1a66-02ca-450f-bfb7-7d41806d0eba', '9322840d-ddf7-490d-8024-391f677e3250', 'c2cd2de4-e594-4188-abc4-c2b33a90c94d', NULL, 1);
INSERT INTO public."CartItem" VALUES ('851be579-c22a-4a2e-ae94-1b40fd7ab81c', '9322840d-ddf7-490d-8024-391f677e3250', 'b12183ef-24b5-400a-81ad-0d7584b7a517', '7113ca24-57ce-4ebd-88f3-b98f7325d1c6', 1);
INSERT INTO public."CartItem" VALUES ('2cb95122-0a3d-4131-846c-6f84279819f1', 'f7a45b5c-809f-4540-aa6d-97fc8f2e41b3', 'b12183ef-24b5-400a-81ad-0d7584b7a517', '7113ca24-57ce-4ebd-88f3-b98f7325d1c6', 1);
INSERT INTO public."CartItem" VALUES ('916ef710-d214-4742-a709-685917777486', 'f7a45b5c-809f-4540-aa6d-97fc8f2e41b3', '4b3c9722-b3b5-46b0-be2a-93944878a18e', 'b4886ae2-41a8-4a22-a541-a16e9e9f1f8d', 1);


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."Category" VALUES ('e407cc4c-b861-4782-a304-3e26248e175f', 'Сумки', 'bags', 'Сумки: базовая категория VYBE Store.', NULL, 'c80df19f-792a-411c-8a9f-99a44f2188a5', '2026-05-23 17:49:23.867', '2026-05-28 03:58:46.91');
INSERT INTO public."Category" VALUES ('196b183c-03fa-4f29-9f32-afa008050e6a', 'Статуэтки', 'statues', 'Статуэтки: базовая категория VYBE Store.', NULL, '8525b638-6b28-4b39-960d-b0524bb75073', '2026-05-23 17:49:23.874', '2026-05-28 03:58:46.916');
INSERT INTO public."Category" VALUES ('10fc9265-eec9-4c01-b5b5-ce7e848d463e', 'Мышки', 'mice', 'Мышки: базовая категория VYBE Store.', NULL, 'fc242398-f3f8-46b3-a00e-1c3de0b77b79', '2026-05-23 17:49:23.88', '2026-05-28 03:58:46.921');
INSERT INTO public."Category" VALUES ('2d389f5d-608f-4fad-b3a3-cf3d9f7ef6ce', 'Figures', 'figures', 'Figures: базовая категория VYBE Store.', NULL, '40fad2db-8b16-45dd-9527-5ecd07845f59', '2026-05-23 17:49:23.887', '2026-05-28 03:58:46.927');
INSERT INTO public."Category" VALUES ('4acab146-501e-4f90-8919-ac3fa50e9f55', 'Cards', 'cards', 'Cards: базовая категория VYBE Store.', NULL, '40fad2db-8b16-45dd-9527-5ecd07845f59', '2026-05-23 17:49:23.888', '2026-05-28 03:58:46.928');
INSERT INTO public."Category" VALUES ('c80df19f-792a-411c-8a9f-99a44f2188a5', 'Одежда', 'clothing', 'Одежда в стилистике dark fantasy.', NULL, NULL, '2026-05-23 17:49:23.844', '2026-05-28 03:58:46.891');
INSERT INTO public."Category" VALUES ('40fad2db-8b16-45dd-9527-5ecd07845f59', 'Коллекционные предметы', 'collectibles', 'Коллекционные предметы в стилистике dark fantasy.', NULL, NULL, '2026-05-23 17:49:23.851', '2026-05-28 03:58:46.898');
INSERT INTO public."Category" VALUES ('440df1fa-f170-4fe4-bb10-93e027985972', 'Головные уборы', 'headwear', 'Головные уборы: базовая категория VYBE Store.', NULL, 'c80df19f-792a-411c-8a9f-99a44f2188a5', '2026-05-23 17:49:23.852', '2026-05-28 03:58:46.899');
INSERT INTO public."Category" VALUES ('68eddbc8-2960-47d8-aa1b-ef80968119c7', 'Кофты', 'sweaters', 'Кофты: базовая категория VYBE Store.', NULL, 'c80df19f-792a-411c-8a9f-99a44f2188a5', '2026-05-23 17:49:23.859', '2026-05-28 03:58:46.903');
INSERT INTO public."Category" VALUES ('5911928d-0e6e-4253-8e6c-40b38514f240', 'Джинсы', 'jeans', 'Джинсы: базовая категория VYBE Store.', NULL, 'c80df19f-792a-411c-8a9f-99a44f2188a5', '2026-05-23 17:49:23.861', '2026-05-28 03:58:46.905');
INSERT INTO public."Category" VALUES ('5ecdf40e-a814-48a1-a240-aaad644e63b9', 'Подвески', 'pendants', 'Подвески: базовая категория VYBE Store.', NULL, '72a98d84-6a3e-418e-af67-0b7d1c277dfd', '2026-05-23 17:49:23.868', '2026-05-28 03:58:46.911');
INSERT INTO public."Category" VALUES ('9e062d62-2ee8-44bf-9a7b-3c25904458f7', 'Манекены', 'mannequins', 'Манекены: базовая категория VYBE Store.', NULL, '8525b638-6b28-4b39-960d-b0524bb75073', '2026-05-23 17:49:23.876', '2026-05-28 03:58:46.917');
INSERT INTO public."Category" VALUES ('e1202a6a-cee0-496a-ad7e-0e84de647f14', 'Клавиатуры', 'keyboards', 'Клавиатуры: базовая категория VYBE Store.', NULL, 'fc242398-f3f8-46b3-a00e-1c3de0b77b79', '2026-05-23 17:49:23.881', '2026-05-28 03:58:46.922');
INSERT INTO public."Category" VALUES ('c93884d0-3944-40eb-a660-5527bae4148f', 'Patches', 'patches', 'Patches: базовая категория VYBE Store.', NULL, '40fad2db-8b16-45dd-9527-5ecd07845f59', '2026-05-23 17:49:23.889', '2026-05-28 03:58:46.929');
INSERT INTO public."Category" VALUES ('72a98d84-6a3e-418e-af67-0b7d1c277dfd', 'Аксессуары', 'accessories', 'Аксессуары в стилистике dark fantasy.', NULL, NULL, '2026-05-23 17:49:23.846', '2026-05-28 03:58:46.894');
INSERT INTO public."Category" VALUES ('3ab9e877-c95a-49d3-80fe-f736978a91b2', 'Куртки', 'jackets', 'Куртки: базовая категория VYBE Store.', NULL, 'c80df19f-792a-411c-8a9f-99a44f2188a5', '2026-05-23 17:49:23.855', '2026-05-28 03:58:46.901');
INSERT INTO public."Category" VALUES ('54ce477a-3226-4259-aae5-e633a03ba178', 'Зип-худи', 'zip-hoodies', 'Зип-худи: базовая категория VYBE Store.', NULL, 'c80df19f-792a-411c-8a9f-99a44f2188a5', '2026-05-23 17:49:23.858', '2026-05-28 03:58:46.902');
INSERT INTO public."Category" VALUES ('9f8ebf0f-0b54-4328-b39e-e9e0ee7b3e63', 'Штаны', 'pants', 'Штаны: базовая категория VYBE Store.', NULL, 'c80df19f-792a-411c-8a9f-99a44f2188a5', '2026-05-23 17:49:23.862', '2026-05-28 03:58:46.907');
INSERT INTO public."Category" VALUES ('42ac7383-d2a9-4b1d-b2a9-5ab9e436b1d3', 'Браслеты', 'bracelets', 'Браслеты: базовая категория VYBE Store.', NULL, '72a98d84-6a3e-418e-af67-0b7d1c277dfd', '2026-05-23 17:49:23.87', '2026-05-28 03:58:46.913');
INSERT INTO public."Category" VALUES ('2b6bcb8f-52df-4341-b65c-99dc34b2c922', 'Коврики для мыши', 'mouse-pads', 'Коврики для мыши: базовая категория VYBE Store.', NULL, 'fc242398-f3f8-46b3-a00e-1c3de0b77b79', '2026-05-23 17:49:23.877', '2026-05-28 03:58:46.919');
INSERT INTO public."Category" VALUES ('b6ae1bba-94ef-43b2-9d02-9a452968cdc2', 'Стеклянные коврики', 'glass-mouse-pads', 'Стеклянные коврики: базовая категория VYBE Store.', NULL, 'fc242398-f3f8-46b3-a00e-1c3de0b77b79', '2026-05-23 17:49:23.878', '2026-05-28 03:58:46.92');
INSERT INTO public."Category" VALUES ('c4aeedfa-51ab-40d4-9118-84e26d860bec', 'Кейкапы', 'keycaps', 'Кейкапы: базовая категория VYBE Store.', NULL, 'fc242398-f3f8-46b3-a00e-1c3de0b77b79', '2026-05-23 17:49:23.883', '2026-05-28 03:58:46.923');
INSERT INTO public."Category" VALUES ('eee6be6c-6fb5-471f-9f1b-fa1d1a4e8392', 'Limited Boxes', 'limited-boxes', 'Limited Boxes: базовая категория VYBE Store.', NULL, '40fad2db-8b16-45dd-9527-5ecd07845f59', '2026-05-23 17:49:23.891', '2026-05-28 03:58:46.931');
INSERT INTO public."Category" VALUES ('8525b638-6b28-4b39-960d-b0524bb75073', 'Декор', 'decor', 'Декор в стилистике dark fantasy.', NULL, NULL, '2026-05-23 17:49:23.848', '2026-05-28 03:58:46.895');
INSERT INTO public."Category" VALUES ('fc242398-f3f8-46b3-a00e-1c3de0b77b79', 'Компьютерная периферия', 'computer-peripherals', 'Компьютерная периферия в стилистике dark fantasy.', NULL, NULL, '2026-05-23 17:49:23.85', '2026-05-28 03:58:46.897');
INSERT INTO public."Category" VALUES ('a0339050-13b2-4368-b875-c68a4e10f58b', 'Обувь', 'shoes', 'Обувь: базовая категория VYBE Store.', NULL, 'c80df19f-792a-411c-8a9f-99a44f2188a5', '2026-05-23 17:49:23.864', '2026-05-28 03:58:46.908');
INSERT INTO public."Category" VALUES ('3f993ec4-f464-4e22-ba5d-f1eb99716f31', 'Перчатки', 'gloves', 'Перчатки: базовая категория VYBE Store.', NULL, 'c80df19f-792a-411c-8a9f-99a44f2188a5', '2026-05-23 17:49:23.865', '2026-05-28 03:58:46.909');
INSERT INTO public."Category" VALUES ('2d095ca3-f689-447b-adba-738e1f093cc7', 'Серьги', 'earrings', 'Серьги: базовая категория VYBE Store.', NULL, '72a98d84-6a3e-418e-af67-0b7d1c277dfd', '2026-05-23 17:49:23.871', '2026-05-28 03:58:46.914');
INSERT INTO public."Category" VALUES ('806dbec8-b90c-4bc7-bdb3-d4b8bb64121b', 'Постеры', 'posters', 'Постеры: базовая категория VYBE Store.', NULL, '8525b638-6b28-4b39-960d-b0524bb75073', '2026-05-23 17:49:23.873', '2026-05-28 03:58:46.915');
INSERT INTO public."Category" VALUES ('497767f2-14c0-4994-b35e-b4355e675bae', 'Sticker Packs', 'sticker-packs', 'Sticker Packs: базовая категория VYBE Store.', NULL, '40fad2db-8b16-45dd-9527-5ecd07845f59', '2026-05-23 17:49:23.884', '2026-05-28 03:58:46.925');
INSERT INTO public."Category" VALUES ('da8c5f2a-b07e-4389-a7c7-aedc2ec66d24', 'Art Books', 'art-books', 'Art Books: базовая категория VYBE Store.', NULL, '40fad2db-8b16-45dd-9527-5ecd07845f59', '2026-05-23 17:49:23.885', '2026-05-28 03:58:46.926');


--
-- Data for Name: Collection; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."Collection" VALUES ('2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', 'Night Collection', 'night-collection', 'Night Collection: стартовая коллекция VYBE Store.', NULL, true, '2026-05-23 17:49:23.892', '2026-05-28 03:58:46.932');
INSERT INTO public."Collection" VALUES ('b3a0a377-d5c5-44ee-a076-5c3fe62610d2', 'Ash Relics', 'ash-relics', 'Ash Relics: стартовая коллекция VYBE Store.', NULL, true, '2026-05-23 17:49:23.894', '2026-05-28 03:58:46.934');
INSERT INTO public."Collection" VALUES ('90eb1200-30b0-405e-a834-fd9c4583cbfa', 'Blue Eclipse', 'blue-eclipse', 'Blue Eclipse: стартовая коллекция VYBE Store.', NULL, true, '2026-05-23 17:49:23.896', '2026-05-28 03:58:46.935');
INSERT INTO public."Collection" VALUES ('768fa59c-6180-4cae-9a98-dc5ddf23477d', 'Ancient Gold Drop', 'ancient-gold-drop', 'Ancient Gold Drop: стартовая коллекция VYBE Store.', NULL, true, '2026-05-23 17:49:23.897', '2026-05-28 03:58:46.936');


--
-- Data for Name: Favorite; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."Favorite" VALUES ('77af5054-020c-4fcc-ae0a-9736308cd291', 'eebf2168-efc2-42a6-a83b-c3f6c249d9f9', '953f7dbb-427a-49df-b53c-68d11487c70a', '2026-06-04 07:11:46.794');
INSERT INTO public."Favorite" VALUES ('cacc1eb4-8c1c-4e7c-9246-1c8227733dd1', 'eebf2168-efc2-42a6-a83b-c3f6c249d9f9', 'b12183ef-24b5-400a-81ad-0d7584b7a517', '2026-06-10 23:07:56.496');
INSERT INTO public."Favorite" VALUES ('2b860d74-ce98-4f76-833c-0f132e0f2642', 'eebf2168-efc2-42a6-a83b-c3f6c249d9f9', '4b3c9722-b3b5-46b0-be2a-93944878a18e', '2026-06-10 23:07:57.231');
INSERT INTO public."Favorite" VALUES ('69bdb719-a5d1-460d-8042-05ad73712765', 'c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc', 'c2cd2de4-e594-4188-abc4-c2b33a90c94d', '2026-06-10 23:34:09.845');
INSERT INTO public."Favorite" VALUES ('46f840ac-66fb-4192-a182-c574bf9a9e45', 'c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc', 'b12183ef-24b5-400a-81ad-0d7584b7a517', '2026-06-10 23:34:10.433');
INSERT INTO public."Favorite" VALUES ('9262567f-8477-4a3e-bf1e-52ad915199b7', 'c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc', '108982f8-2510-4b04-817f-d1def57b92c1', '2026-06-10 23:34:11.166');


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."Order" VALUES ('1b775909-961a-4367-b130-23868dd07b6a', '66b0a068-0eb0-41f5-ac9d-7fb1bb485355', 'PROCESSING', 66.00, 'Demo User', '+7 (999) 999-99-99', 'user@vybe.com', 'Astrakhan', 'Demo street 1', 'demo order check', '2026-05-24 18:18:37.688', '2026-05-24 18:18:37.782');
INSERT INTO public."Order" VALUES ('3a0d67a6-a557-4cb2-9c0a-1bdee4e0d784', 'c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc', 'NEW', 74.00, 'lipiousss', '+7 (321) 452-92-93', 'lipiousss@vybe.com', 'izhevsk', 'pupoe', '123', '2026-05-25 08:44:44.342', '2026-05-25 08:44:44.342');
INSERT INTO public."Order" VALUES ('6ddfa58b-ac1b-4f9c-94f2-9391db0343b4', 'eebf2168-efc2-42a6-a83b-c3f6c249d9f9', 'NEW', 135.00, 'admin', '+7 (399) 999-99-42', 'admin@vybe.com', '32', '32', '32', '2026-05-26 10:06:43.488', '2026-05-26 10:06:43.488');
INSERT INTO public."Order" VALUES ('099cb25a-28d7-4cc8-b22c-2acb664060d8', 'd77e6950-48cc-4cf9-a41a-b8be5d9b071a', 'NEW', 69.00, 'Stock Check', '+7 (999) 999-99-99', 'stockcheck95156@vybe.test', 'Astrakhan', 'Demo street 1', 'Automated stock check', '2026-05-26 11:32:37.046', '2026-05-26 11:32:37.046');
INSERT INTO public."Order" VALUES ('4e7f2461-d9b7-4993-b4ee-ab0440e04196', 'eebf2168-efc2-42a6-a83b-c3f6c249d9f9', 'NEW', 41437.00, 'admin', '+7 (543) 534-53-45', 'admin@vybe.com', 'izhevsk', 'ipek', '12345', '2026-06-10 23:10:27.504', '2026-06-10 23:10:27.504');
INSERT INTO public."Order" VALUES ('b73b9078-123a-48ea-a04d-b23257929876', 'c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc', 'NEW', 21302.00, 'lipiousss', '+7 (423) 423-42-34', 'lipiousss@vybe.com', 'fgdfg', 'gdfsg', 'gdf', '2026-06-10 23:34:25.097', '2026-06-10 23:34:25.097');


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."OrderItem" VALUES ('df4d290e-fd95-48be-94d2-0ebd3d4edd57', '4e7f2461-d9b7-4993-b4ee-ab0440e04196', '108982f8-2510-4b04-817f-d1def57b92c1', NULL, 3, 9995.00);
INSERT INTO public."OrderItem" VALUES ('e86f53f9-f53f-4137-b18d-c04ae777a3bc', '4e7f2461-d9b7-4993-b4ee-ab0440e04196', 'b12183ef-24b5-400a-81ad-0d7584b7a517', '7113ca24-57ce-4ebd-88f3-b98f7325d1c6', 1, 5152.00);
INSERT INTO public."OrderItem" VALUES ('9675cb51-ef49-44a5-ac35-0b65627c5548', '4e7f2461-d9b7-4993-b4ee-ab0440e04196', '4b3c9722-b3b5-46b0-be2a-93944878a18e', 'b4886ae2-41a8-4a22-a541-a16e9e9f1f8d', 1, 6300.00);
INSERT INTO public."OrderItem" VALUES ('dfdeaa9e-6172-4311-9b38-061fc7178374', 'b73b9078-123a-48ea-a04d-b23257929876', 'c2cd2de4-e594-4188-abc4-c2b33a90c94d', NULL, 1, 16150.00);
INSERT INTO public."OrderItem" VALUES ('e545f477-68e6-405a-b400-acdb5f5a7aa7', 'b73b9078-123a-48ea-a04d-b23257929876', 'b12183ef-24b5-400a-81ad-0d7584b7a517', '7113ca24-57ce-4ebd-88f3-b98f7325d1c6', 1, 5152.00);


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."Product" VALUES ('b12183ef-24b5-400a-81ad-0d7584b7a517', 'Blue Eclipse Keycap Set', 'blue-eclipse-keycap-set', 'Blue Eclipse Keycap Set: VYBE dark fantasy seed product.', 5600.00, 6500.00, 'PERCENT', 8.00, 5152.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'PBT plastic', 'Black / Gold', false, false, true, false, '{"style": "dark fantasy", "category": "keycaps", "seedVersion": 2}', 'c4aeedfa-51ab-40d4-9118-84e26d860bec', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.089', '2026-06-10 22:36:01.714');
INSERT INTO public."Product" VALUES ('108982f8-2510-4b04-817f-d1def57b92c1', 'legend mouse', 'legend-mouse', '1C perfomance', 10000.00, 11000.00, 'FIXED', 5.00, 9995.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'rezina', '3', true, false, false, false, '{"origin": "VYBE archive"}', '10fc9265-eec9-4c01-b5b5-ce7e848d463e', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 04:13:12.13', '2026-06-10 22:41:36.127');
INSERT INTO public."Product" VALUES ('585f5686-8d51-4bcd-8310-912771ef2508', 'Nocturne Hood', 'nocturne-hood', 'Nocturne Hood: VYBE dark fantasy seed product.', 79.00, NULL, 'NONE', 0.00, 79.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Wool blend', 'Black', true, false, true, false, '{"style": "dark fantasy", "category": "headwear", "seedVersion": 2}', '440df1fa-f170-4fe4-bb10-93e027985972', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:46.952', '2026-05-28 03:58:46.952');
INSERT INTO public."Product" VALUES ('1e13c5f8-3f6a-4a0a-9d4e-8c94418ec779', 'Ash Veil Beanie', 'ash-veil-beanie', 'Ash Veil Beanie: VYBE dark fantasy seed product.', 49.00, 59.00, 'PERCENT', 10.00, 44.10, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Wool blend', 'Black', false, true, false, false, '{"style": "dark fantasy", "category": "headwear", "seedVersion": 2}', '440df1fa-f170-4fe4-bb10-93e027985972', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:46.957', '2026-05-28 03:58:46.957');
INSERT INTO public."Product" VALUES ('aa8ed5df-9b59-4542-871e-77e22af66d0b', 'Ashborn Jacket', 'ashborn-jacket', 'Ashborn Jacket: VYBE dark fantasy seed product.', 249.00, NULL, 'NONE', 0.00, 249.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Waxed cotton', 'Ash black', false, false, true, false, '{"style": "dark fantasy", "category": "jackets", "seedVersion": 2}', '3ab9e877-c95a-49d3-80fe-f736978a91b2', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:46.962', '2026-05-28 03:58:46.962');
INSERT INTO public."Product" VALUES ('801cd2b8-1532-4f5c-bc5d-860feef707bb', 'Obsidian Rider Coat', 'obsidian-rider-coat', 'Obsidian Rider Coat: VYBE dark fantasy seed product.', 299.00, 349.00, 'FIXED', 40.00, 259.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Waxed cotton', 'Ash black', true, true, false, false, '{"style": "dark fantasy", "category": "jackets", "seedVersion": 2}', '3ab9e877-c95a-49d3-80fe-f736978a91b2', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:46.966', '2026-05-28 03:58:46.966');
INSERT INTO public."Product" VALUES ('b1db0677-d552-4a1d-b893-7210b03cb8ec', 'Blue Eclipse Zip Hoodie', 'blue-eclipse-zip-hoodie', 'Blue Eclipse Zip Hoodie: VYBE dark fantasy seed product.', 139.00, NULL, 'NONE', 0.00, 139.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Heavy cotton fleece', 'Blue black', true, false, true, false, '{"style": "dark fantasy", "category": "zip-hoodies", "seedVersion": 2}', '54ce477a-3226-4259-aae5-e633a03ba178', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:46.97', '2026-05-28 03:58:46.97');
INSERT INTO public."Product" VALUES ('646d42d2-efe0-4a2b-b72c-fdcf47fce748', 'Night Sigil Zip Hoodie', 'night-sigil-zip-hoodie', 'Night Sigil Zip Hoodie: VYBE dark fantasy seed product.', 129.00, 149.00, 'PERCENT', 15.00, 109.65, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Heavy cotton fleece', 'Blue black', false, true, false, false, '{"style": "dark fantasy", "category": "zip-hoodies", "seedVersion": 2}', '54ce477a-3226-4259-aae5-e633a03ba178', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:46.975', '2026-05-28 03:58:46.975');
INSERT INTO public."Product" VALUES ('882b7cc8-dca6-4179-97e8-b54b21349529', 'Ritual Knit Sweater', 'ritual-knit-sweater', 'Ritual Knit Sweater: VYBE dark fantasy seed product.', 119.00, NULL, 'NONE', 0.00, 119.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Knit cotton', 'Charcoal', false, false, true, false, '{"style": "dark fantasy", "category": "sweaters", "seedVersion": 2}', '68eddbc8-2960-47d8-aa1b-ef80968119c7', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:46.978', '2026-05-28 03:58:46.978');
INSERT INTO public."Product" VALUES ('89d7662c-883e-4740-8a7e-ba7ca7460923', 'Moonless Pullover', 'moonless-pullover', 'Moonless Pullover: VYBE dark fantasy seed product.', 109.00, 129.00, 'FIXED', 20.00, 89.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Knit cotton', 'Charcoal', true, false, false, false, '{"style": "dark fantasy", "category": "sweaters", "seedVersion": 2}', '68eddbc8-2960-47d8-aa1b-ef80968119c7', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:46.982', '2026-05-28 03:58:46.982');
INSERT INTO public."Product" VALUES ('d69092a4-492c-431a-8651-2907344fc172', 'Relic Denim', 'relic-denim', 'Relic Denim: VYBE dark fantasy seed product.', 129.00, NULL, 'NONE', 0.00, 129.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Denim', 'Washed black', false, false, true, false, '{"style": "dark fantasy", "category": "jeans", "seedVersion": 2}', '5911928d-0e6e-4253-8e6c-40b38514f240', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:46.986', '2026-05-28 03:58:46.986');
INSERT INTO public."Product" VALUES ('81d86898-0787-4f71-ab96-802fbda7e834', 'Gravewash Jeans', 'gravewash-jeans', 'Gravewash Jeans: VYBE dark fantasy seed product.', 139.00, 159.00, 'PERCENT', 10.00, 125.10, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Denim', 'Washed black', false, true, false, false, '{"style": "dark fantasy", "category": "jeans", "seedVersion": 2}', '5911928d-0e6e-4253-8e6c-40b38514f240', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:46.989', '2026-05-28 03:58:46.989');
INSERT INTO public."Product" VALUES ('18292f34-5f09-44eb-994a-0a174c127313', 'Nocturne Cargo Pants', 'nocturne-cargo-pants', 'Nocturne Cargo Pants: VYBE dark fantasy seed product.', 134.00, NULL, 'NONE', 0.00, 134.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Ripstop cotton', 'Black', true, false, false, false, '{"style": "dark fantasy", "category": "pants", "seedVersion": 2}', '9f8ebf0f-0b54-4328-b39e-e9e0ee7b3e63', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:46.993', '2026-05-28 03:58:46.993');
INSERT INTO public."Product" VALUES ('022cc584-b175-44e3-8abc-fc27f012d39c', 'Ash Trail Trousers', 'ash-trail-trousers', 'Ash Trail Trousers: VYBE dark fantasy seed product.', 124.00, 144.00, 'FIXED', 15.00, 109.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Ripstop cotton', 'Black', false, false, true, false, '{"style": "dark fantasy", "category": "pants", "seedVersion": 2}', '9f8ebf0f-0b54-4328-b39e-e9e0ee7b3e63', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:46.997', '2026-05-28 03:58:46.997');
INSERT INTO public."Product" VALUES ('9128a3f4-9ec0-4714-8d77-7dae6d329c4b', 'Nightwalker Boots', 'nightwalker-boots', 'Nightwalker Boots: VYBE dark fantasy seed product.', 219.00, NULL, 'NONE', 0.00, 219.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Leather', 'Black', false, true, true, false, '{"style": "dark fantasy", "category": "shoes", "seedVersion": 2}', 'a0339050-13b2-4368-b875-c68a4e10f58b', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47', '2026-05-28 03:58:47');
INSERT INTO public."Product" VALUES ('7b9e96a5-7a23-47e7-884c-f20994dbc18d', 'Black Altar Sneakers', 'black-altar-sneakers', 'Black Altar Sneakers: VYBE dark fantasy seed product.', 179.00, 199.00, 'PERCENT', 10.00, 161.10, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Leather', 'Black', true, false, false, false, '{"style": "dark fantasy", "category": "shoes", "seedVersion": 2}', 'a0339050-13b2-4368-b875-c68a4e10f58b', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.004', '2026-05-28 03:58:47.004');
INSERT INTO public."Product" VALUES ('17e90a42-316b-4eef-b152-2040f413b03f', 'Eclipse Gloves', 'eclipse-gloves', 'Eclipse Gloves: VYBE dark fantasy seed product.', 64.00, NULL, 'NONE', 0.00, 64.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Synthetic leather', 'Black', false, false, true, false, '{"style": "dark fantasy", "category": "gloves", "seedVersion": 2}', '3f993ec4-f464-4e22-ba5d-f1eb99716f31', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.008', '2026-05-28 03:58:47.008');
INSERT INTO public."Product" VALUES ('f4e0b208-ea67-4dbc-9fb9-dd439be2ddd6', 'Ash Ritual Gloves', 'ash-ritual-gloves', 'Ash Ritual Gloves: VYBE dark fantasy seed product.', 59.00, 69.00, 'FIXED', 8.00, 51.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Synthetic leather', 'Black', false, true, false, false, '{"style": "dark fantasy", "category": "gloves", "seedVersion": 2}', '3f993ec4-f464-4e22-ba5d-f1eb99716f31', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.011', '2026-05-28 03:58:47.011');
INSERT INTO public."Product" VALUES ('de1bb412-bbee-4eb9-8f1d-5cc20d914d73', 'Rune Carrier Bag', 'rune-carrier-bag', 'Rune Carrier Bag: VYBE dark fantasy seed product.', 98.00, NULL, 'NONE', 0.00, 98.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Canvas', 'Black', false, false, true, false, '{"style": "dark fantasy", "category": "bags", "seedVersion": 2}', 'e407cc4c-b861-4782-a304-3e26248e175f', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47.015', '2026-05-28 03:58:47.015');
INSERT INTO public."Product" VALUES ('22378ce0-2d6b-40ab-b227-33a6b5063d65', 'Cathedral Sling Bag', 'cathedral-sling-bag', 'Cathedral Sling Bag: VYBE dark fantasy seed product.', 89.00, 109.00, 'PERCENT', 15.00, 75.65, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Canvas', 'Black', true, false, false, false, '{"style": "dark fantasy", "category": "bags", "seedVersion": 2}', 'e407cc4c-b861-4782-a304-3e26248e175f', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.018', '2026-05-28 03:58:47.018');
INSERT INTO public."Product" VALUES ('5479cfbd-752f-4390-9998-d3101e4aba5e', 'Ancient Chain Pendant', 'ancient-chain-pendant', 'Ancient Chain Pendant: VYBE dark fantasy seed product.', 54.00, NULL, 'NONE', 0.00, 54.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Stainless steel', 'Ancient silver', false, false, true, false, '{"style": "dark fantasy", "category": "pendants", "seedVersion": 2}', '5ecdf40e-a814-48a1-a240-aaad644e63b9', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.021', '2026-05-28 03:58:47.021');
INSERT INTO public."Product" VALUES ('fdfcbb3f-0631-4bf2-a23a-22ff41d82a10', 'Moon Shard Pendant', 'moon-shard-pendant', 'Moon Shard Pendant: VYBE dark fantasy seed product.', 58.00, 68.00, 'FIXED', 10.00, 48.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Stainless steel', 'Ancient silver', true, false, false, false, '{"style": "dark fantasy", "category": "pendants", "seedVersion": 2}', '5ecdf40e-a814-48a1-a240-aaad644e63b9', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.024', '2026-05-28 03:58:47.024');
INSERT INTO public."Product" VALUES ('e5e09800-82f3-47ee-aefe-8f15fe53ee1d', 'Iron Oath Bracelet', 'iron-oath-bracelet', 'Iron Oath Bracelet: VYBE dark fantasy seed product.', 49.00, NULL, 'NONE', 0.00, 49.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Steel and cord', 'Black / Gold', false, true, false, false, '{"style": "dark fantasy", "category": "bracelets", "seedVersion": 2}', '42ac7383-d2a9-4b1d-b2a9-5ab9e436b1d3', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47.028', '2026-05-28 03:58:47.028');
INSERT INTO public."Product" VALUES ('e9905be0-dc31-4e78-b0d7-63e250076f5b', 'Ash Relic Cuff', 'ash-relic-cuff', 'Ash Relic Cuff: VYBE dark fantasy seed product.', 52.00, 62.00, 'PERCENT', 10.00, 46.80, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Steel and cord', 'Black / Gold', false, false, true, false, '{"style": "dark fantasy", "category": "bracelets", "seedVersion": 2}', '42ac7383-d2a9-4b1d-b2a9-5ab9e436b1d3', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.031', '2026-05-28 03:58:47.031');
INSERT INTO public."Product" VALUES ('f1f3e963-0a0d-4dd2-a890-38fa038d4dd8', 'Night Bell Earrings', 'night-bell-earrings', 'Night Bell Earrings: VYBE dark fantasy seed product.', 42.00, NULL, 'NONE', 0.00, 42.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Steel', 'Silver', true, false, false, false, '{"style": "dark fantasy", "category": "earrings", "seedVersion": 2}', '2d095ca3-f689-447b-adba-738e1f093cc7', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.034', '2026-05-28 03:58:47.034');
INSERT INTO public."Product" VALUES ('721666b1-0d5b-4ad6-9de0-8051ed68b81b', 'Blue Eclipse Ear Cuffs', 'blue-eclipse-ear-cuffs', 'Blue Eclipse Ear Cuffs: VYBE dark fantasy seed product.', 46.00, 56.00, 'FIXED', 8.00, 38.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Steel', 'Silver', false, false, true, false, '{"style": "dark fantasy", "category": "earrings", "seedVersion": 2}', '2d095ca3-f689-447b-adba-738e1f093cc7', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.037', '2026-05-28 03:58:47.037');
INSERT INTO public."Product" VALUES ('3ddd73ed-666d-4274-81ba-78a93b340d37', 'Silent Cathedral Poster', 'silent-cathedral-poster', 'Silent Cathedral Poster: VYBE dark fantasy seed product.', 29.00, NULL, 'NONE', 0.00, 29.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Matte paper', 'Black / Blue', false, false, true, false, '{"style": "dark fantasy", "category": "posters", "seedVersion": 2}', '806dbec8-b90c-4bc7-bdb3-d4b8bb64121b', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47.04', '2026-05-28 03:58:47.04');
INSERT INTO public."Product" VALUES ('21bb0fc9-7d4e-4931-a70c-65348dee1203', 'Ash Gate Poster', 'ash-gate-poster', 'Ash Gate Poster: VYBE dark fantasy seed product.', 32.00, 39.00, 'PERCENT', 10.00, 28.80, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Matte paper', 'Black / Blue', true, false, false, false, '{"style": "dark fantasy", "category": "posters", "seedVersion": 2}', '806dbec8-b90c-4bc7-bdb3-d4b8bb64121b', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.043', '2026-05-28 03:58:47.043');
INSERT INTO public."Product" VALUES ('dcf518d8-f6ab-4d3b-901c-b2fb32554758', 'Ancient Idol Statue', 'ancient-idol-statue', 'Ancient Idol Statue: VYBE dark fantasy seed product.', 129.00, NULL, 'NONE', 0.00, 129.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Resin', 'Obsidian', false, true, false, false, '{"style": "dark fantasy", "category": "statues", "seedVersion": 2}', '196b183c-03fa-4f29-9f32-afa008050e6a', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.047', '2026-05-28 03:58:47.047');
INSERT INTO public."Product" VALUES ('8b2fa62f-0f3c-492e-9713-d77f064835ae', 'Moonlit Gargoyle Statue', 'moonlit-gargoyle-statue', 'Moonlit Gargoyle Statue: VYBE dark fantasy seed product.', 119.00, 149.00, 'FIXED', 20.00, 99.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Resin', 'Obsidian', false, false, true, false, '{"style": "dark fantasy", "category": "statues", "seedVersion": 2}', '196b183c-03fa-4f29-9f32-afa008050e6a', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.05', '2026-05-28 03:58:47.05');
INSERT INTO public."Product" VALUES ('55f22a89-e432-4d1d-8034-8804a4f0c741', 'Ritual Display Mannequin', 'ritual-display-mannequin', 'Ritual Display Mannequin: VYBE dark fantasy seed product.', 199.00, NULL, 'NONE', 0.00, 199.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Resin composite', 'Ash white', false, false, true, false, '{"style": "dark fantasy", "category": "mannequins", "seedVersion": 2}', '9e062d62-2ee8-44bf-9a7b-3c25904458f7', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47.053', '2026-05-28 03:58:47.053');
INSERT INTO public."Product" VALUES ('008157a2-416e-48ce-8a39-c5484fb4e17b', 'Black Veil Bust', 'black-veil-bust', 'Black Veil Bust: VYBE dark fantasy seed product.', 159.00, 189.00, 'PERCENT', 10.00, 143.10, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Resin composite', 'Ash white', false, true, false, false, '{"style": "dark fantasy", "category": "mannequins", "seedVersion": 2}', '9e062d62-2ee8-44bf-9a7b-3c25904458f7', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.056', '2026-05-28 03:58:47.056');
INSERT INTO public."Product" VALUES ('66bb50e7-af78-4e9e-8c7c-13529bbf8023', 'Moonlit Desk Mat', 'moonlit-desk-mat', 'Moonlit Desk Mat: VYBE dark fantasy seed product.', 39.00, NULL, 'NONE', 0.00, 39.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Cloth rubber', 'Blue black', true, false, true, false, '{"style": "dark fantasy", "category": "mouse-pads", "seedVersion": 2}', '2b6bcb8f-52df-4341-b65c-99dc34b2c922', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.059', '2026-05-28 03:58:47.059');
INSERT INTO public."Product" VALUES ('fc29eaff-d53f-4be5-9008-2b503e6fe996', 'Eclipse Mouse Pad', 'eclipse-mouse-pad', 'Eclipse Mouse Pad: VYBE dark fantasy seed product.', 34.00, 44.00, 'FIXED', 5.00, 29.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Cloth rubber', 'Blue black', false, true, false, false, '{"style": "dark fantasy", "category": "mouse-pads", "seedVersion": 2}', '2b6bcb8f-52df-4341-b65c-99dc34b2c922', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.062', '2026-05-28 03:58:47.062');
INSERT INTO public."Product" VALUES ('1a619b54-64b1-480c-b259-6555553153f1', 'Glass Moon Desk Slab', 'glass-moon-desk-slab', 'Glass Moon Desk Slab: VYBE dark fantasy seed product.', 89.00, NULL, 'NONE', 0.00, 89.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Tempered glass', 'Black glass', false, false, true, false, '{"style": "dark fantasy", "category": "glass-mouse-pads", "seedVersion": 2}', 'b6ae1bba-94ef-43b2-9d02-9a452968cdc2', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47.066', '2026-05-28 03:58:47.066');
INSERT INTO public."Product" VALUES ('763eef1a-a22c-49ca-9052-6e85b9ebb413', 'Obsidian Glass Mat', 'obsidian-glass-mat', 'Obsidian Glass Mat: VYBE dark fantasy seed product.', 99.00, 119.00, 'PERCENT', 10.00, 89.10, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Tempered glass', 'Black glass', true, false, false, false, '{"style": "dark fantasy", "category": "glass-mouse-pads", "seedVersion": 2}', 'b6ae1bba-94ef-43b2-9d02-9a452968cdc2', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.069', '2026-05-28 03:58:47.069');
INSERT INTO public."Product" VALUES ('447cdae8-f666-4b96-b0b8-0f031e5dce2f', 'Nightcrawler Mouse', 'nightcrawler-mouse', 'Nightcrawler Mouse: VYBE dark fantasy seed product.', 79.00, NULL, 'NONE', 0.00, 79.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'ABS plastic', 'Black', false, false, true, false, '{"style": "dark fantasy", "category": "mice", "seedVersion": 2}', '10fc9265-eec9-4c01-b5b5-ce7e848d463e', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.072', '2026-05-28 03:58:47.072');
INSERT INTO public."Product" VALUES ('1e267f72-6cea-4116-9a9c-cc300bf6e9a8', 'Blue Eclipse Mouse', 'blue-eclipse-mouse', 'Blue Eclipse Mouse: VYBE dark fantasy seed product.', 89.00, 109.00, 'FIXED', 15.00, 74.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'ABS plastic', 'Black', false, true, false, false, '{"style": "dark fantasy", "category": "mice", "seedVersion": 2}', '10fc9265-eec9-4c01-b5b5-ce7e848d463e', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.076', '2026-05-28 03:58:47.076');
INSERT INTO public."Product" VALUES ('e6522688-eb0a-4570-a699-399af75017a9', 'Cathedral Keyboard', 'cathedral-keyboard', 'Cathedral Keyboard: VYBE dark fantasy seed product.', 159.00, NULL, 'NONE', 0.00, 159.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Aluminum', 'Black', false, false, true, false, '{"style": "dark fantasy", "category": "keyboards", "seedVersion": 2}', 'e1202a6a-cee0-496a-ad7e-0e84de647f14', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47.079', '2026-05-28 03:58:47.079');
INSERT INTO public."Product" VALUES ('af92bd61-9df0-4cf4-80e4-b60e1d9260a8', 'Ash Relic Keyboard', 'ash-relic-keyboard', 'Ash Relic Keyboard: VYBE dark fantasy seed product.', 179.00, 209.00, 'PERCENT', 10.00, 161.10, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Aluminum', 'Black', true, false, false, false, '{"style": "dark fantasy", "category": "keyboards", "seedVersion": 2}', 'e1202a6a-cee0-496a-ad7e-0e84de647f14', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.082', '2026-05-28 03:58:47.082');
INSERT INTO public."Product" VALUES ('4b3c9722-b3b5-46b0-be2a-93944878a18e', 'Ancient Rune Keycaps', 'ancient-rune-keycaps', 'Ancient Rune Keycaps: VYBE dark fantasy seed product.', 6300.00, 8000.00, 'NONE', 0.00, 6300.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'PBT plastic', 'Black / Gold', false, true, false, false, '{"style": "dark fantasy", "category": "keycaps", "seedVersion": 2}', 'c4aeedfa-51ab-40d4-9118-84e26d860bec', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.086', '2026-06-10 22:39:56.277');
INSERT INTO public."Product" VALUES ('c5cb2df5-e36d-4683-8e80-66eb8f307ac9', 'Ritual Sticker Pack', 'ritual-sticker-pack', 'Ritual Sticker Pack: VYBE dark fantasy seed product.', 19.00, NULL, 'NONE', 0.00, 19.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Vinyl', 'Mixed', true, false, false, true, '{"style": "dark fantasy", "category": "sticker-packs", "seedVersion": 2}', '497767f2-14c0-4994-b35e-b4355e675bae', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47.093', '2026-05-28 03:58:47.093');
INSERT INTO public."Product" VALUES ('36a3c08a-2edd-4949-962c-d1da821a55a7', 'Ash Relic Sticker Pack', 'ash-relic-sticker-pack', 'Ash Relic Sticker Pack: VYBE dark fantasy seed product.', 22.00, 29.00, 'PERCENT', 10.00, 19.80, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Vinyl', 'Mixed', false, true, false, true, '{"style": "dark fantasy", "category": "sticker-packs", "seedVersion": 2}', '497767f2-14c0-4994-b35e-b4355e675bae', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.096', '2026-05-28 03:58:47.096');
INSERT INTO public."Product" VALUES ('61f3d2aa-f540-47ff-910c-7be125bb1227', 'Night Archive Art Book', 'night-archive-art-book', 'Night Archive Art Book: VYBE dark fantasy seed product.', 59.00, NULL, 'NONE', 0.00, 59.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Printed book', 'Black', false, false, true, true, '{"style": "dark fantasy", "category": "art-books", "seedVersion": 2}', 'da8c5f2a-b07e-4389-a7c7-aedc2ec66d24', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.1', '2026-05-28 03:58:47.1');
INSERT INTO public."Product" VALUES ('7b67f945-9574-442e-9154-374db2a5eb7f', 'Blue Eclipse Codex', 'blue-eclipse-codex', 'Blue Eclipse Codex: VYBE dark fantasy seed product.', 69.00, 79.00, 'FIXED', 10.00, 59.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Printed book', 'Black', false, true, false, true, '{"style": "dark fantasy", "category": "art-books", "seedVersion": 2}', 'da8c5f2a-b07e-4389-a7c7-aedc2ec66d24', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.103', '2026-05-28 03:58:47.103');
INSERT INTO public."Product" VALUES ('5dc5aa2c-70fa-4c05-bb3c-20844d27659f', 'Archive Figure', 'archive-figure', 'Archive Figure: VYBE dark fantasy seed product.', 89.00, NULL, 'NONE', 0.00, 89.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Resin', 'Painted', false, false, true, true, '{"style": "dark fantasy", "category": "figures", "seedVersion": 2}', '2d389f5d-608f-4fad-b3a3-cf3d9f7ef6ce', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47.106', '2026-05-28 03:58:47.106');
INSERT INTO public."Product" VALUES ('0e06dd45-e065-4529-819b-6685093c06bf', 'Blue Eclipse Figure', 'blue-eclipse-figure', 'Blue Eclipse Figure: VYBE dark fantasy seed product.', 99.00, 119.00, 'PERCENT', 10.00, 89.10, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Resin', 'Painted', false, true, false, true, '{"style": "dark fantasy", "category": "figures", "seedVersion": 2}', '2d389f5d-608f-4fad-b3a3-cf3d9f7ef6ce', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.11', '2026-05-28 03:58:47.11');
INSERT INTO public."Product" VALUES ('b1f40341-0940-4f24-95aa-db5f2a8f7a97', 'Ancient Gold Card Set', 'ancient-gold-card-set', 'Ancient Gold Card Set: VYBE dark fantasy seed product.', 29.00, NULL, 'NONE', 0.00, 29.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Cardstock', 'Mixed', true, false, false, true, '{"style": "dark fantasy", "category": "cards", "seedVersion": 2}', '4acab146-501e-4f90-8919-ac3fa50e9f55', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.113', '2026-05-28 03:58:47.113');
INSERT INTO public."Product" VALUES ('0e409198-8c1a-46c8-b85e-718902f01139', 'Night Oracle Cards', 'night-oracle-cards', 'Night Oracle Cards: VYBE dark fantasy seed product.', 34.00, 44.00, 'FIXED', 5.00, 29.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Cardstock', 'Mixed', false, true, false, true, '{"style": "dark fantasy", "category": "cards", "seedVersion": 2}', '4acab146-501e-4f90-8919-ac3fa50e9f55', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.116', '2026-05-28 03:58:47.116');
INSERT INTO public."Product" VALUES ('ad8bcb55-38b8-432a-a03c-7d9f256ff1ed', 'Obsidian Patch Set', 'obsidian-patch-set', 'Obsidian Patch Set: VYBE dark fantasy seed product.', 24.00, NULL, 'NONE', 0.00, 24.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Embroidered fabric', 'Black / Gold', false, false, true, true, '{"style": "dark fantasy", "category": "patches", "seedVersion": 2}', 'c93884d0-3944-40eb-a660-5527bae4148f', '2a130c07-f0b8-40e2-8d4e-ce63bf9aeb39', '2026-05-28 03:58:47.12', '2026-05-28 03:58:47.12');
INSERT INTO public."Product" VALUES ('25449c9d-0181-4d46-b25b-6bbece6b5df7', 'Ash Sigil Patches', 'ash-sigil-patches', 'Ash Sigil Patches: VYBE dark fantasy seed product.', 27.00, 34.00, 'PERCENT', 10.00, 24.30, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Embroidered fabric', 'Black / Gold', false, true, false, true, '{"style": "dark fantasy", "category": "patches", "seedVersion": 2}', 'c93884d0-3944-40eb-a660-5527bae4148f', 'b3a0a377-d5c5-44ee-a076-5c3fe62610d2', '2026-05-28 03:58:47.124', '2026-05-28 03:58:47.124');
INSERT INTO public."Product" VALUES ('caf810bf-86a9-45e3-8a91-a2968abfd333', 'Limited Relic Box', 'limited-relic-box', 'Limited Relic Box: VYBE dark fantasy seed product.', 149.00, NULL, 'NONE', 0.00, 149.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Mixed media', 'Black / Gold', false, true, true, true, '{"style": "dark fantasy", "category": "limited-boxes", "seedVersion": 2}', 'eee6be6c-6fb5-471f-9f1b-fa1d1a4e8392', '90eb1200-30b0-405e-a834-fd9c4583cbfa', '2026-05-28 03:58:47.127', '2026-05-28 03:58:47.127');
INSERT INTO public."Product" VALUES ('953f7dbb-427a-49df-b53c-68d11487c70a', 'Ancient Gold Mystery Box', 'ancient-gold-mystery-box', 'Ancient Gold Mystery Box: VYBE dark fantasy seed product.', 169.00, 199.00, 'FIXED', 20.00, 149.00, 'ACTIVE', 'VYBE', 'VYBE Studio', 'Mixed media', 'Black / Gold', true, true, false, true, '{"style": "dark fantasy", "category": "limited-boxes", "seedVersion": 2}', 'eee6be6c-6fb5-471f-9f1b-fa1d1a4e8392', '768fa59c-6180-4cae-9a98-dc5ddf23477d', '2026-05-28 03:58:47.131', '2026-05-28 03:58:47.131');
INSERT INTO public."Product" VALUES ('c2cd2de4-e594-4188-abc4-c2b33a90c94d', 'legen keyboard and rei', 'legen-keyboard-and-rei', '12', 16150.00, NULL, 'NONE', 0.00, 16150.00, 'ACTIVE', 'VYBE', 'VYBE Studio', NULL, '12', true, false, false, false, '{"origin": "VYBE archive"}', '72a98d84-6a3e-418e-af67-0b7d1c277dfd', NULL, '2026-05-28 04:03:08.06', '2026-06-10 22:43:13.211');


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."ProductImage" VALUES ('52675498-f194-493e-a81f-b4bc1e774f53', '108982f8-2510-4b04-817f-d1def57b92c1', '/uploads/products/product-eebf2168-efc2-42a6-a83b-c3f6c249d9f9-1781131294805.jpg', 'legend mouse', 0);
INSERT INTO public."ProductImage" VALUES ('d09920fb-be15-4c10-93a6-50c3270528a0', '585f5686-8d51-4bcd-8310-912771ef2508', '/images/placeholders/product-placeholder.png', 'Nocturne Hood', 0);
INSERT INTO public."ProductImage" VALUES ('87da5777-667e-4f0c-953d-8bee72d2f1c9', '1e13c5f8-3f6a-4a0a-9d4e-8c94418ec779', '/images/placeholders/product-placeholder.png', 'Ash Veil Beanie', 0);
INSERT INTO public."ProductImage" VALUES ('ca0120cf-d954-480a-8d59-dd1317ff8295', 'aa8ed5df-9b59-4542-871e-77e22af66d0b', '/images/placeholders/product-placeholder.png', 'Ashborn Jacket', 0);
INSERT INTO public."ProductImage" VALUES ('3a72a526-49e4-4f8c-82b8-f29f01058404', '801cd2b8-1532-4f5c-bc5d-860feef707bb', '/images/placeholders/product-placeholder.png', 'Obsidian Rider Coat', 0);
INSERT INTO public."ProductImage" VALUES ('a86c1340-42c4-4ea2-a45b-793938d1475e', 'b1db0677-d552-4a1d-b893-7210b03cb8ec', '/images/placeholders/product-placeholder.png', 'Blue Eclipse Zip Hoodie', 0);
INSERT INTO public."ProductImage" VALUES ('4c0925c8-c702-4bd2-b2f8-61fa25096d59', '646d42d2-efe0-4a2b-b72c-fdcf47fce748', '/images/placeholders/product-placeholder.png', 'Night Sigil Zip Hoodie', 0);
INSERT INTO public."ProductImage" VALUES ('6f070c4a-cd58-483b-b8fb-b5b516b164fb', '882b7cc8-dca6-4179-97e8-b54b21349529', '/images/placeholders/product-placeholder.png', 'Ritual Knit Sweater', 0);
INSERT INTO public."ProductImage" VALUES ('017c1087-7a85-49e9-989b-9d9e35b12233', '89d7662c-883e-4740-8a7e-ba7ca7460923', '/images/placeholders/product-placeholder.png', 'Moonless Pullover', 0);
INSERT INTO public."ProductImage" VALUES ('168b1a37-c0ae-4674-b155-b2ed740c444d', 'd69092a4-492c-431a-8651-2907344fc172', '/images/placeholders/product-placeholder.png', 'Relic Denim', 0);
INSERT INTO public."ProductImage" VALUES ('d1a901a8-add8-4409-bf18-af81a73a4241', '81d86898-0787-4f71-ab96-802fbda7e834', '/images/placeholders/product-placeholder.png', 'Gravewash Jeans', 0);
INSERT INTO public."ProductImage" VALUES ('01ca2a1c-d3b0-4746-8dd1-07ff7808e616', '18292f34-5f09-44eb-994a-0a174c127313', '/images/placeholders/product-placeholder.png', 'Nocturne Cargo Pants', 0);
INSERT INTO public."ProductImage" VALUES ('2e417a45-0752-48db-8c7b-7163b405d6eb', '022cc584-b175-44e3-8abc-fc27f012d39c', '/images/placeholders/product-placeholder.png', 'Ash Trail Trousers', 0);
INSERT INTO public."ProductImage" VALUES ('06dab52c-9a43-448e-86f2-09e4ea0ff528', '9128a3f4-9ec0-4714-8d77-7dae6d329c4b', '/images/placeholders/product-placeholder.png', 'Nightwalker Boots', 0);
INSERT INTO public."ProductImage" VALUES ('7d3a77c2-808f-4bf5-96c9-5b2e9a268806', '7b9e96a5-7a23-47e7-884c-f20994dbc18d', '/images/placeholders/product-placeholder.png', 'Black Altar Sneakers', 0);
INSERT INTO public."ProductImage" VALUES ('b5ac3469-c488-4fbf-a010-b3fe9aab24b6', '17e90a42-316b-4eef-b152-2040f413b03f', '/images/placeholders/product-placeholder.png', 'Eclipse Gloves', 0);
INSERT INTO public."ProductImage" VALUES ('e40c2717-3faa-4efd-a71d-d57b17636353', 'f4e0b208-ea67-4dbc-9fb9-dd439be2ddd6', '/images/placeholders/product-placeholder.png', 'Ash Ritual Gloves', 0);
INSERT INTO public."ProductImage" VALUES ('d5665b92-c045-4075-b676-43f442054bee', 'de1bb412-bbee-4eb9-8f1d-5cc20d914d73', '/images/placeholders/product-placeholder.png', 'Rune Carrier Bag', 0);
INSERT INTO public."ProductImage" VALUES ('57cf9120-131c-4562-9b50-0dddbb2e0e06', '22378ce0-2d6b-40ab-b227-33a6b5063d65', '/images/placeholders/product-placeholder.png', 'Cathedral Sling Bag', 0);
INSERT INTO public."ProductImage" VALUES ('9d3d8af8-7248-43f9-a086-07e749de0c5e', '5479cfbd-752f-4390-9998-d3101e4aba5e', '/images/placeholders/product-placeholder.png', 'Ancient Chain Pendant', 0);
INSERT INTO public."ProductImage" VALUES ('bbb43420-1fc9-4ead-99cf-607c70e3b955', 'fdfcbb3f-0631-4bf2-a23a-22ff41d82a10', '/images/placeholders/product-placeholder.png', 'Moon Shard Pendant', 0);
INSERT INTO public."ProductImage" VALUES ('bde468e1-08b9-4a65-8f9c-7f3fc3ee1a12', 'e5e09800-82f3-47ee-aefe-8f15fe53ee1d', '/images/placeholders/product-placeholder.png', 'Iron Oath Bracelet', 0);
INSERT INTO public."ProductImage" VALUES ('c046facb-0896-4744-9e84-2e9c244f6254', 'e9905be0-dc31-4e78-b0d7-63e250076f5b', '/images/placeholders/product-placeholder.png', 'Ash Relic Cuff', 0);
INSERT INTO public."ProductImage" VALUES ('96d2c9b6-0041-48fa-bfc9-5571475bbf3d', 'f1f3e963-0a0d-4dd2-a890-38fa038d4dd8', '/images/placeholders/product-placeholder.png', 'Night Bell Earrings', 0);
INSERT INTO public."ProductImage" VALUES ('1662ee1d-fc95-4b2e-b94c-5547116bedc3', '721666b1-0d5b-4ad6-9de0-8051ed68b81b', '/images/placeholders/product-placeholder.png', 'Blue Eclipse Ear Cuffs', 0);
INSERT INTO public."ProductImage" VALUES ('24c73120-1dfe-4614-a898-2a595696ad76', '3ddd73ed-666d-4274-81ba-78a93b340d37', '/images/placeholders/product-placeholder.png', 'Silent Cathedral Poster', 0);
INSERT INTO public."ProductImage" VALUES ('b0e43357-a87b-417a-aff3-77b9f7588fe8', '21bb0fc9-7d4e-4931-a70c-65348dee1203', '/images/placeholders/product-placeholder.png', 'Ash Gate Poster', 0);
INSERT INTO public."ProductImage" VALUES ('0d8df1e7-d07f-4796-9df9-b479232a8b52', 'dcf518d8-f6ab-4d3b-901c-b2fb32554758', '/images/placeholders/product-placeholder.png', 'Ancient Idol Statue', 0);
INSERT INTO public."ProductImage" VALUES ('66bc3e34-3d5c-4d1c-8e8b-daf1147cc3a5', '8b2fa62f-0f3c-492e-9713-d77f064835ae', '/images/placeholders/product-placeholder.png', 'Moonlit Gargoyle Statue', 0);
INSERT INTO public."ProductImage" VALUES ('8fa51ae9-997b-4d23-8e9b-a143ed40921a', '55f22a89-e432-4d1d-8034-8804a4f0c741', '/images/placeholders/product-placeholder.png', 'Ritual Display Mannequin', 0);
INSERT INTO public."ProductImage" VALUES ('45a47763-eb8f-4ba4-8a88-6da47bcf9cde', '008157a2-416e-48ce-8a39-c5484fb4e17b', '/images/placeholders/product-placeholder.png', 'Black Veil Bust', 0);
INSERT INTO public."ProductImage" VALUES ('f463a772-5ed1-480b-83e0-ed9c3b79cbf9', '66bb50e7-af78-4e9e-8c7c-13529bbf8023', '/images/placeholders/product-placeholder.png', 'Moonlit Desk Mat', 0);
INSERT INTO public."ProductImage" VALUES ('379148e1-f378-455d-88bf-e16e33ee4c61', 'fc29eaff-d53f-4be5-9008-2b503e6fe996', '/images/placeholders/product-placeholder.png', 'Eclipse Mouse Pad', 0);
INSERT INTO public."ProductImage" VALUES ('7dfc4f3e-1d5c-4b35-9f66-798c8a729192', '1a619b54-64b1-480c-b259-6555553153f1', '/images/placeholders/product-placeholder.png', 'Glass Moon Desk Slab', 0);
INSERT INTO public."ProductImage" VALUES ('1803010b-c476-43db-bc9e-3b710ccb7947', '763eef1a-a22c-49ca-9052-6e85b9ebb413', '/images/placeholders/product-placeholder.png', 'Obsidian Glass Mat', 0);
INSERT INTO public."ProductImage" VALUES ('3ca60aa8-832c-48c6-bc02-4f28b83d887b', '447cdae8-f666-4b96-b0b8-0f031e5dce2f', '/images/placeholders/product-placeholder.png', 'Nightcrawler Mouse', 0);
INSERT INTO public."ProductImage" VALUES ('2b33046c-3544-4797-9d3c-f83b99f8bf57', '1e267f72-6cea-4116-9a9c-cc300bf6e9a8', '/images/placeholders/product-placeholder.png', 'Blue Eclipse Mouse', 0);
INSERT INTO public."ProductImage" VALUES ('1293836d-7052-4ccd-83c3-1e4f97227d0c', 'e6522688-eb0a-4570-a699-399af75017a9', '/images/placeholders/product-placeholder.png', 'Cathedral Keyboard', 0);
INSERT INTO public."ProductImage" VALUES ('29e9f772-a4ca-4060-ba8a-73b5d4a42592', 'af92bd61-9df0-4cf4-80e4-b60e1d9260a8', '/images/placeholders/product-placeholder.png', 'Ash Relic Keyboard', 0);
INSERT INTO public."ProductImage" VALUES ('5546ee85-3036-4a8d-9630-0b774ad51450', 'c5cb2df5-e36d-4683-8e80-66eb8f307ac9', '/images/placeholders/collectible-placeholder.png', 'Ritual Sticker Pack', 0);
INSERT INTO public."ProductImage" VALUES ('522fb7b9-0cd8-4e6d-a544-3dc23258d5f9', '36a3c08a-2edd-4949-962c-d1da821a55a7', '/images/placeholders/collectible-placeholder.png', 'Ash Relic Sticker Pack', 0);
INSERT INTO public."ProductImage" VALUES ('7a04723c-51e5-4d68-b46b-0b11bc256420', '61f3d2aa-f540-47ff-910c-7be125bb1227', '/images/placeholders/collectible-placeholder.png', 'Night Archive Art Book', 0);
INSERT INTO public."ProductImage" VALUES ('ebc26692-8c7a-40d1-a41c-177eb6d93da8', '7b67f945-9574-442e-9154-374db2a5eb7f', '/images/placeholders/collectible-placeholder.png', 'Blue Eclipse Codex', 0);
INSERT INTO public."ProductImage" VALUES ('b78a997a-c450-4072-af8e-b329c5c6caeb', '5dc5aa2c-70fa-4c05-bb3c-20844d27659f', '/images/placeholders/collectible-placeholder.png', 'Archive Figure', 0);
INSERT INTO public."ProductImage" VALUES ('41c56dc7-053c-49e6-ad35-a340b9a09b2f', '0e06dd45-e065-4529-819b-6685093c06bf', '/images/placeholders/collectible-placeholder.png', 'Blue Eclipse Figure', 0);
INSERT INTO public."ProductImage" VALUES ('f9a789db-e262-4b37-9327-4a22bb7315c4', 'b1f40341-0940-4f24-95aa-db5f2a8f7a97', '/images/placeholders/collectible-placeholder.png', 'Ancient Gold Card Set', 0);
INSERT INTO public."ProductImage" VALUES ('00f2bed9-f756-42b5-bf81-3103dacaa6fa', '0e409198-8c1a-46c8-b85e-718902f01139', '/images/placeholders/collectible-placeholder.png', 'Night Oracle Cards', 0);
INSERT INTO public."ProductImage" VALUES ('2199d6a7-8ddb-4471-a88e-8bb5c8211321', 'ad8bcb55-38b8-432a-a03c-7d9f256ff1ed', '/images/placeholders/collectible-placeholder.png', 'Obsidian Patch Set', 0);
INSERT INTO public."ProductImage" VALUES ('35dc909b-ac59-4ade-b2bd-bf0d8ac6a31e', '25449c9d-0181-4d46-b25b-6bbece6b5df7', '/images/placeholders/collectible-placeholder.png', 'Ash Sigil Patches', 0);
INSERT INTO public."ProductImage" VALUES ('c7175acc-d611-4650-a913-2febc834176c', 'caf810bf-86a9-45e3-8a91-a2968abfd333', '/images/placeholders/collectible-placeholder.png', 'Limited Relic Box', 0);
INSERT INTO public."ProductImage" VALUES ('fd7ef6d5-b1b4-433f-ae49-303226843bd3', '953f7dbb-427a-49df-b53c-68d11487c70a', '/images/placeholders/collectible-placeholder.png', 'Ancient Gold Mystery Box', 0);
INSERT INTO public."ProductImage" VALUES ('13be5ba1-5c89-4ed1-9cc8-6f511f4c4dc6', 'b12183ef-24b5-400a-81ad-0d7584b7a517', '/uploads/products/product-eebf2168-efc2-42a6-a83b-c3f6c249d9f9-1781130909692.jpg', 'Blue Eclipse Keycap Set', 1);
INSERT INTO public."ProductImage" VALUES ('8e9accfc-e506-4c68-80c6-66c4c524ee81', 'c2cd2de4-e594-4188-abc4-c2b33a90c94d', '/uploads/products/product-eebf2168-efc2-42a6-a83b-c3f6c249d9f9-1781131392175.jpg', 'legen keyboard and rei', 0);
INSERT INTO public."ProductImage" VALUES ('aa2b41d8-1b90-4e7f-99bb-889e591c2fa7', '4b3c9722-b3b5-46b0-be2a-93944878a18e', '/uploads/products/product-eebf2168-efc2-42a6-a83b-c3f6c249d9f9-1781131170676.jpg', 'Ancient Rune Keycaps', 1);


--
-- Data for Name: ProductVariant; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."ProductVariant" VALUES ('b4886ae2-41a8-4a22-a541-a16e9e9f1f8d', '4b3c9722-b3b5-46b0-be2a-93944878a18e', 'Standard', 'Black / Gold', 'ANCIENT-RUNE-KEYCAPS-1', 4);
INSERT INTO public."ProductVariant" VALUES ('6aae62b0-510b-4514-b507-d8598be838fb', 'b12183ef-24b5-400a-81ad-0d7584b7a517', 'Pro', 'Black / Gold', 'BLUE-ECLIPSE-KEYCAP-SET-2', 0);
INSERT INTO public."ProductVariant" VALUES ('7113ca24-57ce-4ebd-88f3-b98f7325d1c6', 'b12183ef-24b5-400a-81ad-0d7584b7a517', 'Standard', 'Black / Gold', 'BLUE-ECLIPSE-KEYCAP-SET-1', 22);
INSERT INTO public."ProductVariant" VALUES ('783d4b61-4435-480f-9af9-d70b578e0191', '585f5686-8d51-4bcd-8310-912771ef2508', 'S', 'Black', 'NOCTURNE-HOOD-1', 5);
INSERT INTO public."ProductVariant" VALUES ('726a61c8-f6af-46e4-bd8c-eabbb933a100', '585f5686-8d51-4bcd-8310-912771ef2508', 'M', 'Black', 'NOCTURNE-HOOD-2', 0);
INSERT INTO public."ProductVariant" VALUES ('2d442cf2-5969-43d6-af9a-859389fca80e', '585f5686-8d51-4bcd-8310-912771ef2508', 'L', 'Black', 'NOCTURNE-HOOD-3', 2);
INSERT INTO public."ProductVariant" VALUES ('fc31b4a4-59cf-4a23-88d0-749c96799e27', '1e13c5f8-3f6a-4a0a-9d4e-8c94418ec779', 'S', 'Black', 'ASH-VEIL-BEANIE-1', 5);
INSERT INTO public."ProductVariant" VALUES ('2a80eb1d-c41f-4d76-b47a-99b7534cb7f0', '1e13c5f8-3f6a-4a0a-9d4e-8c94418ec779', 'M', 'Black', 'ASH-VEIL-BEANIE-2', 2);
INSERT INTO public."ProductVariant" VALUES ('c44fe955-ea82-4683-9631-d8d69d683745', '1e13c5f8-3f6a-4a0a-9d4e-8c94418ec779', 'L', 'Black', 'ASH-VEIL-BEANIE-3', 2);
INSERT INTO public."ProductVariant" VALUES ('6013594c-54fb-46e6-aea8-e5331ea52323', 'aa8ed5df-9b59-4542-871e-77e22af66d0b', 'S', 'Ash black', 'ASHBORN-JACKET-1', 24);
INSERT INTO public."ProductVariant" VALUES ('da6d1069-d4b7-4f74-ae97-1a0773be7e3b', 'aa8ed5df-9b59-4542-871e-77e22af66d0b', 'M', 'Ash black', 'ASHBORN-JACKET-2', 12);
INSERT INTO public."ProductVariant" VALUES ('346ad693-7dcf-4d92-a094-bfb645eef241', 'aa8ed5df-9b59-4542-871e-77e22af66d0b', 'L', 'Ash black', 'ASHBORN-JACKET-3', 12);
INSERT INTO public."ProductVariant" VALUES ('9e98c9d1-4f5e-475f-8aff-fdcf9aae65f3', '801cd2b8-1532-4f5c-bc5d-860feef707bb', 'S', 'Ash black', 'OBSIDIAN-RIDER-COAT-1', 5);
INSERT INTO public."ProductVariant" VALUES ('f061f4c9-1f0b-4cea-bb17-efb936b54294', '801cd2b8-1532-4f5c-bc5d-860feef707bb', 'M', 'Ash black', 'OBSIDIAN-RIDER-COAT-2', 2);
INSERT INTO public."ProductVariant" VALUES ('096dc7b3-cfed-453d-b34a-10b67e22a233', '801cd2b8-1532-4f5c-bc5d-860feef707bb', 'L', 'Ash black', 'OBSIDIAN-RIDER-COAT-3', 2);
INSERT INTO public."ProductVariant" VALUES ('6b77b4b2-9b0f-4e5c-8cfd-7d6b833b11f0', 'b1db0677-d552-4a1d-b893-7210b03cb8ec', 'S', 'Blue black', 'BLUE-ECLIPSE-ZIP-HOODIE-1', 24);
INSERT INTO public."ProductVariant" VALUES ('a4441901-dadc-449b-91cf-bffe00a518ef', 'b1db0677-d552-4a1d-b893-7210b03cb8ec', 'M', 'Blue black', 'BLUE-ECLIPSE-ZIP-HOODIE-2', 12);
INSERT INTO public."ProductVariant" VALUES ('34fbb7a5-e708-4218-a6d0-ceff7e81ec95', 'b1db0677-d552-4a1d-b893-7210b03cb8ec', 'L', 'Blue black', 'BLUE-ECLIPSE-ZIP-HOODIE-3', 12);
INSERT INTO public."ProductVariant" VALUES ('c7c3a9b6-ca64-4576-986e-96d38918fc4e', '646d42d2-efe0-4a2b-b72c-fdcf47fce748', 'S', 'Blue black', 'NIGHT-SIGIL-ZIP-HOODIE-1', 5);
INSERT INTO public."ProductVariant" VALUES ('9af6e089-30a4-4eae-93b2-292583f1b0d3', '646d42d2-efe0-4a2b-b72c-fdcf47fce748', 'M', 'Blue black', 'NIGHT-SIGIL-ZIP-HOODIE-2', 2);
INSERT INTO public."ProductVariant" VALUES ('168bd563-d9e3-4555-b639-e743e3d75abb', '646d42d2-efe0-4a2b-b72c-fdcf47fce748', 'L', 'Blue black', 'NIGHT-SIGIL-ZIP-HOODIE-3', 2);
INSERT INTO public."ProductVariant" VALUES ('6a0b228f-c53d-449e-80b4-062ed716c21e', '882b7cc8-dca6-4179-97e8-b54b21349529', 'S', 'Charcoal', 'RITUAL-KNIT-SWEATER-1', 24);
INSERT INTO public."ProductVariant" VALUES ('9822a445-08a5-4a6c-af9c-7d17a97173b6', '882b7cc8-dca6-4179-97e8-b54b21349529', 'M', 'Charcoal', 'RITUAL-KNIT-SWEATER-2', 12);
INSERT INTO public."ProductVariant" VALUES ('fa4584d4-8a8f-46da-af0e-f25e7abf210b', '882b7cc8-dca6-4179-97e8-b54b21349529', 'L', 'Charcoal', 'RITUAL-KNIT-SWEATER-3', 12);
INSERT INTO public."ProductVariant" VALUES ('9878f7bf-f9a1-4f5c-ba44-0570562ec8de', '89d7662c-883e-4740-8a7e-ba7ca7460923', 'S', 'Charcoal', 'MOONLESS-PULLOVER-1', 24);
INSERT INTO public."ProductVariant" VALUES ('c4d0c03f-48d4-4eb8-8ac2-b876fd0b445f', '89d7662c-883e-4740-8a7e-ba7ca7460923', 'M', 'Charcoal', 'MOONLESS-PULLOVER-2', 12);
INSERT INTO public."ProductVariant" VALUES ('408521ec-a957-472e-9e17-9ccdcf00cc49', '89d7662c-883e-4740-8a7e-ba7ca7460923', 'L', 'Charcoal', 'MOONLESS-PULLOVER-3', 12);
INSERT INTO public."ProductVariant" VALUES ('dfca2b94-c2d0-4c12-b3fd-76cb167e21e8', 'd69092a4-492c-431a-8651-2907344fc172', 'S', 'Washed black', 'RELIC-DENIM-1', 24);
INSERT INTO public."ProductVariant" VALUES ('dc498b34-93de-4907-9986-1ef625c0dc58', 'd69092a4-492c-431a-8651-2907344fc172', 'M', 'Washed black', 'RELIC-DENIM-2', 12);
INSERT INTO public."ProductVariant" VALUES ('349ceb80-8e0a-4566-9273-7a48a61fb05b', 'd69092a4-492c-431a-8651-2907344fc172', 'L', 'Washed black', 'RELIC-DENIM-3', 12);
INSERT INTO public."ProductVariant" VALUES ('97383dbf-8a27-4234-93e3-ef5aa43a7109', '81d86898-0787-4f71-ab96-802fbda7e834', 'S', 'Washed black', 'GRAVEWASH-JEANS-1', 5);
INSERT INTO public."ProductVariant" VALUES ('d5d192ce-720e-4cf9-ad20-a22b0ba32ffa', '81d86898-0787-4f71-ab96-802fbda7e834', 'M', 'Washed black', 'GRAVEWASH-JEANS-2', 2);
INSERT INTO public."ProductVariant" VALUES ('da29ba5c-5b1e-420d-b58a-0a08635ed91c', '81d86898-0787-4f71-ab96-802fbda7e834', 'L', 'Washed black', 'GRAVEWASH-JEANS-3', 2);
INSERT INTO public."ProductVariant" VALUES ('44103bd3-597a-470d-8f73-f974821548dc', '18292f34-5f09-44eb-994a-0a174c127313', 'S', 'Black', 'NOCTURNE-CARGO-PANTS-1', 5);
INSERT INTO public."ProductVariant" VALUES ('b9179c9b-a89b-4b5f-8bef-c6bfbc9adc18', '18292f34-5f09-44eb-994a-0a174c127313', 'M', 'Black', 'NOCTURNE-CARGO-PANTS-2', 2);
INSERT INTO public."ProductVariant" VALUES ('58206ca9-5883-4cff-b2a6-8b6d64f9ac5b', '18292f34-5f09-44eb-994a-0a174c127313', 'L', 'Black', 'NOCTURNE-CARGO-PANTS-3', 2);
INSERT INTO public."ProductVariant" VALUES ('8de093b4-7955-40f3-840c-c87486e31063', '022cc584-b175-44e3-8abc-fc27f012d39c', 'S', 'Black', 'ASH-TRAIL-TROUSERS-1', 24);
INSERT INTO public."ProductVariant" VALUES ('0104316e-3a59-42b0-8e3b-01ff4aeb449a', '022cc584-b175-44e3-8abc-fc27f012d39c', 'M', 'Black', 'ASH-TRAIL-TROUSERS-2', 12);
INSERT INTO public."ProductVariant" VALUES ('a30550ce-6d8a-4d28-948c-f7facfe515db', '022cc584-b175-44e3-8abc-fc27f012d39c', 'L', 'Black', 'ASH-TRAIL-TROUSERS-3', 12);
INSERT INTO public."ProductVariant" VALUES ('cfd56d0b-1028-4c2c-98c1-2978c63986ed', '9128a3f4-9ec0-4714-8d77-7dae6d329c4b', '40', 'Black', 'NIGHTWALKER-BOOTS-1', 5);
INSERT INTO public."ProductVariant" VALUES ('c8b006d7-f561-48c3-8b23-4a9e1377752a', '9128a3f4-9ec0-4714-8d77-7dae6d329c4b', '41', 'Black', 'NIGHTWALKER-BOOTS-2', 2);
INSERT INTO public."ProductVariant" VALUES ('95a2fe6f-151c-4957-9517-44a42c11bb30', '9128a3f4-9ec0-4714-8d77-7dae6d329c4b', '42', 'Black', 'NIGHTWALKER-BOOTS-3', 2);
INSERT INTO public."ProductVariant" VALUES ('acda8a36-f073-486d-99ca-d2003ab00e86', '9128a3f4-9ec0-4714-8d77-7dae6d329c4b', '43', 'Black', 'NIGHTWALKER-BOOTS-4', 2);
INSERT INTO public."ProductVariant" VALUES ('7b6d02ec-af5d-4379-908e-5cc7d539c842', '7b9e96a5-7a23-47e7-884c-f20994dbc18d', '40', 'Black', 'BLACK-ALTAR-SNEAKERS-1', 24);
INSERT INTO public."ProductVariant" VALUES ('7912cb5b-803b-4d3b-be3b-6c30a3b76f0c', '7b9e96a5-7a23-47e7-884c-f20994dbc18d', '41', 'Black', 'BLACK-ALTAR-SNEAKERS-2', 0);
INSERT INTO public."ProductVariant" VALUES ('a6bd9155-d7a4-4ee2-b9d3-a771a13b9fad', '7b9e96a5-7a23-47e7-884c-f20994dbc18d', '42', 'Black', 'BLACK-ALTAR-SNEAKERS-3', 12);
INSERT INTO public."ProductVariant" VALUES ('51c71d5c-40a8-421a-a2c2-60bf8f4f2899', '7b9e96a5-7a23-47e7-884c-f20994dbc18d', '43', 'Black', 'BLACK-ALTAR-SNEAKERS-4', 12);
INSERT INTO public."ProductVariant" VALUES ('ab297c73-2618-462e-800e-eab0cbb3d3ed', '17e90a42-316b-4eef-b152-2040f413b03f', 'S', 'Black', 'ECLIPSE-GLOVES-1', 24);
INSERT INTO public."ProductVariant" VALUES ('8889fe98-4d2b-4f74-8f77-09ba9cf82f58', '17e90a42-316b-4eef-b152-2040f413b03f', 'M', 'Black', 'ECLIPSE-GLOVES-2', 12);
INSERT INTO public."ProductVariant" VALUES ('ebe6fdd3-b18c-4050-963a-8315b86a2a94', '17e90a42-316b-4eef-b152-2040f413b03f', 'L', 'Black', 'ECLIPSE-GLOVES-3', 12);
INSERT INTO public."ProductVariant" VALUES ('e3601cd9-4c8c-4194-ae9c-1d9ff5d7acba', 'f4e0b208-ea67-4dbc-9fb9-dd439be2ddd6', 'S', 'Black', 'ASH-RITUAL-GLOVES-1', 5);
INSERT INTO public."ProductVariant" VALUES ('399e73df-7595-4f57-9724-de5576d6439e', 'f4e0b208-ea67-4dbc-9fb9-dd439be2ddd6', 'M', 'Black', 'ASH-RITUAL-GLOVES-2', 2);
INSERT INTO public."ProductVariant" VALUES ('d5630ce3-6f6f-4b83-a97b-97dd38863c25', 'f4e0b208-ea67-4dbc-9fb9-dd439be2ddd6', 'L', 'Black', 'ASH-RITUAL-GLOVES-3', 2);
INSERT INTO public."ProductVariant" VALUES ('d6c08003-f349-4ee5-b4a9-2abcabd72176', 'de1bb412-bbee-4eb9-8f1d-5cc20d914d73', 'One Size', 'Black', 'RUNE-CARRIER-BAG-1', 24);
INSERT INTO public."ProductVariant" VALUES ('59522a19-f372-427f-84d0-8c18fafb6aed', '22378ce0-2d6b-40ab-b227-33a6b5063d65', 'One Size', 'Black', 'CATHEDRAL-SLING-BAG-1', 24);
INSERT INTO public."ProductVariant" VALUES ('7f2f621a-3353-4d63-af72-0cb3d3efdd9e', '5479cfbd-752f-4390-9998-d3101e4aba5e', 'One Size', 'Ancient silver', 'ANCIENT-CHAIN-PENDANT-1', 24);
INSERT INTO public."ProductVariant" VALUES ('9ce245de-cfeb-49b2-a467-a9a9aa62ad4b', 'fdfcbb3f-0631-4bf2-a23a-22ff41d82a10', 'One Size', 'Ancient silver', 'MOON-SHARD-PENDANT-1', 24);
INSERT INTO public."ProductVariant" VALUES ('cbca1729-b82d-42c1-afc7-7cfe91c35420', 'e5e09800-82f3-47ee-aefe-8f15fe53ee1d', 'One Size', 'Black / Gold', 'IRON-OATH-BRACELET-1', 5);
INSERT INTO public."ProductVariant" VALUES ('aa39b94d-b194-48c0-9ac0-e57c04b8a8ac', 'e9905be0-dc31-4e78-b0d7-63e250076f5b', 'One Size', 'Black / Gold', 'ASH-RELIC-CUFF-1', 24);
INSERT INTO public."ProductVariant" VALUES ('09029ff4-3ed9-4599-8a58-67e795a12d14', 'f1f3e963-0a0d-4dd2-a890-38fa038d4dd8', 'One Size', 'Silver', 'NIGHT-BELL-EARRINGS-1', 24);
INSERT INTO public."ProductVariant" VALUES ('355ead91-cc00-4bce-8908-fbed5dc4dbb4', '721666b1-0d5b-4ad6-9de0-8051ed68b81b', 'One Size', 'Silver', 'BLUE-ECLIPSE-EAR-CUFFS-1', 24);
INSERT INTO public."ProductVariant" VALUES ('6539ca43-978b-48bf-ab12-1f17983b9d9c', '3ddd73ed-666d-4274-81ba-78a93b340d37', 'A3', 'Black / Blue', 'SILENT-CATHEDRAL-POSTER-1', 24);
INSERT INTO public."ProductVariant" VALUES ('a18ff99f-db8d-46e4-8b6f-770d0bb62d5d', '3ddd73ed-666d-4274-81ba-78a93b340d37', 'A2', 'Black / Blue', 'SILENT-CATHEDRAL-POSTER-2', 12);
INSERT INTO public."ProductVariant" VALUES ('90ae6c1f-9bd0-4753-9bf2-f07cf5c50b7a', '21bb0fc9-7d4e-4931-a70c-65348dee1203', 'A3', 'Black / Blue', 'ASH-GATE-POSTER-1', 5);
INSERT INTO public."ProductVariant" VALUES ('450ae99e-a50a-42e7-976a-693c0dbb703a', '21bb0fc9-7d4e-4931-a70c-65348dee1203', 'A2', 'Black / Blue', 'ASH-GATE-POSTER-2', 2);
INSERT INTO public."ProductVariant" VALUES ('1ea81872-ac30-4cf8-8546-7b29ead403c8', 'dcf518d8-f6ab-4d3b-901c-b2fb32554758', 'One Size', 'Obsidian', 'ANCIENT-IDOL-STATUE-1', 5);
INSERT INTO public."ProductVariant" VALUES ('174b53a1-6c86-49a4-9126-3e243591d105', '8b2fa62f-0f3c-492e-9713-d77f064835ae', 'One Size', 'Obsidian', 'MOONLIT-GARGOYLE-STATUE-1', 24);
INSERT INTO public."ProductVariant" VALUES ('3deae6f6-b08f-403b-a2f0-0fe183783a78', '55f22a89-e432-4d1d-8034-8804a4f0c741', 'One Size', 'Ash white', 'RITUAL-DISPLAY-MANNEQUIN-1', 24);
INSERT INTO public."ProductVariant" VALUES ('b850362d-37ca-4a16-869c-44d0be4f2ec8', '008157a2-416e-48ce-8a39-c5484fb4e17b', 'One Size', 'Ash white', 'BLACK-VEIL-BUST-1', 5);
INSERT INTO public."ProductVariant" VALUES ('80dae873-7092-4678-bb1d-0d75be5d6ebc', '66bb50e7-af78-4e9e-8c7c-13529bbf8023', 'Standard', 'Blue black', 'MOONLIT-DESK-MAT-1', 5);
INSERT INTO public."ProductVariant" VALUES ('fb998ddd-bbe1-45f6-92dc-a6507647acd9', '66bb50e7-af78-4e9e-8c7c-13529bbf8023', 'Pro', 'Blue black', 'MOONLIT-DESK-MAT-2', 2);
INSERT INTO public."ProductVariant" VALUES ('52ad9706-478f-45be-af47-4e154055f854', 'fc29eaff-d53f-4be5-9008-2b503e6fe996', 'Standard', 'Blue black', 'ECLIPSE-MOUSE-PAD-1', 5);
INSERT INTO public."ProductVariant" VALUES ('1106d427-1d9f-4be5-ab3f-81937f5a13ff', 'fc29eaff-d53f-4be5-9008-2b503e6fe996', 'Pro', 'Blue black', 'ECLIPSE-MOUSE-PAD-2', 2);
INSERT INTO public."ProductVariant" VALUES ('0692f7bb-1cc8-4363-b280-70bf8e38229c', '1a619b54-64b1-480c-b259-6555553153f1', 'Standard', 'Black glass', 'GLASS-MOON-DESK-SLAB-1', 24);
INSERT INTO public."ProductVariant" VALUES ('f82cc457-4c01-4a39-b202-17fe266459c9', '1a619b54-64b1-480c-b259-6555553153f1', 'Pro', 'Black glass', 'GLASS-MOON-DESK-SLAB-2', 12);
INSERT INTO public."ProductVariant" VALUES ('78e5e92d-75c1-480d-9619-190107fb896e', '763eef1a-a22c-49ca-9052-6e85b9ebb413', 'Standard', 'Black glass', 'OBSIDIAN-GLASS-MAT-1', 24);
INSERT INTO public."ProductVariant" VALUES ('2b9d6f80-bcc2-4357-bc49-8c748c0e2030', '763eef1a-a22c-49ca-9052-6e85b9ebb413', 'Pro', 'Black glass', 'OBSIDIAN-GLASS-MAT-2', 12);
INSERT INTO public."ProductVariant" VALUES ('35cca9d6-803b-4f22-b5df-173b5e1b2462', '447cdae8-f666-4b96-b0b8-0f031e5dce2f', 'Standard', 'Black', 'NIGHTCRAWLER-MOUSE-1', 24);
INSERT INTO public."ProductVariant" VALUES ('211f9932-1cf7-4a60-80de-469bc59cca0c', '447cdae8-f666-4b96-b0b8-0f031e5dce2f', 'Pro', 'Black', 'NIGHTCRAWLER-MOUSE-2', 12);
INSERT INTO public."ProductVariant" VALUES ('eb7dcb96-a1f4-4b96-89bc-d7ca50302119', '1e267f72-6cea-4116-9a9c-cc300bf6e9a8', 'Standard', 'Black', 'BLUE-ECLIPSE-MOUSE-1', 5);
INSERT INTO public."ProductVariant" VALUES ('639e9c22-4abd-4719-b3f0-b47a36ed0b2d', '1e267f72-6cea-4116-9a9c-cc300bf6e9a8', 'Pro', 'Black', 'BLUE-ECLIPSE-MOUSE-2', 2);
INSERT INTO public."ProductVariant" VALUES ('fca5ab82-3cc7-4e87-8478-3abd7ac93ae7', 'e6522688-eb0a-4570-a699-399af75017a9', 'Standard', 'Black', 'CATHEDRAL-KEYBOARD-1', 24);
INSERT INTO public."ProductVariant" VALUES ('9fcd54b8-b060-4f3b-a7c2-fcd7c2261c31', 'e6522688-eb0a-4570-a699-399af75017a9', 'Pro', 'Black', 'CATHEDRAL-KEYBOARD-2', 12);
INSERT INTO public."ProductVariant" VALUES ('d4ced1a8-b501-4c31-91fc-af80518ca136', 'af92bd61-9df0-4cf4-80e4-b60e1d9260a8', 'Standard', 'Black', 'ASH-RELIC-KEYBOARD-1', 24);
INSERT INTO public."ProductVariant" VALUES ('00e7aa22-f2b3-498e-b5f0-11302c3983a8', 'af92bd61-9df0-4cf4-80e4-b60e1d9260a8', 'Pro', 'Black', 'ASH-RELIC-KEYBOARD-2', 12);
INSERT INTO public."ProductVariant" VALUES ('195d48c0-d0ae-4b3b-9a37-617360bcc9be', 'c5cb2df5-e36d-4683-8e80-66eb8f307ac9', 'Standard', 'Mixed', 'RITUAL-STICKER-PACK-1', 5);
INSERT INTO public."ProductVariant" VALUES ('a54686b4-f5b6-4d77-9092-6ec95e528146', 'c5cb2df5-e36d-4683-8e80-66eb8f307ac9', 'Limited', 'Mixed', 'RITUAL-STICKER-PACK-2', 2);
INSERT INTO public."ProductVariant" VALUES ('72c1b021-e77a-470b-9e0d-8e3bc9bd52c6', '36a3c08a-2edd-4949-962c-d1da821a55a7', 'Standard', 'Mixed', 'ASH-RELIC-STICKER-PACK-1', 5);
INSERT INTO public."ProductVariant" VALUES ('b4f33482-6b79-4891-aa32-67653f185485', '36a3c08a-2edd-4949-962c-d1da821a55a7', 'Limited', 'Mixed', 'ASH-RELIC-STICKER-PACK-2', 2);
INSERT INTO public."ProductVariant" VALUES ('6cc2ee70-497e-4c94-ae9e-b1785854f8a6', '61f3d2aa-f540-47ff-910c-7be125bb1227', 'Standard', 'Black', 'NIGHT-ARCHIVE-ART-BOOK-1', 24);
INSERT INTO public."ProductVariant" VALUES ('f3abea4d-4707-44dc-a10e-0e23a962b586', '61f3d2aa-f540-47ff-910c-7be125bb1227', 'Limited', 'Black', 'NIGHT-ARCHIVE-ART-BOOK-2', 12);
INSERT INTO public."ProductVariant" VALUES ('3f0db6be-8807-47bf-b93d-6997148cadd4', '7b67f945-9574-442e-9154-374db2a5eb7f', 'Standard', 'Black', 'BLUE-ECLIPSE-CODEX-1', 5);
INSERT INTO public."ProductVariant" VALUES ('bb1fe467-db17-4c63-ac59-ca9acd191a7e', '7b67f945-9574-442e-9154-374db2a5eb7f', 'Limited', 'Black', 'BLUE-ECLIPSE-CODEX-2', 2);
INSERT INTO public."ProductVariant" VALUES ('37794602-e934-42b0-a899-4f832690b161', '5dc5aa2c-70fa-4c05-bb3c-20844d27659f', 'Standard', 'Painted', 'ARCHIVE-FIGURE-1', 24);
INSERT INTO public."ProductVariant" VALUES ('8a6bc7af-7b11-494a-9711-94b354c11cb3', '5dc5aa2c-70fa-4c05-bb3c-20844d27659f', 'Limited', 'Painted', 'ARCHIVE-FIGURE-2', 12);
INSERT INTO public."ProductVariant" VALUES ('2e0b4ebf-ca9d-4bbb-816c-dc590fca10a9', '0e06dd45-e065-4529-819b-6685093c06bf', 'Standard', 'Painted', 'BLUE-ECLIPSE-FIGURE-1', 5);
INSERT INTO public."ProductVariant" VALUES ('d9334264-7873-411d-8746-967376af6498', '0e06dd45-e065-4529-819b-6685093c06bf', 'Limited', 'Painted', 'BLUE-ECLIPSE-FIGURE-2', 2);
INSERT INTO public."ProductVariant" VALUES ('ace35d14-c5e4-4c71-b9a8-49f7d1884c1c', 'b1f40341-0940-4f24-95aa-db5f2a8f7a97', 'Standard', 'Mixed', 'ANCIENT-GOLD-CARD-SET-1', 24);
INSERT INTO public."ProductVariant" VALUES ('467f8ce8-8298-474e-ad77-be3346be0fe6', 'b1f40341-0940-4f24-95aa-db5f2a8f7a97', 'Limited', 'Mixed', 'ANCIENT-GOLD-CARD-SET-2', 12);
INSERT INTO public."ProductVariant" VALUES ('cda0ed5e-dd7a-4b66-bd4d-9b2f3d305152', '0e409198-8c1a-46c8-b85e-718902f01139', 'Standard', 'Mixed', 'NIGHT-ORACLE-CARDS-1', 5);
INSERT INTO public."ProductVariant" VALUES ('574163f7-2a35-47b1-9bf8-c93f453c7c41', '0e409198-8c1a-46c8-b85e-718902f01139', 'Limited', 'Mixed', 'NIGHT-ORACLE-CARDS-2', 2);
INSERT INTO public."ProductVariant" VALUES ('15ce00de-bbe2-4cb6-b4a2-63c65c894552', 'ad8bcb55-38b8-432a-a03c-7d9f256ff1ed', 'Standard', 'Black / Gold', 'OBSIDIAN-PATCH-SET-1', 24);
INSERT INTO public."ProductVariant" VALUES ('0fb27873-efba-4adb-a4fa-114a2befd2b4', 'ad8bcb55-38b8-432a-a03c-7d9f256ff1ed', 'Limited', 'Black / Gold', 'OBSIDIAN-PATCH-SET-2', 12);
INSERT INTO public."ProductVariant" VALUES ('a31b1848-54e9-46b5-bac6-3b0924da0f7f', '25449c9d-0181-4d46-b25b-6bbece6b5df7', 'Standard', 'Black / Gold', 'ASH-SIGIL-PATCHES-1', 5);
INSERT INTO public."ProductVariant" VALUES ('f1b3b334-3582-47ee-9618-76f11d32b6c9', '25449c9d-0181-4d46-b25b-6bbece6b5df7', 'Limited', 'Black / Gold', 'ASH-SIGIL-PATCHES-2', 2);
INSERT INTO public."ProductVariant" VALUES ('fc1f0ece-86aa-4bda-b197-74fe4e6bcf78', 'caf810bf-86a9-45e3-8a91-a2968abfd333', 'Standard', 'Black / Gold', 'LIMITED-RELIC-BOX-1', 5);
INSERT INTO public."ProductVariant" VALUES ('4af4bdd5-8786-4097-9940-882ac8b2f6f2', 'caf810bf-86a9-45e3-8a91-a2968abfd333', 'Limited', 'Black / Gold', 'LIMITED-RELIC-BOX-2', 2);
INSERT INTO public."ProductVariant" VALUES ('10e62296-0a68-4458-8f63-1b0092e7a13b', '953f7dbb-427a-49df-b53c-68d11487c70a', 'Standard', 'Black / Gold', 'ANCIENT-GOLD-MYSTERY-BOX-1', 5);
INSERT INTO public."ProductVariant" VALUES ('d48cb5e4-6a54-44bf-93b1-68555fcdc629', '953f7dbb-427a-49df-b53c-68d11487c70a', 'Limited', 'Black / Gold', 'ANCIENT-GOLD-MYSTERY-BOX-2', 2);
INSERT INTO public."ProductVariant" VALUES ('7a45e9ae-c13e-404e-a909-73e3b078f5bb', '4b3c9722-b3b5-46b0-be2a-93944878a18e', 'Pro', 'Black / Gold', 'ANCIENT-RUNE-KEYCAPS-2', 2);


--
-- Data for Name: SiteAsset; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."SiteAsset" VALUES ('2bca1aa2-0012-4426-b79b-e9ae564c2a03', 'enter_screen_image', 'Enter screen image', '/images/placeholders/product-placeholder.png', 'Enter screen image placeholder.', '2026-05-23 17:49:24.06', '2026-05-28 03:58:47.144');
INSERT INTO public."SiteAsset" VALUES ('76fd3155-6eb8-41d1-b37f-3ed9db144f70', 'home_hero_image', 'Home hero image', '/images/placeholders/product-placeholder.png', 'Home hero image placeholder.', '2026-05-23 17:49:24.062', '2026-05-28 03:58:47.146');
INSERT INTO public."SiteAsset" VALUES ('c4a6ad32-f849-40ab-b33c-edf9e362c0b2', 'about_main_image', 'About main image', '/images/placeholders/product-placeholder.png', 'About main image placeholder.', '2026-05-23 17:49:24.064', '2026-05-28 03:58:47.147');
INSERT INTO public."SiteAsset" VALUES ('060fa7cd-aaeb-400e-a3d0-3afc6232dbe6', 'collectibles_hero_image', 'Collectibles hero image', '/images/placeholders/collectible-placeholder.png', 'Collectibles hero image placeholder.', '2026-05-23 17:49:24.065', '2026-05-28 03:58:47.148');


--
-- Data for Name: StockMovement; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."StockMovement" VALUES ('cb8c0205-b3b7-4582-9e0a-0bc6512eca5f', '7113ca24-57ce-4ebd-88f3-b98f7325d1c6', 'SALE', -1, 'Order sale: 4e7f2461-d9b7-4993-b4ee-ab0440e04196', 'eebf2168-efc2-42a6-a83b-c3f6c249d9f9', '2026-06-10 23:10:27.509');
INSERT INTO public."StockMovement" VALUES ('f1e40fb3-830f-4def-8b60-7e6c0db9ae0b', 'b4886ae2-41a8-4a22-a541-a16e9e9f1f8d', 'SALE', -1, 'Order sale: 4e7f2461-d9b7-4993-b4ee-ab0440e04196', 'eebf2168-efc2-42a6-a83b-c3f6c249d9f9', '2026-06-10 23:10:27.512');
INSERT INTO public."StockMovement" VALUES ('d2671ae0-ac43-4089-a810-041b6b125224', '7113ca24-57ce-4ebd-88f3-b98f7325d1c6', 'SALE', -1, 'Order sale: b73b9078-123a-48ea-a04d-b23257929876', 'c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc', '2026-06-10 23:34:25.101');


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."User" VALUES ('eebf2168-efc2-42a6-a83b-c3f6c249d9f9', 'admin@vybe.com', 'admin', '$2a$10$kPfT5tdG.wvy/7n3hCAQKeiknaMEdw0PlbE0wDnuuFd0.QP5cI4iG', 'ADMIN', '/uploads/avatars/eebf2168-efc2-42a6-a83b-c3f6c249d9f9-1779937922640.jpg', NULL, false, '2026-05-23 17:49:23.835', '2026-05-28 03:58:46.884');
INSERT INTO public."User" VALUES ('66b0a068-0eb0-41f5-ac9d-7fb1bb485355', 'user@vybe.com', 'user', '$2a$10$MQhV5U7WWQ8VV81C8mbWq.xXWxv0F6RelkiPjnzzEY/eoubJyWwCm', 'USER', '/uploads/avatars/66b0a068-0eb0-41f5-ac9d-7fb1bb485355-1779644330169.png', NULL, false, '2026-05-23 17:49:23.842', '2026-05-28 03:58:46.89');
INSERT INTO public."User" VALUES ('c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc', 'lipiousss@vybe.com', 'lipiousss', '$2a$10$5vRUtZ3YiXBxEGZNs.jPouIKEw5jLjqdak9Lhyyg/MdMYgoCLPmtO', 'USER', '/uploads/avatars/c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc-1779644946864.jpg', NULL, false, '2026-05-24 17:48:29.567', '2026-06-10 23:32:22.113');
INSERT INTO public."User" VALUES ('d77e6950-48cc-4cf9-a41a-b8be5d9b071a', 'stockcheck95156@vybe.test', 'stock_95156', '$2a$10$WAvVeuz8DktnMFtuLna9NODoP0HiWmwIiLKwJ0qlEWaD/V1ETWsg.', 'USER', NULL, NULL, false, '2026-05-26 11:32:36.969', '2026-05-26 11:32:36.969');


--
-- Data for Name: UserProfile; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public."UserProfile" VALUES ('12e0f5c1-5411-4675-9dd2-c8e12b2fbd38', '66b0a068-0eb0-41f5-ac9d-7fb1bb485355', NULL, NULL, NULL, NULL);
INSERT INTO public."UserProfile" VALUES ('94582497-0a2f-4302-b9e9-1eb5eb9b0274', 'c1ae0f73-e7b5-408a-8a57-b61a3a6a6fcc', 'Valera', 'Balenciaga', NULL, '2005-10-24 00:00:00');


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: vybe
--

INSERT INTO public._prisma_migrations VALUES ('c6315691-3263-4eac-9b6c-3cce2f893a69', 'f39a7ad1ee09438a6077ee33feb258d0e10f682a3332e71156271ed450cec294', '2026-05-23 17:49:15.676834+00', '20260523174915_init_database', NULL, NULL, '2026-05-23 17:49:15.523731+00', 1);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: AdminLog AdminLog_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."AdminLog"
    ADD CONSTRAINT "AdminLog_pkey" PRIMARY KEY (id);


--
-- Name: Artwork Artwork_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Artwork"
    ADD CONSTRAINT "Artwork_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Collection Collection_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Collection"
    ADD CONSTRAINT "Collection_pkey" PRIMARY KEY (id);


--
-- Name: Favorite Favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (id);


--
-- Name: ProductVariant ProductVariant_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."ProductVariant"
    ADD CONSTRAINT "ProductVariant_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: SiteAsset SiteAsset_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."SiteAsset"
    ADD CONSTRAINT "SiteAsset_pkey" PRIMARY KEY (id);


--
-- Name: StockMovement StockMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_pkey" PRIMARY KEY (id);


--
-- Name: UserProfile UserProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Artwork_slug_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "Artwork_slug_key" ON public."Artwork" USING btree (slug);


--
-- Name: Cart_userId_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "Cart_userId_key" ON public."Cart" USING btree ("userId");


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Collection_slug_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "Collection_slug_key" ON public."Collection" USING btree (slug);


--
-- Name: Favorite_userId_productId_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "Favorite_userId_productId_key" ON public."Favorite" USING btree ("userId", "productId");


--
-- Name: ProductVariant_sku_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "ProductVariant_sku_key" ON public."ProductVariant" USING btree (sku);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: SiteAsset_key_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "SiteAsset_key_key" ON public."SiteAsset" USING btree (key);


--
-- Name: UserProfile_userId_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "UserProfile_userId_key" ON public."UserProfile" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: vybe
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Address Address_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AdminLog AdminLog_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."AdminLog"
    ADD CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public."ProductVariant"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Category Category_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Favorite Favorite_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Favorite Favorite_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public."ProductVariant"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductImage ProductImage_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductVariant ProductVariant_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."ProductVariant"
    ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collection"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovement StockMovement_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StockMovement StockMovement_productVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."StockMovement"
    ADD CONSTRAINT "StockMovement_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES public."ProductVariant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserProfile UserProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vybe
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict dtECtVLpaZ8bQgM38Td4lhy9ngcgLhEjeATiA8dNCaRCNKcBQkB4aoaDFbr4zGI

