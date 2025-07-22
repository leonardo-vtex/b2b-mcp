import json

def handler(request):
    """Ultra simple test endpoint with no dependencies"""
    from http.server import BaseHTTPRequestHandler
    
    class RequestHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            
            response = {
                "message": "Hello from Vercel!",
                "status": "working",
                "function": "simple.py"
            }
            
            self.wfile.write(json.dumps(response).encode())
    
    return RequestHandler(request) 