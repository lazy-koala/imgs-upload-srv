package web

type Code int
type Message string

const (
	RtCdSuccess   Code = 0
	RtCdException Code = 9999

	RtCdUnauthorized = 8999
	RtCdCommonFailed = 7999
)

const (
	RtMsgException    Message = "System Error"
	RtMsgUnauthorized         = "Unauthorized"
	RtMsgSuccess              = "Success"

	RtMsgCommonFailed = "Execution Failed"
)

type Response struct {
	Code    Code    `json:"code"`
	Message Message `json:"message"`
	Data    any     `json:"data"`
}

var (
	successResp = &Response{
		Code:    RtCdSuccess,
		Message: RtMsgSuccess,
	}

	exceptionResp = &Response{
		Code:    RtCdException,
		Message: RtMsgException,
	}

	commonFailedResp = &Response{
		Code:    RtCdCommonFailed,
		Message: RtMsgCommonFailed,
	}
)

var rtConfig = map[Code]Message{
	RtCdException:    RtMsgException,
	RtCdUnauthorized: RtMsgUnauthorized,
	RtCdSuccess:      RtMsgSuccess,
	RtCdCommonFailed: RtMsgCommonFailed,
}

func NewSuccessResp(data ...any) *Response {
	resp := *successResp
	if len(data) > 0 {
		resp.Data = data[0]
	}
	return &resp
}

func NewExceptionResp(message ...string) *Response {
	if len(message) > 0 {
		resp := *exceptionResp
		resp.Message = Message(message[0])
		return &resp
	} else {
		return exceptionResp
	}
}

func NewCommonFailedResp(message ...string) *Response {
	if len(message) > 0 {
		resp := *commonFailedResp
		resp.Message = Message(message[0])
		return &resp
	} else {
		return commonFailedResp
	}
}

func NewCommonFailedWithDataResp(any any, message ...string) *Response {
	resp := *commonFailedResp
	resp.Data = any
	if len(message) > 0 {
		resp.Message = Message(message[0])
	}
	return &resp
}

func NewResp(rtCode Code, rtMsg ...string) *Response {
	if len(rtMsg) > 0 {
		return &Response{
			Code:    rtCode,
			Message: Message(rtMsg[0]),
		}
	}
	return &Response{
		Code:    rtCode,
		Message: rtConfig[rtCode],
	}
}
