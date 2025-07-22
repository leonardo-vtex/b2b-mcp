import json
import os

def handler(request):
    """Simple test endpoint that doesn't depend on external services"""
    from http.server import BaseHTTPRequestHandler
    
    class RequestHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            
            # Check if we can access environment variables
            env_vars = {}
            try:
                env_vars = {
                    "OPENAI_API_KEY": "SET" if os.getenv("OPENAI_API_KEY") else "NOT_SET",
                    "VERCEL_ENV": os.getenv("VERCEL_ENV", "unknown"),
                    "VERCEL_REGION": os.getenv("VERCEL_REGION", "unknown")
                }
            except Exception as e:
                env_vars = {"error": str(e)}
            
            response = {
                "message": "Vercel deployment is working!",
                "status": "success",
                "timestamp": "2024-07-21",
                "environment": env_vars,
                "function": "test.py"
            }
            
            self.wfile.write(json.dumps(response, indent=2).encode())
        
        def do_OPTIONS(self):
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
    
    return RequestHandler(request) 