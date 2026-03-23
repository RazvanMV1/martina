# ─────────────────────────────────────────────────────────────────────────────
# Martina Valenti Landing Page — Production Dockerfile
# Strategy: Multi-stage build pentru minimizarea suprafeței de atac
# și a dimensiunii imaginii finale.
#
# Rezultat așteptat:
#   - Stage builder: ~1.2GB (temporar, nu intră în producție)
#   - Stage runner:  ~180MB (imaginea finală deployată)
# ─────────────────────────────────────────────────────────────────────────────


# ══════════════════════════════════════════════════════════════════════════════
# STAGE 1: deps
# Scop: Instalarea dependențelor cu cache layer dedicat.
# Separăm acest stage pentru a profita de cache-ul Docker —
# dacă package.json nu se schimbă, acest layer nu se reexecută.
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS deps

# Instalăm libc6-compat pentru compatibilitate cu unele pachete native.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiem DOAR fișierele de manifest al dependențelor.
# Acest lucru asigură că layer-ul de npm install este invalidat
# DOAR când package.json sau lockfile-ul se schimbă.
COPY package.json package-lock.json* ./

# Instalăm TOATE dependențele (inclusiv devDependencies — necesare pentru build).
RUN npm ci --frozen-lockfile


# ══════════════════════════════════════════════════════════════════════════════
# STAGE 2: builder
# Scop: Compilarea aplicației Next.js.
# output: 'standalone' în next.config.mjs este ESENȚIAL pentru stage-ul următor.
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Copiem node_modules din stage-ul anterior.
COPY --from=deps /app/node_modules ./node_modules

# Copiem tot restul codului sursă.
COPY . .

# Variabilă de environment pentru build — dezactivează telemetria Next.js.
ENV NEXT_TELEMETRY_DISABLED=1

# Build-ul de producție.
# Generează folderul .next/standalone datorită opțiunii output: 'standalone'.
RUN npm run build


# ══════════════════════════════════════════════════════════════════════════════
# STAGE 3: runner (imaginea finală de producție)
# Scop: Rularea aplicației cu MINIMUM de resurse.
# Acest stage NU conține: cod sursă, devDependencies, node_modules complete.
# Conține DOAR: serverul standalone Next.js + assets publice.
# ══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Practică de securitate: nu rulăm niciodată ca root în producție.
# Creăm un user și grup dedicat cu privilegii minime.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copiem folderul public (imagini statice, favicon, etc.)
COPY --from=builder /app/public ./public

# Setăm permisiunile ÎNAINTE de a copia fișierele —
# mai eficient decât un RUN chmod ulterior.
RUN mkdir .next && chown nextjs:nodejs .next

# Copiem artefactele standalone generate de Next.js.
# Acesta este OUTPUT-UL CRITIC al opțiunii output: 'standalone' —
# un server Node.js complet autonom, fără node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiem next.config.mjs în caz că serverul standalone îl referențiază.
COPY --from=builder /app/next.config.mjs ./

# Schimbăm la userul non-root.
USER nextjs

# Expunem portul standard Next.js.
EXPOSE 3000

# Setăm hostname-ul pentru a asculta pe toate interfețele (necesar în Docker/K8s).
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Pornim serverul standalone generat de Next.js.
# NU folosim `npm start` — este mai lent și adaugă un proces intermediar.
CMD ["node", "server.js"]