![license](https://img.shields.io/badge/license-GNU-100000.svg)
![vue](https://img.shields.io/badge/>-vue-lightred.svg)
![node](https://img.shields.io/badge/>-nodejs-green.svg)
![vue](https://img.shields.io/badge/>-koa2-blue.svg)

> #### 图床服务

- Why

    ```
    1. 一款以管理图片为主导的图床
    2. 为自己的图片分类，贴标签以便后面找到它们
    3. 要建立几张图片集用于分享
    4. 想要为图片提供在线外链
    TODO: 5. 想要安安静静存储个人图片(其他人不能访问)
    ...
    ```

- #### CHANGELOG **为支持正常运行(防攻击)部分图片浏览代码未开源**

    - 新功能
    
        - 为防止非法图片在微信中分享传输，已全面禁止图片在微信中浏览

    - 1.0.7 bugfix
    
        - 调整了对图片进行分级时，若无法正确分级时的相关数据记录问题
        - 修复一个图片分级API调用时可能导致的传参异常问题

    - 1.0.7 viewer
        
        - 图片浏览支持webp格式
        
    - 1.0.7

        - UI小姐姐更新了一波前端展示效果
        - 缩略图展示正式上线，加速个人中心图片展示
        - 图片分级判断上线(不限制；限制未成年；成人图片)，后续将按照相关分级限制违规图片
        - 修复一个内部图床访问原图加载失败的问题，取消内部webp处理
        - 图片截取界面新增所截区域大小值展示
    
    - [历史记录](https://github.com/lazy-koala/imgs-upload-srv/blob/master/doc/changelog.md)
---
> #### 技术栈
- Server:

    - Node
    - Koa2
            
- WEB:

    - HTML5
    - Vue
            
- DataBase:

    - MongoDB
    - Redis
- 自建部署指南

    - [前端部署指南](https://github.com/lazy-koala/imgs-upload-srv/blob/master/doc/deploy-web.md)

    - [后端部署指南](https://github.com/lazy-koala/imgs-upload-srv/blob/master/doc/deploy-srv.md)
---    
> #### 关于我们

[![org](https://img.shields.io/badge/org-@LazyKoala-yellow.svg)](https://github.com/lazy-koala/)

[![author](https://img.shields.io/badge/author-@qazyuan-blue.svg)](https://github.com/qazyuan/) [![author](https://img.shields.io/badge/author-@acexy-blue.svg)](https://github.com/acexy/)

> #### Thanks [Jetbrains Ides](https://www.jetbrains.com/?from=imgs-upload-srv)
<img src="https://source.acexy.cn/view/XPgu+qW" width = "80" height = "80" alt="jetbrains logo" />
