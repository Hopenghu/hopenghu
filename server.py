from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import urllib.parse

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # URL 解碼路徑
        self.path = urllib.parse.unquote(self.path)
        
        # 處理 favicon.ico 請求
        if self.path == '/favicon.ico':
            self.path = '/public/favicon.ico'
        
        # 如果請求根路徑，重定向到 index.html
        elif self.path == '/':
            self.path = '/pages/index.html'
        
        # 處理 HTML 文件路徑
        elif self.path.endswith('.html') and not self.path.startswith('/pages/'):
            self.path = f'/pages{self.path}'
        
        # 處理 CSS 文件路徑
        elif self.path.startswith('/pages/public/'):
            self.path = self.path.replace('/pages/public/', '/public/')
        
        print(f"Requesting: {self.path}")
        return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    # 確保工作目錄是項目根目錄
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    server_address = ('127.0.0.1', 8000)
    httpd = HTTPServer(server_address, CustomHandler)
    print(f'Starting server at http://{server_address[0]}:{server_address[1]}/')
    print('Root directory:', os.getcwd())
    httpd.serve_forever() 