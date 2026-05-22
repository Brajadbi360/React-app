# React-app — Admin Dashboard + CI/CD + Kubernetes

Full-stack testing app with:

- **Frontend:** React 18 + Vite + glassmorphism UI (Products, Inventory, Invoices, Bills)
- **Backend:** Node.js + Express, JWT auth, `.env`-driven credentials
- **CI/CD:** GitHub Actions → GHCR image push → manifest update → ArgoCD auto-deploy
- **Platform:** Kubernetes (kind local cluster) + nginx Ingress + ArgoCD GitOps

---

## Test credentials

```
email:    admin@localhost.com
password: Admin@123
```

Credentials come from `Backend/.env` (locally) and `k8s/backend-secret.yaml` (in-cluster).

---

## Run locally (dev mode — no Docker)

Open two terminals:

```powershell
# Terminal 1 — API server
cd Backend
npm install
npm run dev          # http://localhost:5000

# Terminal 2 — React app
cd Frontend
npm install
npm run dev          # http://localhost:5173  (Vite proxies /api → :5000)
```

---

## Full CI/CD + Kubernetes deployment

### Prerequisites

| Tool | Purpose |
|------|---------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Build images, run kind |
| [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) | Local k8s cluster |
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | Cluster control |
| [Helm](https://helm.sh/docs/intro/install/) | Install ArgoCD + ingress-nginx |

---

### Step 1 — Create the local kind cluster

```powershell
# Create cluster with ingress port mappings
@'
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    kubeadmConfigPatches:
      - |
        kind: InitConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            node-labels: "ingress-ready=true"
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
        protocol: TCP
      - containerPort: 443
        hostPort: 443
        protocol: TCP
'@ | Out-File -Encoding utf8 kind-config.yaml

kind create cluster --name demo --config kind-config.yaml
kubectl cluster-info --context kind-demo
```

---

### Step 2 — Install nginx Ingress Controller

```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Wait until the controller pod is ready
kubectl wait --namespace ingress-nginx `
  --for=condition=ready pod `
  --selector=app.kubernetes.io/component=controller `
  --timeout=120s
```

---

### Step 3 — Install ArgoCD

```powershell
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
kubectl wait --namespace argocd `
  --for=condition=ready pod `
  --selector=app.kubernetes.io/name=argocd-server `
  --timeout=180s

# Get the initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret `
  -o jsonpath="{.data.password}" | `
  [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_))

# Port-forward to access the ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Open https://localhost:8080  (username: admin, password: from above)
```

---

### Step 4 — Make GHCR packages public

> GitHub Actions pushes images to GHCR during the first workflow run (Step 6). Do this after the first push.

1. Go to **github.com → your profile → Packages**
2. Open **react-app-frontend** → Package settings → Change visibility → **Public**
3. Open **react-app-backend** → Package settings → Change visibility → **Public**

This lets the kind cluster pull images without credentials.

---

### Step 5 — Apply the backend Secret (one-time)

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-secret.yaml
```

---

### Step 6 — Push code to trigger CI/CD

```powershell
git add .
git commit -m "feat: add k8s manifests and CI/CD pipeline"
git push origin main
```

GitHub Actions will:

1. Build `ghcr.io/brajadbi360/react-app-frontend:<sha>` and push to GHCR
2. Build `ghcr.io/brajadbi360/react-app-backend:<sha>` and push to GHCR
3. Pin the exact SHA in `k8s/frontend-deployment.yaml` and `k8s/backend-deployment.yaml`
4. Commit + push the updated manifests back to `main`

Watch progress at: **github.com/Brajadbi360/React-app/actions**

---

### Step 7 — Register the app in ArgoCD

```powershell
kubectl apply -f k8s/argocd-app.yaml
```

ArgoCD will now watch the `k8s/` folder on `main` and automatically sync every change. After a new image SHA is committed by CI, ArgoCD detects the diff and rolls out the new pods within ~3 minutes.

---

### Step 8 — Add hosts entry (run once, as Administrator)

```powershell
# Run PowerShell as Administrator
Add-Content C:\Windows\System32\drivers\etc\hosts '127.0.0.1 react-app.local'
```

---

### Step 9 — Open the app

```
http://react-app.local
```

Sign in with `admin@localhost.com / Admin@123`.

---

## Full pipeline flow

```
git push origin main
        │
        ▼
GitHub Actions
  ├─ Build frontend image  →  ghcr.io/brajadbi360/react-app-frontend:<sha>
  ├─ Build backend image   →  ghcr.io/brajadbi360/react-app-backend:<sha>
  └─ Commit updated k8s/frontend-deployment.yaml + k8s/backend-deployment.yaml
        │
        ▼
ArgoCD detects manifest diff  (polls every 3 min or webhook)
        │
        ▼
Pulls new images from GHCR  →  Rolling-update pods in demo-app namespace
        │
        ▼
nginx Ingress routes react-app.local → frontend pods
Frontend nginx proxies /api/ → backend service (react-app-backend:5000)
        │
        ▼
App live at http://react-app.local
```

---

## Project layout

```
React-app/
├── .github/workflows/deploy.yml   # CI/CD — build images + update manifests
├── Backend/
│   ├── Dockerfile                 # Node.js 20 production image
│   ├── .dockerignore
│   ├── .env                       # Local-only (gitignored)
│   ├── server.js
│   ├── middleware/auth.js
│   └── data/mockData.js
├── Frontend/
│   ├── Dockerfile                 # Multi-stage: Vite build → nginx
│   ├── nginx.conf                 # SPA fallback + /api/ proxy to backend service
│   ├── .dockerignore
│   └── src/
│       ├── pages/                 # Login, Overview, Products, Inventory, Invoices, Bills
│       ├── components/            # DataTable, StatusPill, PageHeader, ProtectedRoute
│       ├── context/AuthContext.jsx
│       └── styles/global.css
└── k8s/
    ├── namespace.yaml
    ├── backend-secret.yaml        # Env vars for the backend (test credentials)
    ├── backend-deployment.yaml    # Pinned image SHA updated by CI
    ├── backend-service.yaml       # ClusterIP :5000
    ├── frontend-deployment.yaml   # Pinned image SHA updated by CI
    ├── frontend-service.yaml      # ClusterIP :80
    ├── ingress.yaml               # react-app.local → frontend
    └── argocd-app.yaml            # ArgoCD Application pointing to k8s/ folder
```

---

## Useful commands

```powershell
# Check pod status
kubectl get pods -n demo-app

# Watch rollout
kubectl rollout status deploy/react-app-frontend -n demo-app
kubectl rollout status deploy/react-app-backend  -n demo-app

# View logs
kubectl logs -n demo-app deploy/react-app-backend  -f
kubectl logs -n demo-app deploy/react-app-frontend -f

# ArgoCD app status
kubectl get application react-app -n argocd

# Force ArgoCD sync immediately (without waiting 3 min)
kubectl patch application react-app -n argocd \
  --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{}}}'
```
