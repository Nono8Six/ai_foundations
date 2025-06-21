# Makefile : commandes pour synchroniser la base locale et Supabase cloud

SUPABASE_CLI=docker compose run --rm --profile tools supabase_cli supabase

.PHONY: db-pull db-push db-reset

db-pull:
	$(SUPABASE_CLI) db pull --project-ref $$SUPABASE_PROJECT_REF --linked

db-push:
	$(SUPABASE_CLI) db push --project-ref $$SUPABASE_PROJECT_REF --no-verify-remote

db-reset:
	$(SUPABASE_CLI) db reset --linked

# Utilisation :
#   make db-pull   # Récupère le schéma cloud
#   make db-push   # Pousse les migrations locales vers le cloud
#   make db-reset  # Réinitialise la base locale à partir du cloud
