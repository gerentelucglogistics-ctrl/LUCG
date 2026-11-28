#!/usr/bin/env bash
# Regresión de la guardia del agente (.claude/hooks/guardia-prod.sh), D-07.
# Cada caso arma el JSON del hook PreToolUse (tool_input.command), lo pasa por stdin y compara el código de salida:
# 2 = bloqueado, 0 = permitido. Sin red y sin ejecutar nada de lo que se prueba.
set -uo pipefail
cd "$(dirname "$0")/../.."
H=.claude/hooks/guardia-prod.sh
fallos=0
total=0

caso() { # rc_esperado comando
  local esperado="$1" cmd="$2" rc
  total=$((total + 1))
  python3 -c 'import json,sys;print(json.dumps({"tool_input":{"command":sys.argv[1]}}))' "$cmd" | bash "$H" >/dev/null 2>&1
  rc=$?
  if [ "$rc" != "$esperado" ]; then
    echo "FALLA rc=$rc (esperado $esperado): $cmd"
    fallos=$((fallos + 1))
  fi
}

# ---------------------------------------------------------------- BLOQUEADOS (rc=2)
# gh api de escritura sobre fusión, despliegues, ramas, refs, contenido, entornos prod y administración
caso 2 'gh api -X PUT repos/o/r/pulls/12/merge'
caso 2 'gh api --method=PUT repos/o/r/pulls/12/merge'
caso 2 'gh api -XPUT repos/o/r/pulls/12/merge'
caso 2 'gh api repos/o/r/actions/runs/1/pending_deployments -f state=approved -F '\''environment_ids[]=1'\'''
caso 2 'gh api -X POST repos/o/r/actions/runs/1/rerun'
caso 2 'gh api -X POST repos/o/r/actions/runs/1/rerun-failed-jobs'
caso 2 'gh api -X POST repos/o/r/actions/workflows/deploy-prod.yml/dispatches -f ref=main'
caso 2 'gh api repos/o/r/actions/workflows/migrate.yml/dispatches -f ref=main -f inputs[entorno]=prod'
caso 2 'gh api -X DELETE repos/o/r/branches/main/protection'
caso 2 'gh api -X PATCH repos/o/r/git/refs/heads/main -f sha=abc'
caso 2 'gh api repos/o/r/merges -f base=main -f head=dev'
caso 2 'gh api -X PUT repos/o/r/contents/README.md -f message=x -f content=eA=='
caso 2 'gh api -X PUT repos/gerentelucglogistics-ctrl/LUCG/environments/prod --input p.json'
caso 2 'gh api -X DELETE repos/o/r/environments/Production'
caso 2 'gh api -X POST repos/o/r/rulesets --input r.json'
caso 2 'gh api -X DELETE repos/o/r/rulesets/1'
caso 2 'gh api -X PUT repos/o/r/collaborators/x -f permission=admin'
caso 2 'gh api -X PATCH repos/o/r -f default_branch=dev'
caso 2 'gh api -X PATCH repos/gerentelucglogistics-ctrl/LUCG -f default_branch=dev'
# GraphQL: mutaciones de fusión, aprobación y refs
caso 2 'gh api graphql -f query='\''mutation { mergePullRequest(input:{pullRequestId:"x"}) { clientMutationId } }'\'''
caso 2 'gh api graphql -f query='\''mutation { approveDeployments(input:{}) { clientMutationId } }'\'''
caso 2 'gh api graphql -f query='\''mutation { updateRef(input:{}) { clientMutationId } }'\'''
# Secretos, variables y workflows
caso 2 'gh secret set X --env prod'
caso 2 'gh secret set X -e Production'
caso 2 'gh variable set X --env=prod --body y'
caso 2 'gh variable delete X -e prod'
caso 2 'gh workflow run migrate.yml -f entorno=prod'
caso 2 'gh workflow run deploy-prod.yml'
caso 2 'gh workflow disable ci.yml'
caso 2 'gh workflow enable ci.yml'
# PRs hacia main
caso 2 'gh pr create -B main --title x'
caso 2 'gh pr create --base=main --title x'
caso 2 'gh pr create --base main --title x'
caso 2 'gh pr edit 12 --base main'
caso 2 'gh pr edit 12 -B main'
# Falla cerrado a propósito: una mención entre comillas o tras ( de una frase protegida se bloquea aunque sea un grep o un commit.
# Las comprobaciones usan clases [[:space:]] (gh[[:space:]]pr[[:space:]]merge), que pasan; ver los casos rc=0 de abajo.
caso 2 'grep -c '\''gh pr merge'\'' scripts/cierre-fase.sh'
caso 2 'git commit -m "docs: gh auth token"'
caso 2 'grep -c '\''"Bash(gh auth token*)"'\'' .claude/settings.json'
# Aprobar y credenciales de gh
caso 2 'gh pr review 12 --approve'
caso 2 'gh auth token'
caso 2 'gh auth switch -u jaras97'
caso 2 'gh auth login --with-token'
caso 2 'gh auth refresh -s admin:org'
caso 2 'gh auth status --show-token'
caso 2 'gh auth status -t'
# Fusión a mano y delimitadores (comillas, $(, ruta absoluta)
caso 2 'bash -c '\''gh pr merge 3'\'''
caso 2 'sh -c "gh pr merge 3"'
caso 2 '$(gh pr merge 3)'
caso 2 '/opt/homebrew/bin/gh pr merge 3 --squash'
caso 2 'gh pr merge 3 --squash'
caso 2 'echo `gh auth token`'
# git push hacia main, masivo o de borrado
caso 2 'git push origin HEAD:refs/heads/main'
caso 2 'git push origin +fase/x:main'
caso 2 'git push --all origin'
caso 2 'git push --mirror origin'
caso 2 'git push origin --delete main'
caso 2 'git push origin :dev'
caso 2 'git push origin main'
caso 2 'git push -f origin fase/x'
caso 2 'git push origin dev'
# curl/wget a la API de GitHub con escritura
caso 2 'curl -X POST https://api.github.com/repos/o/r/merges -d @b.json'
caso 2 'curl -H "Authorization: token x" --data '\''{}'\'' https://api.github.com/repos/o/r/pulls/1/merge'
caso 2 'wget --method=PUT https://api.github.com/repos/o/r/pulls/1/merge'
# Llavero
caso 2 'security find-generic-password -s gh:github.com -w'
caso 2 'security dump-keychain'
# Infra contra prod y remotos (casos que ya bloqueaba la guardia)
caso 2 'vercel deploy --prod'
caso 2 'supabase db push --linked'
caso 2 'supabase link --project-ref x'
caso 2 'gh workflow run deploy-prod.yml --ref main'
caso 2 'railway up --environment prod'

# ---------------------------------------------------------------- PERMITIDOS (rc=0)
# Lecturas de la API
caso 0 'gh api repos/o/r/environments'
caso 0 'gh api repos/o/r/environments/prod'
caso 0 'gh api repos/o/r/actions/runs/1/pending_deployments'
caso 0 'gh api -X GET repos/o/r/pulls/12/merge'
caso 0 'gh api repos/o/r/rulesets'
caso 0 'gh api graphql -f query='\''query { viewer { login } }'\'''
# Protección de dev (la administra el plan de ajustes, no es main)
caso 0 'gh api -X PUT repos/o/r/branches/dev/protection --input p.json'
caso 0 'gh api -X PATCH repos/o/r/branches/dev/protection/required_status_checks --input c.json'
caso 0 'gh api -X POST repos/o/r/branches/dev/protection/required_status_checks/contexts --input c.json'
# Secretos y variables permitidos
caso 0 'gh secret set X --env dev'
caso 0 'gh variable set X --body y'
caso 0 'gh variable list --env prod'
# Fusión autorizada y cierre de fase
caso 0 './scripts/fusionar-dev.sh 12'
caso 0 'scripts/fusionar-dev.sh 12'
caso 0 'just fusionar-dev 12'
caso 0 'just cierre-fase'
caso 0 'gh pr merge --help'
# PRs hacia dev y lecturas de PRs
caso 0 'gh pr create -B dev --title x'
caso 0 'gh pr create --base dev --title x'
caso 0 'gh pr edit 12 --base dev'
caso 0 'gh pr list --base main --head dev --state merged --limit 1'
caso 0 'gh pr list --base dev --limit 1'
caso 0 'gh pr view 12'
caso 0 'gh pr checks 12 --json name,bucket'
# Forma recomendada de las comprobaciones (clases POSIX, sin la frase literal)
caso 0 'grep -c '\''gh[[:space:]]pr[[:space:]]merge'\'' scripts/cierre-fase.sh'
caso 0 'grep -c '\''"Bash(gh[[:space:]]auth[[:space:]]token'\'' .claude/settings.json'
# Trabajo diario
caso 0 'gh run list'
caso 0 'gh run rerun 123'
caso 0 'gh auth status'
caso 0 'git push -u origin fase/00.1.1-endurecimiento-de-seguridad'
caso 0 'git commit -m "fix: guardia contra main y prod"'
caso 0 'grep -r pending_deployments .'
caso 0 'security find-generic-password -s github-lucg -w'
caso 0 'curl -s https://api.github.com/repos/o/r'
caso 0 'curl -s https://api.vercel.com/v10/projects'
caso 0 'git status --short'
caso 0 'git log --oneline -5'
caso 0 'ls -la'

if [ "$fallos" -ne 0 ]; then
  echo "guardia: $fallos fallos de $total casos"
  exit 1
fi
echo "guardia: OK ($total casos)"
