# Markdown to OpenDocument text or PDF API

## Request

The server runs by default on localhost:8081. It only supports 2 calls : GET /odt and GET /pdf. The data to be processed is included in the HTTP request body. The first call returns the OpenDocument text file corresponding to the document, while the second one returns the PDF file.

## Data format

The document is encoded in JSON and must follow this syntax:

{
	"_id": string,
	"settings": object,
	"content": string
}

The **_id** field should be unique, the **content** field is the Markdown document itself, and the **settings** field contains all the information required to apply styles to the document. If empty or **null**, default values will be used. See **default.json** for the syntax of the settings object.

## Return values

### Success

The status code is 200 OK, and the HTTP packet contains the required file in its body and a Content-Type header set to either *application/vnd.oasis.opendocument.text* or *application/pdf*.

### Failure

The following error codes are possible:
* 400 Bad Request: The HTTP request is malformed or is not a GET request.
* 500 Internal Server Error: Something went wrong during the conversion process.
* 501 Not Implemented: The requested URL is not **http://serv.er/odt** or **http://serv.er/pdf**.

## Dependencies

This converter requires Python, make, gcc, Javascript and AbiWord.

