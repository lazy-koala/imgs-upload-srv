#### 前端部署指南
- 主要依赖
  ```
  vue 2.0
  webpack ^3.6.0
  element-ui ^2.4.1
  vuex ^3.0.1
  vue-router^3.0.1
  ```
  
- 安装打包资源

    - 切换到目录 html-web&安装依赖
      ```bash
      npm install
      ```
    
    - 本地启动Http服务 http://localhost:8080 (可选测试)
      ```bash
      npm run dev
      ```
    
    - 项目打包生成dist目录下的http应用资源文件
      ```bash
      npm run build
      ```
      
- Nginx配置
```
    目前部署采用nginx做http服务层，并做后端接口调用映射

server{

    listen 80;
    server_name yourdomain.com;

    # 配置请求node服务端接口映射
    location /api/ {
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header Host $host;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_pass http://127.0.0.1:8005/;
    }

    # 配置指定dist目录http资源位置映射
    location / {
        try_files $uri $uri/ /index.html;
        root **/dist/; # 编译生产的dist资源目录位置
    }
    
    # 由于部署的图片服务器域名和服务域名不一致 该配置用于将图片服务器的下载资源映射到当前域名下以解决前端跨域下载
    location /download/ {
        alias */*/;    # 服务图片上传的物理位置目录 同 node-srv/config/upload.json
        autoindex off;
        autoindex_exact_size on;
        autoindex_localtime on;
    }
}
```