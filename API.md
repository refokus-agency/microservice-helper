## Modules

<dl>
<dt><a href="#module_validate">validate</a></dt>
<dd><p>Used to validate a basic type or schema.</p>
</dd>
<dt><a href="#module_pipePromise">pipePromise</a></dt>
<dd><p>$pipePromise.</p>
</dd>
<dt><a href="#module_microservice">microservice</a></dt>
<dd><p>Microservices pipeline.</p>
</dd>
<dt><a href="#module_errors">errors</a></dt>
<dd><p>Error handler module. In order to work , the project must have an error directory in the root folder.</p>
</dd>
<dt><a href="#module_debug">debug</a></dt>
<dd><p>Debug helper module.</p>
</dd>
<dt><a href="#module_db">db</a></dt>
<dd><p>Common DB functionality across different microservices.</p>
</dd>
<dt><a href="#module_cache">cache</a></dt>
<dd></dd>
</dl>

<a name="module_validate"></a>

## validate
Used to validate a basic type or schema.


* [validate](#module_validate)
    * [.joi(objectToValidate, schema)](#module_validate.joi) ⇒ <code>Promise</code>
    * [.joiElement(elementToValidate, type)](#module_validate.joiElement) ⇒ <code>Promise</code>

<a name="module_validate.joi"></a>

### validate.joi(objectToValidate, schema) ⇒ <code>Promise</code>
**Kind**: static method of [<code>validate</code>](#module_validate)  
**Fulfil**: <code>string</code> Result of Joi.validate().  
**Reject**: <code>Error</code> Joi Error.  

| Param | Type | Description |
| --- | --- | --- |
| objectToValidate | <code>Object</code> | An object to validate. |
| schema | <code>Object</code> | Can be a joi type object or a plain object where every key is assigned a joi type object. |

<a name="module_validate.joiElement"></a>

### validate.joiElement(elementToValidate, type) ⇒ <code>Promise</code>
**Kind**: static method of [<code>validate</code>](#module_validate)  
**Fulfil**: <code>string</code> Result of Joi.validate().  
**Reject**: <code>Error</code> Joi Error.  

| Param | Type | Description |
| --- | --- | --- |
| elementToValidate | <code>Object</code> | An element to validate. |
| type | <code>String</code> | Any of the classic basic primitive types. |

<a name="module_pipePromise"></a>

## pipePromise
$pipePromise.

<a name="module_pipePromise.$pipe"></a>

### pipePromise.$pipe(fnc, state, [critical]) ⇒ <code>$pipePromise</code>
**Kind**: static method of [<code>pipePromise</code>](#module_pipePromise)  

| Param | Type | Description |
| --- | --- | --- |
| fnc | <code>function</code> | Function to execute in the pipeline. |
| state | <code>Object</code> | Current state of the App. |
| [critical] | <code>boolean</code> | When $critical is present, an exception stop de pipe execution. |

<a name="module_microservice"></a>

## microservice
Microservices pipeline.

<a name="module_microservice.doFn"></a>

### microservice.doFn(fnc) ⇒ <code>Object</code>
Wrapper function. If all is ok, the result will be { ok : true , data : {result} }
When is an error in business logic, the result will be { ok : false, err : Error }.

**Kind**: static method of [<code>microservice</code>](#module_microservice)  

| Param | Type | Description |
| --- | --- | --- |
| fnc | <code>function</code> | Command function that must be executed. |

<a name="module_errors"></a>

## errors
Error handler module. In order to work , the project must have an error directory in the root folder.

<a name="module_errors.handle"></a>

### errors.handle(id, [err]) ⇒ <code>Error</code>
Generate custom errors.

**Kind**: static method of [<code>errors</code>](#module_errors)  
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
    * [.save(element, collection)](#module_db.save) ⇒ <code>Promise</code>
    * [.find(where, collection)](#module_db.find) ⇒ <code>Promise</code>
    * [.findOne(where, collection)](#module_db.findOne) ⇒ <code>Promise</code>
    * [.findOr(where, collection)](#module_db.findOr) ⇒ <code>Promise</code>
    * [.update(dataRaw, bundle, fields)](#module_db.update) ⇒ <code>Promise</code>
    * [.updateNative(where, opFields, collection)](#module_db.updateNative) ⇒ <code>Promise</code>
    * [.removeNative(where, collection)](#module_db.removeNative) ⇒ <code>Promise</code>
    * [.remove(where, collection)](#module_db.remove) ⇒ <code>Promise</code>
    * [.populate(object, keyString, select, collection)](#module_db.populate) ⇒ <code>Promise</code>
    * [.mongoObjectId()](#module_db.mongoObjectId) ⇒ <code>string</code>

<a name="module_db.save"></a>

### db.save(element, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> { dataRaw, data }.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Obecjt</code> | Element to be stored in MongoDB. |
| collection | <code>String</code> | Collection where the element will be stored. |

<a name="module_db.find"></a>

### db.find(where, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> { dataRaw, data }.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.findOne"></a>

### db.findOne(where, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> { dataRaw, data }.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.findOr"></a>

### db.findOr(where, collection) ⇒ <code>Promise</code>
.

**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> { dataRaw, data }.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.update"></a>

### db.update(dataRaw, bundle, fields) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> Updated Object  
**Reject**: <code>Error</code> The error `name` property will be one of the following:  

| Param | Type | Description |
| --- | --- | --- |
| dataRaw | <code>Object</code> | Seneca Entity |
| bundle | <code>Object</code> |  |
| fields |  | Field to be modified |

<a name="module_db.updateNative"></a>

### db.updateNative(where, opFields, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Number</code> Elements updated.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| opFields | <code>String</code> | Field to be modified. |
| collection | <code>String</code> | Collection that will be updated. |

<a name="module_db.removeNative"></a>

### db.removeNative(where, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Object</code> Confirmation.  
**Reject**: <code>Error</code> Error generated by Seneca Entity.  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.remove"></a>

### db.remove(where, collection) ⇒ <code>Promise</code>
**Kind**: static method of [<code>db</code>](#module_db)  
**Fulfil**: <code>Number</code> 1 to confirm.  
**Reject**: <code>Error</code> Error  

| Param | Type | Description |
| --- | --- | --- |
| where | <code>Object</code> | Query to be executed. |
| collection | <code>String</code> | Collection to be used. |

<a name="module_db.populate"></a>

### db.populate(object, keyString, select, collection) ⇒ <code>Promise</code>
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
<a name="module_cache"></a>

## cache

* [cache](#module_cache)
    * [.addKey(key, value, timeout)](#module_cache.addKey)
    * [.getValue(Key)](#module_cache.getValue) ⇒ <code>Object</code>
    * [.removeKey(key)](#module_cache.removeKey) ⇒ <code>Int</code>

<a name="module_cache.addKey"></a>

### cache.addKey(key, value, timeout)
Add key to Redis cache.
IMPORTANT!
The key must include correct namespace to prevent data collisions

**Kind**: static method of [<code>cache</code>](#module_cache)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to store |
| value | <code>String</code> | Value to store |
| timeout | <code>int</code> | timeout to expire keys |

<a name="module_cache.getValue"></a>

### cache.getValue(Key) ⇒ <code>Object</code>
Get value from Redis cache.

**Kind**: static method of [<code>cache</code>](#module_cache)  

| Param | Type | Description |
| --- | --- | --- |
| Key | <code>String</code> | to obtain value. |

<a name="module_cache.removeKey"></a>

### cache.removeKey(key) ⇒ <code>Int</code>
Remove key from Redis cache.

**Kind**: static method of [<code>cache</code>](#module_cache)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to remove. |

