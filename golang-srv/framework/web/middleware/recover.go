package middleware

import (
	"github.com/gin-gonic/gin"
	"runtime/debug"
)

func Recover() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				debug.PrintStack()
				ctx.Abort()
			} else {
				ctx.Next()
			}
		}()
	}
}
