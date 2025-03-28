export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 測試 R2 存儲
    if (url.pathname === '/test-r2') {
      try {
        // 上傳一個測試文件
        await env.BUCKET.put('test.txt', 'Hello from R2!');
        // 讀取文件
        const object = await env.BUCKET.get('test.txt');
        return new Response(await object.text(), {
          headers: { 'Content-Type': 'text/plain' },
        });
      } catch (error) {
        return new Response('Error: ' + error.message, { status: 500 });
      }
    }
    
    // 測試 D1 數據庫
    if (url.pathname === '/test-d1') {
      try {
        // 創建測試表
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS test (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
          )
        `).run();
        
        // 插入測試數據
        await env.DB.prepare(`
          INSERT INTO test (name) VALUES (?)
        `).bind('Test Entry').run();
        
        // 查詢數據
        const result = await env.DB.prepare(`
          SELECT * FROM test
        `).all();
        
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response('Error: ' + error.message, { status: 500 });
      }
    }
    
    // 默認響應
    return new Response('Welcome to Hopenghu API!', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
}; 