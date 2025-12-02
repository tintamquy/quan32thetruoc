#!/bin/bash

echo "========================================"
echo "  Quan 32 The Truoc - Local Server"
echo "========================================"
echo ""
echo "Starting HTTP server on port 8000..."
echo ""
echo "Open your browser and go to:"
echo "  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8000

