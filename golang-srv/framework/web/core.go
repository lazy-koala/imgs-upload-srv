package web

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type GinWrap struct {
	gRouter *gin.RouterGroup
}

type RouterConfig struct {
	GroupPath string
}

type Routers interface {
	RouterInfo() *RouterConfig
	Register(h *GinWrap)
}

type HandlerWrap func(request *Request) (*Response, error)

type AllRouters func() []Routers

func LoadRouter(gine *gin.Engine, routers AllRouters) {
	for _, v := range routers() {
		r := v.RouterInfo()
		wrap := &GinWrap{
			gRouter: gine.Group(r.GroupPath),
		}
		v.Register(wrap)
	}
}

func (r *GinWrap) handle(method string, path string, handler HandlerWrap) {
	r.gRouter.Handle(method, path, func(context *gin.Context) {
		response, err := handler(&Request{context})
		if err == nil {
			if response == nil {
				response = &Response{
					Message: RtMsgSuccess,
					Code:    RtCdSuccess,
				}
			} else {
				if response.Code == RtCdSuccess && response.Message == "" {
					response.Message = RtMsgSuccess
				}
			}
			context.JSON(http.StatusOK, response)
		} else {
			_ = context.Error(err)
			context.JSON(http.StatusOK, NewExceptionResp())
		}
	})
}

func (r *GinWrap) POST(path string, handler HandlerWrap) {
	r.handle(http.MethodPost, path, handler)
}
func (r *GinWrap) GET(path string, handler HandlerWrap) {
	r.handle(http.MethodGet, path, handler)
}
func (r *GinWrap) HEAD(path string, handler HandlerWrap) {
	r.handle(http.MethodHead, path, handler)
}
func (r *GinWrap) PUT(path string, handler HandlerWrap) {
	r.handle(http.MethodPut, path, handler)
}
func (r *GinWrap) PATCH(path string, handler HandlerWrap) {
	r.handle(http.MethodPatch, path, handler)
}
func (r *GinWrap) DELETE(path string, handler HandlerWrap) {
	r.handle(http.MethodDelete, path, handler)
}
func (r *GinWrap) OPTIONS(path string, handler HandlerWrap) {
	r.handle(http.MethodOptions, path, handler)
}
func (r *GinWrap) TRACE(path string, handler HandlerWrap) {
	r.handle(http.MethodTrace, path, handler)
}
