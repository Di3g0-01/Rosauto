--
-- PostgreSQL database dump
--

\restrict DgeOz8ozbSsDO8qsaQ46Vj3d7W7aO32fMw5oTIYQe8d7CrRXahSXpsfbPCIBGiI

-- Dumped from database version 18.2 (Debian 18.2-1.pgdg13+1)
-- Dumped by pg_dump version 18.2 (Debian 18.2-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: calcomania; Type: TABLE; Schema: public; Owner: diego
--

CREATE TABLE public.calcomania (
    id_calcomania integer NOT NULL,
    numero_tarjeta character varying(20) NOT NULL,
    anio smallint NOT NULL,
    fecha_pago date,
    estado character varying(20) NOT NULL,
    monto_pagado numeric(8,2),
    fecha_vencimiento date NOT NULL
);


ALTER TABLE public.calcomania OWNER TO diego;

--
-- Name: calcomania_id_calcomania_seq; Type: SEQUENCE; Schema: public; Owner: diego
--

CREATE SEQUENCE public.calcomania_id_calcomania_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calcomania_id_calcomania_seq OWNER TO diego;

--
-- Name: calcomania_id_calcomania_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: diego
--

ALTER SEQUENCE public.calcomania_id_calcomania_seq OWNED BY public.calcomania.id_calcomania;


--
-- Name: certificado_propiedad; Type: TABLE; Schema: public; Owner: diego
--

CREATE TABLE public.certificado_propiedad (
    id_certificado integer NOT NULL,
    id_vehiculo integer NOT NULL,
    fecha_emision date NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.certificado_propiedad OWNER TO diego;

--
-- Name: certificado_propiedad_id_certificado_seq; Type: SEQUENCE; Schema: public; Owner: diego
--

CREATE SEQUENCE public.certificado_propiedad_id_certificado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificado_propiedad_id_certificado_seq OWNER TO diego;

--
-- Name: certificado_propiedad_id_certificado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: diego
--

ALTER SEQUENCE public.certificado_propiedad_id_certificado_seq OWNED BY public.certificado_propiedad.id_certificado;


--
-- Name: linea_estilo; Type: TABLE; Schema: public; Owner: diego
--

CREATE TABLE public.linea_estilo (
    id_linea integer NOT NULL,
    id_marca integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.linea_estilo OWNER TO diego;

--
-- Name: linea_estilo_id_linea_seq; Type: SEQUENCE; Schema: public; Owner: diego
--

CREATE SEQUENCE public.linea_estilo_id_linea_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.linea_estilo_id_linea_seq OWNER TO diego;

--
-- Name: linea_estilo_id_linea_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: diego
--

ALTER SEQUENCE public.linea_estilo_id_linea_seq OWNED BY public.linea_estilo.id_linea;


--
-- Name: marca; Type: TABLE; Schema: public; Owner: diego
--

CREATE TABLE public.marca (
    id_marca integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.marca OWNER TO diego;

--
-- Name: marca_id_marca_seq; Type: SEQUENCE; Schema: public; Owner: diego
--

CREATE SEQUENCE public.marca_id_marca_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marca_id_marca_seq OWNER TO diego;

--
-- Name: marca_id_marca_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: diego
--

ALTER SEQUENCE public.marca_id_marca_seq OWNED BY public.marca.id_marca;


--
-- Name: propietario; Type: TABLE; Schema: public; Owner: diego
--

CREATE TABLE public.propietario (
    nit_cui character varying(13) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    direccion character varying(200) NOT NULL,
    fecha_nacimiento date NOT NULL,
    id_usuario integer NOT NULL
);


ALTER TABLE public.propietario OWNER TO diego;

--
-- Name: tarjeta_circulacion; Type: TABLE; Schema: public; Owner: diego
--

CREATE TABLE public.tarjeta_circulacion (
    numero_tarjeta character varying(20) NOT NULL,
    id_vehiculo integer NOT NULL,
    id_certificado integer NOT NULL,
    fecha_emision date NOT NULL,
    estado character(1) NOT NULL,
    CONSTRAINT tarjeta_circulacion_estado_check CHECK ((estado = ANY (ARRAY['A'::bpchar, 'I'::bpchar, 'V'::bpchar])))
);


ALTER TABLE public.tarjeta_circulacion OWNER TO diego;

--
-- Name: tipo_uso; Type: TABLE; Schema: public; Owner: diego
--

CREATE TABLE public.tipo_uso (
    id_tipo_uso integer NOT NULL,
    nombre character varying(30) NOT NULL
);


ALTER TABLE public.tipo_uso OWNER TO diego;

--
-- Name: tipo_uso_id_tipo_uso_seq; Type: SEQUENCE; Schema: public; Owner: diego
--

CREATE SEQUENCE public.tipo_uso_id_tipo_uso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipo_uso_id_tipo_uso_seq OWNER TO diego;

--
-- Name: tipo_uso_id_tipo_uso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: diego
--

ALTER SEQUENCE public.tipo_uso_id_tipo_uso_seq OWNED BY public.tipo_uso.id_tipo_uso;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: diego
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol character varying(20) NOT NULL
);


ALTER TABLE public.usuario OWNER TO diego;

--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: diego
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO diego;

--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: diego
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- Name: vehiculo; Type: TABLE; Schema: public; Owner: diego
--

CREATE TABLE public.vehiculo (
    id_vehiculo integer NOT NULL,
    vin character varying(17) NOT NULL,
    placa character varying(7) NOT NULL,
    num_motor character varying(50) NOT NULL,
    color character varying(30) NOT NULL,
    cc smallint NOT NULL,
    cilindros smallint NOT NULL,
    asientos smallint NOT NULL,
    ejes smallint NOT NULL,
    tonelaje numeric(5,2) NOT NULL,
    id_linea integer NOT NULL,
    id_tipo_uso integer NOT NULL,
    nit_cui character varying(13) NOT NULL
);


ALTER TABLE public.vehiculo OWNER TO diego;

--
-- Name: vehiculo_id_vehiculo_seq; Type: SEQUENCE; Schema: public; Owner: diego
--

CREATE SEQUENCE public.vehiculo_id_vehiculo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehiculo_id_vehiculo_seq OWNER TO diego;

--
-- Name: vehiculo_id_vehiculo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: diego
--

ALTER SEQUENCE public.vehiculo_id_vehiculo_seq OWNED BY public.vehiculo.id_vehiculo;


--
-- Name: calcomania id_calcomania; Type: DEFAULT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.calcomania ALTER COLUMN id_calcomania SET DEFAULT nextval('public.calcomania_id_calcomania_seq'::regclass);


--
-- Name: certificado_propiedad id_certificado; Type: DEFAULT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.certificado_propiedad ALTER COLUMN id_certificado SET DEFAULT nextval('public.certificado_propiedad_id_certificado_seq'::regclass);


--
-- Name: linea_estilo id_linea; Type: DEFAULT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.linea_estilo ALTER COLUMN id_linea SET DEFAULT nextval('public.linea_estilo_id_linea_seq'::regclass);


--
-- Name: marca id_marca; Type: DEFAULT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.marca ALTER COLUMN id_marca SET DEFAULT nextval('public.marca_id_marca_seq'::regclass);


--
-- Name: tipo_uso id_tipo_uso; Type: DEFAULT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.tipo_uso ALTER COLUMN id_tipo_uso SET DEFAULT nextval('public.tipo_uso_id_tipo_uso_seq'::regclass);


--
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- Name: vehiculo id_vehiculo; Type: DEFAULT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.vehiculo ALTER COLUMN id_vehiculo SET DEFAULT nextval('public.vehiculo_id_vehiculo_seq'::regclass);


--
-- Name: calcomania calcomania_pkey; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.calcomania
    ADD CONSTRAINT calcomania_pkey PRIMARY KEY (id_calcomania);


--
-- Name: certificado_propiedad certificado_propiedad_pkey; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.certificado_propiedad
    ADD CONSTRAINT certificado_propiedad_pkey PRIMARY KEY (id_certificado);


--
-- Name: linea_estilo linea_estilo_pkey; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.linea_estilo
    ADD CONSTRAINT linea_estilo_pkey PRIMARY KEY (id_linea);


--
-- Name: marca marca_nombre_key; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.marca
    ADD CONSTRAINT marca_nombre_key UNIQUE (nombre);


--
-- Name: marca marca_pkey; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.marca
    ADD CONSTRAINT marca_pkey PRIMARY KEY (id_marca);


--
-- Name: propietario propietario_pkey; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.propietario
    ADD CONSTRAINT propietario_pkey PRIMARY KEY (nit_cui);


--
-- Name: tarjeta_circulacion tarjeta_circulacion_pkey; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.tarjeta_circulacion
    ADD CONSTRAINT tarjeta_circulacion_pkey PRIMARY KEY (numero_tarjeta);


--
-- Name: tipo_uso tipo_uso_nombre_key; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.tipo_uso
    ADD CONSTRAINT tipo_uso_nombre_key UNIQUE (nombre);


--
-- Name: tipo_uso tipo_uso_pkey; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.tipo_uso
    ADD CONSTRAINT tipo_uso_pkey PRIMARY KEY (id_tipo_uso);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: usuario usuario_username_key; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_username_key UNIQUE (username);


--
-- Name: vehiculo vehiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_pkey PRIMARY KEY (id_vehiculo);


--
-- Name: vehiculo vehiculo_placa_key; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_placa_key UNIQUE (placa);


--
-- Name: vehiculo vehiculo_vin_key; Type: CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_vin_key UNIQUE (vin);


--
-- Name: calcomania calcomania_numero_tarjeta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.calcomania
    ADD CONSTRAINT calcomania_numero_tarjeta_fkey FOREIGN KEY (numero_tarjeta) REFERENCES public.tarjeta_circulacion(numero_tarjeta);


--
-- Name: certificado_propiedad certificado_propiedad_id_vehiculo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.certificado_propiedad
    ADD CONSTRAINT certificado_propiedad_id_vehiculo_fkey FOREIGN KEY (id_vehiculo) REFERENCES public.vehiculo(id_vehiculo);


--
-- Name: linea_estilo linea_estilo_id_marca_fkey; Type: FK CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.linea_estilo
    ADD CONSTRAINT linea_estilo_id_marca_fkey FOREIGN KEY (id_marca) REFERENCES public.marca(id_marca);


--
-- Name: propietario propietario_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.propietario
    ADD CONSTRAINT propietario_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: tarjeta_circulacion tarjeta_circulacion_id_certificado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.tarjeta_circulacion
    ADD CONSTRAINT tarjeta_circulacion_id_certificado_fkey FOREIGN KEY (id_certificado) REFERENCES public.certificado_propiedad(id_certificado);


--
-- Name: tarjeta_circulacion tarjeta_circulacion_id_vehiculo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.tarjeta_circulacion
    ADD CONSTRAINT tarjeta_circulacion_id_vehiculo_fkey FOREIGN KEY (id_vehiculo) REFERENCES public.vehiculo(id_vehiculo);


--
-- Name: vehiculo vehiculo_id_linea_fkey; Type: FK CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_id_linea_fkey FOREIGN KEY (id_linea) REFERENCES public.linea_estilo(id_linea);


--
-- Name: vehiculo vehiculo_id_tipo_uso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_id_tipo_uso_fkey FOREIGN KEY (id_tipo_uso) REFERENCES public.tipo_uso(id_tipo_uso);


--
-- Name: vehiculo vehiculo_nit_cui_fkey; Type: FK CONSTRAINT; Schema: public; Owner: diego
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_nit_cui_fkey FOREIGN KEY (nit_cui) REFERENCES public.propietario(nit_cui);


--
-- PostgreSQL database dump complete
--

\unrestrict DgeOz8ozbSsDO8qsaQ46Vj3d7W7aO32fMw5oTIYQe8d7CrRXahSXpsfbPCIBGiI

