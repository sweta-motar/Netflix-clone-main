#!/bin/bash
echo "Stopping all port-forwards..."
pkill -f "kubectl port-forward"
echo "Done."
