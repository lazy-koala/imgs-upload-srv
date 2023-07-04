package web

import (
	"github.com/gin-gonic/gin"
	"mime/multipart"
	"path/filepath"
)

type Request struct {
	ctx *gin.Context
}

func (r *Request) GetGinContext() *gin.Context {
	return r.ctx
}

// Param 获取url部分中的参数
func (r *Request) Param(key string) string {
	return r.ctx.Param(key)
}

func (r *Request) Params(keys ...string) map[string]string {
	result := make(map[string]string)
	if len(keys) > 0 {
		for _, value := range keys {
			result[value] = r.Param(value)
		}
	}
	return result
}

// urlPath 获取url中作为参数的数据

func (r *Request) ShouldBindUri(object any) error {
	return r.ctx.ShouldBindUri(object)
}

// 将json类型body数据绑定到结构体中

func (r *Request) ShouldBindJson(object any) error {
	return r.ctx.ShouldBindJSON(object)
}

func (r *Request) GetRawData() ([]byte, error) {
	return r.ctx.GetRawData()
}

// 获取请求中的原始数据 string类型

func (r *Request) GetRawDataString() (content string, err error) {
	bytes, err := r.GetRawData()
	if err != nil {
		return
	}
	content = string(bytes)
	return
}

func (r *Request) GetFormFile(name string) (*multipart.FileHeader, error) {
	return r.ctx.FormFile(name)
}

// SaveUploadedFile 保存文件 dist 如果是目录则将以原始文件名存储在指定目录
func (r *Request) SaveUploadedFile(name string, dirPath string, fileName ...string) error {
	file, err := r.GetFormFile(name)
	if err != nil {
		return err
	}
	var dist string
	if len(fileName) != 0 {
		// 未指定文件名，传入的应当是带文件名的绝对路径
		dist = dirPath + string(filepath.Separator) + fileName[0]
	} else {
		dist = dirPath + string(filepath.Separator) + file.Filename
	}
	return r.ctx.SaveUploadedFile(file, dist)
}

// GetHeaderValue 获取指定的Head值
func (r *Request) GetHeaderValue(key string) string {
	return r.ctx.GetHeader(key)
}
