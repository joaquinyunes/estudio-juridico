#!/usr/bin/env bash
# Chequeo de disponibilidad: la portada responde 200 en menos de 10 s y trae un <h1>.
# Uso: scripts/uptime.sh [URL]   (sale con 1 si falla 3 veces seguidas)
url="${1:-https://estudio-juridico-tau.vercel.app/}"
for intento in 1 2 3; do
  cuerpo=$(curl -sS -L --max-time 10 -w '\n%{http_code} %{time_total}' "$url" 2>&1) || true
  estado=$(printf '%s' "$cuerpo" | tail -n1)
  if [ "${estado%% *}" = "200" ] && printf '%s' "$cuerpo" | grep -q '<h1'; then
    echo "OK $url (${estado#* } s)"
    exit 0
  fi
  echo "Intento $intento falló para $url: $estado" >&2
  sleep 10
done
echo "CAÍDO: $url" >&2
exit 1
