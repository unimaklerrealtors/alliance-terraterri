FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install

# Per-environment endpoints injected at build time via --build-arg.
# Defaults are the PROD URLs so the existing prod pipeline (which passes no
# build-args) is unaffected; the dev CI overrides them with the dev domains.
ARG VITE_USER_ENDPOINT=https://micro-api-one.terraterri.com
ARG VITE_SERVICES_ENDPOINT=https://micro-api-two.terraterri.com
ARG VITE_MASTERS_ENDPOINT=https://micro-api-three.terraterri.com
ARG VITE_WEBSITE_ENDPOINT=https://nodeapi.terraterri.com
ARG VITE_EXPO_ENDPOINT=https://expoadminapi.terraterri.com
ARG VITE_BASE_URL=https://alliance.terraterri.com
ARG VITE_BUILDER_ALLIANCE_URL=https://builderalliance.terraterri.com
ARG VITE_BUILDER_ADMIN_URL=https://builder.admin.terraterri.com

# Write the values into .env.production, which Vite unambiguously loads for
# `vite build` (mode=production). Relying on process.env alone did not take effect
# in this repo: every import.meta.env.VITE_* compiled to `undefined`, so axios got
# baseURL "undefined" and calls hit our own origin (blank Registration page).
RUN { \
      echo "VITE_USER_ENDPOINT=$VITE_USER_ENDPOINT"; \
      echo "VITE_SERVICES_ENDPOINT=$VITE_SERVICES_ENDPOINT"; \
      echo "VITE_MASTERS_ENDPOINT=$VITE_MASTERS_ENDPOINT"; \
      echo "VITE_WEBSITE_ENDPOINT=$VITE_WEBSITE_ENDPOINT"; \
      echo "VITE_EXPO_ENDPOINT=$VITE_EXPO_ENDPOINT"; \
      echo "VITE_BASE_URL=$VITE_BASE_URL"; \
      echo "VITE_BUILDER_ALLIANCE_URL=$VITE_BUILDER_ALLIANCE_URL"; \
      echo "VITE_BUILDER_ADMIN_URL=$VITE_BUILDER_ADMIN_URL"; \
    } > .env.production \
 && echo "--- .env.production used for this build ---" \
 && cat .env.production

RUN npm run build

# Fail the build if the API host never reached the bundle, instead of silently
# shipping a UI whose requests go to its own origin.
RUN grep -rq "expoadminapi" dist/assets/ \
 || (echo "ERROR: VITE_EXPO_ENDPOINT did not reach the bundle" && exit 1)

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
