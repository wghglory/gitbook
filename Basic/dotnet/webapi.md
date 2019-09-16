### Explain what is REST and RESTFUL?

REST represents REpresentational State Transfer; it is relatively new aspect of writing web api. RESTFUL is referred for web services written by applying REST architectural concept are called RESTful services, it focuses on system resources and how state of resource should be transported over HTTP protocol to a different clients written in different language. In RESTFUL web service http methods like GET, POST, PUT and DELETE can be used to perform CRUD operations.

### Explain the architectural style for creating web api?

- HTTP for client server communication
- XML/JSON as formatting language: Simple URI as the address for the services
- Stateless communication

### what tools are required to test your web api?

Chrome postman, SOAPUI tool for SOAP WS and Firefox "poster" plugin for RESTFUL services.

### what are the HTTP methods supported by REST?

- GET: It requests a resource at the request URL. It should not contain a request body as it will be discarded. May be it can be cached locally or on the server.
- POST: It submits information to the service for processing; it should typically return the modified or new resource
- PUT: At the request URL it update the resource
- DELETE: At the request URL it removes the resource
- OPTIONS: It indicates which techniques are supported
- HEAD: About the request URL it returns meta information

### Mention what is the difference between SOAP and REST?

- SOAP is a protocol through which two computer communicates by sharing XML document
- SOAP permits only XML
- SOAP based reads cannot be cached
- SOAP is like custom desktop application, closely connected to the server
- SOAP is slower than REST
- It runs on HTTP but envelopes the message

---

- Rest is a service architecture and design for network\*based software architectures
- REST supports many different data formats
- REST reads can be cached
- A REST client is more like a browser; it knows how to standardized methods and an application has to fit inside it REST is faster than SOAP
- It uses the HTTP headers to hold meta information

### Explain Web API Routing?

Routing is the mechanism of pattern matching as we have in MVC. These routes will get registered in Route Tables. Below is the sample route in Web API –

```csharp
Routes.MapHttpRoute(
    Name: "MyFirstWebAPIRoute",
    routeTemplate: "api/{controller}/{id}
    defaults: new { id = RouteParameter.Optional}
};
```

### List out the differences between WCF and Web API?

WCF

- It is framework build for building or developing service oriented applications.
- WCF can be consumed by clients which can understand XML.
- WCF supports protocols like – HTTP, TCP, Named Pipes etc.

Web API

- It is a framework which helps us to build/develop HTTP services
- Web API is an open source platform.
- It supports most of the MVC features which keep Web API over WCF.

### What are the advantages of using REST in Web API?

REST always used to make less data transfers between client and server which makes REST an ideal for using it in mobile apps. Web API supports HTTP protocol thereby it reintroduces the old way of HTTP verbs for communication.

### Difference between WCF Rest and Web API?

WCF Rest

- "WebHttpBinding" to be enabled for WCF Rest.
- For each method there has to be attributes like – "WebGet" and "WebInvoke"
- For GET and POST verbs respectively.

Web API

- Unlike WCF Rest we can use full features of HTTP in Web API.
- Web API can be hosted in IIS or in application.

### List out differences between MVC and Web API?

MVC

- MVC is used to create a web app, in which we can build web pages.
- For JSON it will return JSONResult from action method.
- All requests are mapped to the respective action methods.

Web API

- This is used to create a service using HTTP verbs.
- This returns XML or JSON to client.
- All requests are mapped to actions using HTTP verbs.

### What are the advantages of Web API?

- OData
- Filters
- Content Negotiation
- Self Hosting
- Routing
- Model Bindings

### Can we return view from Web API?

No. We cannot return view from Web API.

### How we can restrict access to methods with specific HTTP verbs in Web API?

Attribute programming is used for this functionality. Web API will support to restrict access of calling methods with specific HTTP verbs. We can define HTTP verbs as attribute over method as shown below

```csharp
[HttpPost]
public void UpdateTestCustomer(Customer c)
{
    TestCustomerRepository.AddCustomer(c);
}
```

### Explain how to give alias name for action methods in Web API?

Using attribute "ActionName" we can give alias name for Web API actions. Eg:

```csharp
[HttpPost]
[ActionName("AliasTestAction")]
public void UpdateTestCustomer(Customer c)
{
    TestCustomerRepository.AddCustomer(c);
}
```

### What is the difference between MVC Routing and Web API Routing?

There should be at least one route defined for MVC and Web API to run MVC and Web API application respectively. In Web API pattern we can find "api/" at the beginning which makes it distinct from MVC routing. In Web API routing "action" parameter is not mandatory but it can be a part of routing.

### Explain Exception Filters?

Exception filters will be executed whenever controller methods (actions) throws an exception which is unhandled. Exception filters will implement "IExceptionFilter" interface.

### Explain about the new features added in Web API 2.0 version?

- OWIN
- Attribute Routing
- External Authentication
- Web API OData

### How can we pass multiple complex types in Web API?

- Using ArrayList
- Newtonsoft JArray

### Write a code snippet for passing arraylist in Web API?

```csharp
ArrayList paramList = new ArrayList();

Category c = new Category { CategoryId = 1, CategoryName = "SmartPhones"};
Product p = new Product { ProductId = 1, Name = "Iphone", Price = 500, CategoryID = 1 };

paramList.Add(c);
paramList.Add(p);
```

### Give an example of MVC Routing?

Below is the sample code snippet to show MVC Routing –

```csharp
routes.MapRoute(
     name: "MyRoute", //route name
     url: "{controller}/{action}/{id}", //route pattern
     defaults: new
     {
         controller = "a4academicsController",
         action = "a4academicsAction",
         id = UrlParameter.Optional
     }
);
```

### How we can handle errors in Web API?

- HttpResponseException
- Exception Filters
- Registering Exception Filters
- HttpError

### Explain how we can handle error from HttpResponseException?

```csharp
public TestClass MyTestAction(int id)
{
     TestClass c = repository.Get(id);
     if (c == null)
     {
          throw new HttpResponseException(HttpStatusCode.NotFound);
     }
     return c;
}
```

```csharp
HttpResponseMessage myresponse = new HttpResponseMessage(HttpStatusCode.Unauthorized);
myresponse.RequestMessage = Request;
myresponse.ReasonPhrase = ReasonPhrase;
```

### How to register Web API exception filters?

- From Action
- From Controller
- Global registration

### Write a code snippet to register exception filters from action?

```csharp
[NotImplExceptionFilter]
public TestCustomer GetMyTestCustomer(int custid)
{
    //Your code goes here
}
```

### Write a code snippet to register exception filters from controller?

```csharp
[NotImplExceptionFilter]
public class TestCustomerController : Controller
{
    //Your code goes here
}
```

### Write a code snippet to register exception filters globally?

```csharp
GlobalConfiguration.Configuration.Filters.Add(new MyTestCustomerStore.NotImplExceptionFilterAttribute());
```

### How to handle error using HttpError?

HttpError will be used to throw the error info in response body. **CreateErrorResponse** method is used along with this, which is an extension method defined in "HttpRequestMessageExtensions".

### Write a code snippet to show how we can return 404 error from HttpError?

```csharp
string message = string.Format("TestCustomer id = {0} not found", customerid);
return Request.CreateErrorResponse(HttpStatusCode.NotFound, message);
```

### How to enable tracing in Web API?

in _Register_ method of WebAPIConfig.cs file.

```csharp
config.EnableSystemDiagnosticsTracing();
```

### Explain how Web API tracing works?

Tracing in Web API done in facade pattern i.e, when tracing for Web API is enabled, Web API will wrap different parts of request pipeline with classes, which performs trace calls.

### Explain Authentication in Web API?

Web API authentication will happen in host. In case of IIS it uses Http Modules for authentication or we can write custom Http Modules. When host is used for authentication it used to create principal, which represent security context of the application.

### Explain ASP.NET Identity?

This is the new membership system for ASP.NET. This allows to add features of login in our application.

- One ASP.NET Identity System
- Persistence Control

### What are Authentication Filters in Web API?

Authentication Filter will let you set the authentication scheme for actions or controllers. So this way our application can support various authentication mechanisms.

### How to set the Authentication filters in Web API?

Authentication filters can be applied at the controller or action level. Decorate attribute – "IdentityBasicAuthentication" over controller where we have to set the authentication filter.

### Explain method – "AuthenticateAsync" in Web API?

"AuthenticateAsync" method will create IPrincipal and will set on request

```csharp
Task AuthenticateAsync(
    HttpAuthenticationContext mytestcontext,
    CancellationToken mytestcancellationToken
)
```

### Explain method – ChallengeAsync in Web API?

to add authentication challenges to response. Below is the method signature –

```csharp
Task ChallengeAsync(
    HttpAuthenticationChallengeContext mytestcontext,
    CancellationToken mytestcancellationToken
)
```

### What are media types?

It is also called MIME, which is used to identify the data. In Html, media types is used to describe message format in the body.

### List out few media types of HTTP?

- Image/Png
- Text/HTML
- Application/Json

### Explain Media Formatters in Web API?

Media Formatters in Web API can be used to read the CLR object from our HTTP body and Media formatters are also used for writing CLR objects of message body of HTTP.

### How to serialize read\*only properties?

Read\*Only properties can be serialized in Web API by setting the value "true" to the property

```csharp
SerializeReadOnlyTypes of class: DataContractSerializerSettings
```

### How to get Microsoft JSON date format?

Use "DateFormatHandling" property in serializer settings as below

```csharp
var myjson = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
myjson.SerializerSettings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.MicrosoftDateFormat;
```

### How to indent the JSON in web API?

```csharp
var mytestjson = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
mytestjson.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
```

### How to JSON serialize anonymous and weakly types objects?

Using `Newtonsoft.Json.Linq.JObject` we can serialize and deserialize weakly typed objects.

### What is the use of IgnoreDataMember

By default if the properties are public then those can be serialized and deserialized, if we does not want to serialize the property then decorate the property with this attribute.

### How to write indented XML in Web API?

To write the indented xml set "indent" property to true.

### How to set Per\*Type xml serializer?

We can use method – "SetSerializer". Below is the sample code snippet for using it

```csharp
var mytestxml = GlobalConfiguration.Configuration.Formatters.XmlFormatter;
// Use XmlSerializer for instances of type "Product"
mytestxml.SetSerializer<Product>(new XmlSerializer(typeof(MyTestCustomer)));
```

### What is Under*Posting and "Over*Posting" in Web API?

- "Under*Posting" * When client leaves out some of the properties while binding then it’s called under–posting.
- "Over*Posting" – If the client sends more data than expected in binding then it’s called over*posting.

### How to handle validation errors in Web API?

Web API will not return error to client automatically on validation failure. So its controller’s duty to check the model state and response to that. We can create a custom action filter for handling the same.

### Give an example of creating custom action filter in Web API?

```csharp
public class MyCustomModelAttribute : ActionFilterAttribute
{
     public override void OnActionExecuting(HttpActionContext actionContext)
     {
         if (actionContext.ModelState.IsValid == false)
         {
         //Code goes here
         }
     }
}
```

In case validation fails here it returns HTTP response which contains validation errors.

### How to apply custom action filter in WebAPI.config?

Add a new action filter in "Register" method as shown \*

```csharp
public static class WebApiConfig
{
     public static void Register(HttpConfiguration config)
     {
         config.Filters.Add(new MyCustomModelAttribute());
     }
}
```

How to set the custom action filter in action methods in Web API?

Below is the sample code of action with custom action filter –

```csharp
public class MyCustomerTestController : ApiController
{
    [MyCustomModelAttribute]
    public HttpResponseMessage Post(MyTestCustomer customer)
    {
    }
}
```

### What is BSON in Web API?

It’s is a binary serialization format. "BSON" stands for "Binary JSON". BSON serializes objects to key\*value pair as in JSON. Its light weight and its fast in encode/decode.

### How to enable BSON in server?

Add "BsonMediaTypeFormatter" in WebAPI.config as shown below

```csharp
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
           config.Formatters.Add(new BsonMediaTypeFormatter());
    }
}
```

### How parameter binding works in Web API?

- If it is simple parameters like – bool, int, double etc. then value will be obtained from the URL.
- Value read from message body in case of complex types.

### Why to use "FromUri" in Web API?

In Web API to read complex types from URL we will use "FromUri" attribute to the parameter in action method. Eg:

```csharp
public MyValuesController : ApiController
{
     public HttpResponseMessage Get([FromUri] MyCustomer c) { ... }
}
```

### Why to use "FromBody" in Web API?

This attribute is used to force Web API to read the simple type from message body. "FromBody" attribute is along with parameter. Eg:

```csharp
public HttpResponseMessage Post([FromBody] int customerid, [FromBody] string customername) { ... }
```

### Why to use "IValueprovider" interface in Web API?

This interface is used to implement custom value provider.
