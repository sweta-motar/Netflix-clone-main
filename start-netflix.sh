#!/bin/bash
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
PROJECT_DIR="/mnt/c/Users/Swati/Desktop/devops/Netflix-clone-main"
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"

echo -e "${CYAN}Starting Netflix Clone...${NC}"

echo -e "${YELLOW}[1/5] Killing stale processes...${NC}"
pkill -f "kubectl port-forward" 2>/dev/null
docker stop backend 2>/dev/null
sleep 2

echo -e "${YELLOW}[2/5] Starting Minikube...${NC}"
minikube status | grep -q "Running" && echo "Already running" || minikube start

echo -e "${YELLOW}[3/5] Waiting for pods...${NC}"
kubectl wait --for=condition=ready pod -l app=backend  --timeout=120s 2>/dev/null
kubectl wait --for=condition=ready pod -l app=frontend --timeout=120s 2>/dev/null
kubectl get pods

echo -e "${YELLOW}[4/5] Starting port-forwards...${NC}"
kubectl port-forward service/backend 8000:8000 --address=0.0.0.0 > "$LOG_DIR/backend.log" 2>&1 &
sleep 1
cd /mnt/c/Users/Swati/Desktop/devops/Netflix-clone-main && npx serve -s dist -l 3000 > "$LOG_DIR/frontend.log" 2>&1 &
sleep 1
kubectl port-forward -n monitoring svc/monitoring-grafana 3001:80 --address=0.0.0.0 > "$LOG_DIR/grafana.log" 2>&1 &
sleep 1
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090 --address=0.0.0.0 > "$LOG_DIR/prometheus.log" 2>&1 &
sleep 3

echo -e "${YELLOW}[5/5] Verifying ports...${NC}"
for PORT in 3000 8000 9090 3001; do
  ss -tlnp | grep -q ":$PORT " && echo -e "  ${GREEN}✓ Port $PORT open${NC}" || echo -e "  ${RED}✗ Port $PORT not open${NC}"
done

echo -e "${CYAN}"
echo "════════════════════════════════════════"
echo "  Netflix App  → http://localhost:3000"
echo "  Django Admin → http://localhost:8000/admin"
echo "  Prometheus   → http://localhost:9090"
echo "  Grafana      → http://localhost:3001"
echo "════════════════════════════════════════"
echo -e "${NC}"
echo "Press Ctrl+C to stop all services."
trap "pkill -f 'kubectl port-forward'; exit 0" INT
wait
