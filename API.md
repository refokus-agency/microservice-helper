## Modules

<dl>
<dt><a href="#module_validate">validate</a></dt>
<dd><p>Used to validate a basic type or schema.</p>
</dd>
<dt><a href="#module_microservice">microservice</a></dt>
<dd><p>Microservices pipeline.</p>
</dd>
<dt><a href="#module_handler">handler</a></dt>
<dd><p>Error handler module. In order to work , the project must have an error directory in the root folder.</p>
</dd>
<dt><a href="#module_debug">debug</a></dt>
<dd><p>Debug helper module.</p>
</dd>
<dt><a href="#module_db">db</a></dt>
<dd><p>Common DB functionality across different microservices.</p>
</dd>
</dl>

<a name="module_validate"></a>

## validate
Used to validate a basic type or schema.


* [validate](#module_validate)
    * [.validatePromisified(objectToValidate, schema)](#module_validate.validatePromisified) ⇒ <code>Promise</code>
    * [.validateElementPromisified(elementToValidate, type)](#module_validate.validateElementPromisified) ⇒ <code>Promise</code>

<a name="module_validate.validatePromisified"></a>

### validate.validatePromisified(objectToValidate, schema) ⇒ <code>Promise</code>
**Kind**: static method of [<code>validate</code>](#module_validate)  
**Fulfil**: <code>string</code> Result of Joi.validate().  
**Reject**: <code>Error</code> Joi Error.  

| Param | Type | Description |
| --- | --- | --- |
| objectToValidate | <code>Object</code> | An object to validate. |
| schema | <code>Object</code> | Can be a joi type object or a plain object where every key is assigned a joi type object. |

<a name="module_validate.validateElementPromisified"></a>

### validate.validateElementPromisified(elementToValidate, type) ⇒ <code>Promise</code>
**Kind**: static method of [<code>validate</code>](#module_validate)  
**Fulfil**: <code>string</code> Result of Joi.validate().  
**Reject**: <code>Error</code> Joi Error.  

| Param | Type | Description |
| --- | --- | --- |
| elementToValidate | <code>Object</code> | An element to validate. |
| type | <code>String</code> | Any of the classic basic primitive types. |

<a name="module_microservice"></a>

## microservice
Microservices pipeline.


* [microservice](#module_microservice)
    * _static_
        * [.doFn(fnc)](#module_microservice.doFn) ⇒ <code>Object</code>
    * _inner_
        * [~$pipe(fnc, state, [critical])](#module_microservice..$pipe) ⇒ <code>$pipePromise</code>

<a name="module_microservice.doFn"></a>

### microservice.doFn(fnc) ⇒ <code>Object</code>
Wrapper function. If all is ok, the result will be { ok : true , data : {result} }
When is an error in business logic, the result will be { ok : false, err : Error }.

**Kind**: static method of [<code>microservice</code>](#module_microservice)  

| Param | Type | Description |
| --- | --- | --- |
| fnc | <code>function</code> | Command function that must be executed. |

<a name="module_microservice..$pipe"></a>

### microservice~$pipe(fnc, state, [critical]) ⇒ <code>$pipePromise</code>
**Kind**: inner method of [<code>microservice</code>](#module_microservice)  

| Param | Type | Description |
| --- | --- | --- |
| fnc | <code>function</code> | Function to execute in the pipeline. |
| state | <code>Object</code> | Current state of the App. |
| [critical] | <code>boolean</code> | When $critical is present, an exception stop de pipe execution. |

<a name="module_handler"></a>

## handler
Error handler module. In order to work , the project must have an error directory in the root folder.

<a name="module_handler.handle"></a>

### handler.handle(id, [err]) ⇒ <code>Error</code>
Generate custom errors.

**Kind**: static method of [<code>handler</code>](#module_handler)  
**Returns**: <code>Error</code> - Custom Error instance.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Id to be shown. |
| [err] | <code>Error</code> | Error to be added as oldError in the return object. |

<a name="module_debug"></a>

## debug
Debug helper module.

<a name="module_debug.printModule"></a>

### debug.printModule(scope) ⇒ <code>function</code>
**Kind**: static method of [<code>debug</code>](#module_debug)  
**Returns**: <code>function</code> - Pretty Print function.  

| Param | Description |
| --- | --- |
| scope | Scope to be added to the print function. |

<a name="module_db"></a>

## db
Common DB functionality across different microservices.


* [db](#module_db)
    * [.savePromisified(element, collection)](#module_db.savePromisified) ⇒ <code>Promise</code>
    * [.findPromisified(where, collection)](#module_db.findPromisified) ⇒ <code>Promise</code>
    * [.findOnePromisified(where, collection)](#module_db.findOnePromisified) ⇒ <code>Promise</code>
    * [.findOrPromisified(where, collection)](#module_db.findOrPromisified) ⇒ <code>Promise</code>
    * [.updatePromisified(dataRaw, bundle, fields)](#module_db.updatePromisified) ⇒ <code>Promise</code>
    * [.updateNativePromisified(where, opFields, collection)](#module_db.updateNativePromisified) ⇒ <code>Promise</code>
    * [.removeNativePromisified(where, collection)](#module_db.removeNativePromisified) ⇒ <code>Promise</code>
    * [.removePromisified(where, collection)](#module_db.removePromisified) ⇒ <code>Promise</code>
    * [.populatePromisified(object, keyString, select, collection)](#module_db.populatePromisified) ⇒ <code>Promise</code>
    * [.mongoObjectId()](#module_db.mongoObjectId) ⇒ <code>string</code>

<a name="module_db.savePromisified"></a>

### db.savePromisified(element, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> { dataRaw, data }.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Obecjt</code> | Element to be stored in MongoDB. |
| collection | <code>String</code> | Collection where the element will be stored. |

<a name="module_db.findPromisified"></a>

### db.findPromisified(where, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> { dataRaw, data }.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.findOnePromisified"></a>

### db.findOnePromisified(where, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> { dataRaw, data }.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.findOrPromisified"></a>

### db.findOrPromisified(where, collection) ⇒ <code>Promise</code>
.

**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> { dataRaw, data }.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.updatePromisified"></a>

### db.updatePromisified(dataRaw, bundle, fields) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> Updated Object  
**Reject**: <code>Error</code> The error `name` property will be one of the following:  

| Param | Type | Description |
| --- | --- | --- |
| dataRaw | <code>Object</code> | Seneca Entity |
| bundle | <code>Object</code> |  |
| fields |  | Field to be modified |

<a name="module_db.updateNativePromisified"></a>

### db.updateNativePromisified(where, opFields, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Number</code> Elements updated.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| opFields | <code>String</code> | Field to be modified. |
| collection | <code>String</code> | Collection that will be updated. |

<a name="module_db.removeNativePromisified"></a>

### db.removeNativePromisified(where, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> Confirmation.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.removePromisified"></a>

### db.removePromisified(where, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Number</code> 1 to confirm.  
**Reject**: <code>Error</code> Error  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.populatePromisified"></a>

### db.populatePromisified(object, keyString, select, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> The data you wanted.  
**Reject**: <code>Error</code> The error `name` property will be one of the following:  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Objecto op pupulate |
| keyString | <code>String</code> | Key field |
| select |  |  |
| collection | <code>Object</code> | Collection of the 'object' param |

<a name="module_db.mongoObjectId"></a>

### db.mongoObjectId() ⇒ <code>string</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Returns**: <code>string</code> - Generate a mongoObjectId.  
