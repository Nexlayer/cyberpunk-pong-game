# Nexlayer — cyberpunk-pong-game

<!-- nexlayer:meta version=1 analyzed=2026-06-16T15:20:58Z repo=https://github.com/Nexlayer/cyberpunk-pong-game branch=main -->

> **For AI agents (Claude Code, Cursor, Gemini CLI, Copilot):**
> This file is the **project context** for this Nexlayer deployment — tech stack, env vars, secrets, live URL.
> For full platform detail (nexlayer.yaml schema, Dockerfile rules, CI/CD, task recipes) read **`nexlayer.skills`** in this repo.
>
> **Critical rules (full detail in `nexlayer.skills`):**
> - Inter-pod refs: `${podName:port}` only — never `localhost` or bare hostnames
> - Docker Hub images: prefix with `mirror.gcr.io/library/` — bare tags fail on the cluster
> - Secrets: set in the Nexlayer dashboard — never commit to `nexlayer.yaml` or Dockerfile
>
> **This file:** `agent-managed` sections update automatically. `user-editable` sections (Local Development Setup, Nexlayer Deployment Plan, Build Notes) are yours — preserved across re-analysis.

## Project Summary
<!-- nexlayer:section agent-managed=project_summary -->
A futuristic, neon-styled Pong game with cyberpunk aesthetics, featuring an AI opponent and dynamic visual effects implemented using HTML5 Canvas and vanilla JavaScript.
<!-- nexlayer:end -->

## Technology Stack
<!-- nexlayer:section agent-managed=tech_stack -->
| Name | Kind | Version | Detected From |
|------|------|---------|---------------|
| HTML5 | language | 5 | index.html |
| CSS3 | language | 3 | style.css |
| JavaScript | language | ES6+ | script.js |
| Nginx | infra | alpine | Dockerfile |
<!-- nexlayer:end -->

## Repository Structure
<!-- nexlayer:section agent-managed=structure_map -->
- index.html — Entry point and game layout
- style.css — Cyberpunk themes and animations
- script.js — Game engine, AI logic, and canvas rendering
- Dockerfile — Nginx configuration for static hosting
<!-- nexlayer:end -->

## External Services Required
<!-- nexlayer:section agent-managed=external_deps -->
_No external services detected._
<!-- nexlayer:end -->

## Local Development Setup
<!-- nexlayer:section user-editable=local_setup -->
### Prerequisites

- Web Browser (Chrome/Firefox/Safari/Edge)

### Steps

1. `open index.html` — Open the HTML file directly in any modern web browser

<!-- nexlayer:end -->

## Nexlayer Setup
<!-- nexlayer:section agent-managed=nexlayer_setup -->
### nexlayer.yaml

```yaml
application:
  name: cyberpunk-pong
  pods:
    - name: web
      image: registry.nexlayer.io/nexlayer-mcp/nexlayer/cyberpunk-pong-game:f8c9d8e
      path: /
      servicePorts:
        - 80
```

<!-- nexlayer:end -->

## Nexlayer Deployment Plan
<!-- nexlayer:section user-editable=deployment_plan -->
### Pod Topology

| Pod | Image | Port | Role |
|-----|-------|------|------|
| game-web | mirror.gcr.io/library/nginx:alpine | 80 | web |

### Deployment notes

- Application is purely static; served via Nginx pod
- No backend or database required

<!-- nexlayer:end -->

## Build Notes
<!-- nexlayer:section user-editable=build_notes -->
<!-- Add notes for future builds here — preserved across re-analysis -->
<!-- nexlayer:end -->

## Nexlayer Configuration
<!-- nexlayer:section agent-managed=nexlayer_config -->
**Last deployed:** 2026-06-16T15:21:31Z  
**Live URL:** https://kitbear-studio-cyberpunk-pong.cloud.nexlayer.ai  
**Runtime:**  · **Port:** auto-detected  
**Deploy branch:** main  

```yaml
application:
  name: cyberpunk-pong
  pods:
    - name: web
      image: registry.nexlayer.io/nexlayer-mcp/nexlayer/cyberpunk-pong-game:f8c9d8e
      path: /
      servicePorts:
        - 80
```
<!-- nexlayer:end -->

## Build History
<!-- nexlayer:section agent-managed=build_history -->
| Date | Status | Notes |
|------|--------|-------|
| 2026-06-16T15:20:58Z | analyzed | initial repo analysis |
| 2026-06-16T15:21:31Z | success | deployed https://kitbear-studio-cyberpunk-pong.cloud.nexlayer.ai |
<!-- nexlayer:end -->
