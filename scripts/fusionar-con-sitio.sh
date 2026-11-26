#!/usr/bin/env bash
# Convierte el repo del sitio público en el monorepo de la plataforma (ADR-007). Se corre UNA vez, desde el kit:
#   bash scripts/fusionar-con-sitio.sh ~/projects/lucg
# Qué hace, en una rama nueva `dev` (no toca main ni hace push):
#   1) mueve el sitio a apps/site conservando historial (git mv); brand/ queda en la raíz
#   2) copia el kit alrededor   3) deja dos commits listos para revisar
set -euo pipefail
SITIO="${1:?Uso: bash scripts/fusionar-con-sitio.sh <ruta-al-repo-del-sitio>}"
KIT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SITIO"
[ -d .git ] || { echo "No es un repositorio git: $SITIO"; exit 1; }
[ ! -e apps ] || { echo "Ya existe apps/: parece que la fusión ya se hizo"; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "El repo del sitio tiene cambios sin commit; haz commit o stash primero"; exit 1; }
[ "$(git branch --show-current)" = "main" ] || { echo "Párate en main antes de empezar"; exit 1; }
git show-ref --verify --quiet refs/heads/dev && { echo "Ya existe la rama dev"; exit 1; }

git switch -c dev
mkdir -p apps/site
for f in $(git ls-tree --name-only HEAD); do
  case "$f" in
    brand) ;;                                             # logos: se quedan en la raíz
    pnpm-lock.yaml|pnpm-workspace.yaml) git rm -q "$f" ;; # los reemplaza el workspace de la raíz
    *) git mv "$f" "apps/site/$f" ;;
  esac
done
[ -f next-env.d.ts ] && mv next-env.d.ts apps/site/ || true
rm -rf node_modules .next                                 # se regeneran con pnpm install / next build
sed -i.bak 's/"name": "lucg-web"/"name": "@lucg\/site"/' apps/site/package.json && rm apps/site/package.json.bak
git add -A
git commit -q -m "chore: mover el sitio público a apps/site (monorepo, ADR-007)"

(cd "$KIT" && tar --exclude=.git --exclude=node_modules --exclude=.DS_Store --exclude=COMO_USAR_ESTE_KIT.md -cf - .) | tar -xf -
git add -A
git commit -q -m "chore: kit inicial de la plataforma LUCG (API, consola, PWA, CI/CD, GSD)"

cat <<MSG

Listo. Rama dev creada en $SITIO con 2 commits; main y el sitio en producción no cambiaron.
Sigue con:
  pnpm install                       # genera pnpm-lock.yaml de todo el monorepo
  pnpm --filter @lucg/site build     # el sitio debe compilar igual que antes
  git add pnpm-lock.yaml && git commit -m "chore: lockfile del monorepo"
  git push -u origin dev
Luego, en Vercel (proyecto del sitio): Settings → Build and Deployment → Root Directory = apps/site.
MSG
