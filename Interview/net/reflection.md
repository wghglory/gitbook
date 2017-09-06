# [.net反射](http://www.cnblogs.com/linzheng/archive/2010/12/13/1904661.html)

反射就是动态发现类型信息的能力。它帮助程序设计人员在程序==**运行时利用一些信息去动态地使用类型**==，这些信息在设计时是未知的，这种能力类型于后期绑定。反射还支持的更高级的行为，能在运行时==动态创建新类型，并且对这些新类型的操作进行调用==。

### 常用的反射例子

* 变化数据库，通过反射动态读取配置文件
* SqlHelper SqlDataReader读取数据库，表明通过反射加载
* 开发windows form插件：
    1. 创建接口项目，通过接口定义插件实现方式
    2. 创建插件项目，创建两个插件一个实现汉英翻译功能，一个实现定时关机功能。插件项目要引用接口项目。编译时让插件项目生成在主程序的debug/plugin目录下
    3. 创建主程序，主程序要添加对接口项目的引用(不需要对插件引用，对插件的调用是动态的)
    4. 主程序中读取Plugin目录下的所有dll文件，加载成Assembly。Ass.GetExportedTypes读取Assembly中的公共类型。
    5. IsAssignableFrom判断对象能否委派给某类型，是否是类并且不能使抽象类

### 反射中经常使用的类

**Assembly类**

Assembly类是可重用、无版本冲突并且可自我描述的公共语言运行库应用程序构造块。可以使用Assembly.Load和Assembly.LoadFrom方法动态地加载程序集。

**Type类**

反射的中心是System.Type类。System.Type类是一个抽象类，代表公用类型系统中的一种类型。这个类使您能够查询类型名、类型中包含的模块和名称空间、以及该类型是一个数值类型还是一个引用类型。System.Type类使您能够查询几乎所有与类型相关的属性，包括类型访问限定符、类型是否、类型的COM属性等等。

**Activator类**

Activator类支持动态创建.NET程序集和COM对象。可以通过CreateComInstanceFrom、CreateInstance、CreateInstanceFrom、GetObject四个静态方法加载COM对象或者程序集，并能**创建指定类型的实例**。

**Binder类**

Binder类是一个用于执行类型转换的绑定器，Type对象的InvokeMember方法接受Binder对象，这个对象描述了如何将传递给InvokeMember的参数转换成方法实际需要的类型。Binder类是一个抽象类，要创建绑定器，需要重写方法BindToMethod、BindToField、SelectMehtod、SelectProperty和ChangeType。

**DefaultMemberAttribute类**

DefaultMemberAttribute类用于类型并带有一个指明默认成员名称的字符串参数。能够通过InvokeMember调用默认成员，而不需要传递调用成员的名称。当需要绑定器但不需要特别的绑定行为时就可以使用它。

还有一些对元素类型信息描述的类，ConstrutorInfo（构造函数）、MethodInfo（方法）、FieldInfo（字段）、PropertyInfo（属性）、EventInfo（事件）、MemberInfo（成员）、ParameterInfo（参数）。如果查询得到了具有任何类型信息的实例，就可以获得该类型中任意元素的类型信息，当然出于安全原因，不保证会得到程序集中的任何信息。

### 示例

```csharp
using System;
using System.Collections.Generic;
using System.Text;

namespace ReflectionSample
{
    public class ClassSample
    {
        // 默认构造
        public ClassSample()
        {
            this.name = "您调用了默认构造创建了一个类实例。";
        }

        // 带参构造
        public ClassSample(string name)
        {
            this.name = name;
        }

        // 字段
        public string name;

        public string Field;

        // 属性
        private string property;
        public string Property
        {
            set { this.property = value; }
            get { return property; }
        }

        // public方法
        public string PublicClassMethod()
        {
            return string.Format("您反射了一个Public方法");
        }

        // private方法
        private string PrivateClassMethod()
        {
            return string.Format("您反射了一个Private方法");
        }

        // static方法
        public static string StaticMethod()
        {
            return "您反射了一个Static方法";
        }

        // 帶參方法
        public string ParameterMethod(string para)
        {
            return para;
        }

        public event EventHandler eventHandler;

        public void DoEvent()
        {
            eventHandler(null,EventArgs.Empty);
        }
    }
}
```

```csharp
using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

using System.Reflection;
using ReflectionSample;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string path = Server.MapPath(Request.Path);
        string filePath = path.Substring(0, path.LastIndexOf(''\\'')) + @"\bin\ReflectionSample.dll";
        // 获取程序集
        Assembly classSampleAssembly = Assembly.LoadFrom(filePath);

        // 从程序集中获取指定对象类型
        Type classSampleType = classSampleAssembly.GetType("ReflectionSample.ClassSample");


        // 通过对象类型创建对象实例
        ClassSample s1 = Activator.CreateInstance(classSampleType) as ClassSample;
        Response.Write(s1.name + "（使用Activator创建一个实例）");

        // 动态调用无参构造
        ConstructorInfo studentConstructor1 = classSampleType.GetConstructor(new Type[] { });
        ClassSample s2 = studentConstructor1.Invoke(new object[] { }) as ClassSample;
        Response.Write(s2.name + "");

        // 动态调用有参构造
        ConstructorInfo studentConstructor2 = classSampleType.GetConstructor(new Type[] { typeof(string) });
        ClassSample s3 = studentConstructor2.Invoke(new object[] { "您调用了有参构造创建了一个类实例。" }) as ClassSample;
        Response.Write(s3.name + "");


        // 调用非静态方法
        string returnValue1 = classSampleType.InvokeMember("PublicClassMethod", BindingFlags.InvokeMethod | BindingFlags.Public | BindingFlags.Instance, null, s1, new object[] { }) as string;
        Response.Write(returnValue1 + "");

        // 调用静态方法
        string returnValue2 = classSampleType.InvokeMember("StaticMethod", BindingFlags.InvokeMethod | BindingFlags.Public | BindingFlags.Static, null, s1, new object[] { }) as string;
        Response.Write(returnValue2 + "");

        // 调用私有方法
        string returnValue3 = classSampleType.InvokeMember("PrivateClassMethod", BindingFlags.InvokeMethod | BindingFlags.NonPublic | BindingFlags.Instance, null, s1, new object[] { }) as string;
        Response.Write(returnValue3 + "");

        //反射参数
        MethodInfo parameterMethod = classSampleType.GetMethod("ParameterMethod");
        ParameterInfo[] paras = parameterMethod.GetParameters();

	    for (int i = 0; i < paras.Length; i++ ){
			 Console.WriteLine(
				$"{paras[i].Name},
				{paras[i].ParameterType.ToString()},
				{paras[i].IsOptional.ToString()},
				{paras[i].Position.ToString()},
				{paras[i].DefaultValue.ToString()}"
			 );
		 }

        //反射属性
        classSampleType.InvokeMember("Property", BindingFlags.SetProperty | BindingFlags.Public | BindingFlags.Instance, null, s1, new object[] { "您反射了一个属性" });
        string returnValue4 = classSampleType.InvokeMember("Property", BindingFlags.GetProperty | BindingFlags.Public | BindingFlags.Instance, null, s1, new object[] { }) as string;
        Response.Write(returnValue4 + "");

        //反射字段
        classSampleType.InvokeMember("Field", BindingFlags.SetField | BindingFlags.Public | BindingFlags.Instance, null, s1, new object[] { "您反射了一个字段" });
        string returnValue5 = classSampleType.InvokeMember("Field", BindingFlags.GetField | BindingFlags.Public | BindingFlags.Instance, null, s1, new object[] { }) as string;
        Response.Write(returnValue5 + "");
    }
}
```

### .net反射优缺点

缺点：

- 编译器无法对对象进行类型检查
- 编写更多的代码来实现
- 速度慢

优势：

- 为创建对象和调用其他方法提供了替代方案。比如为了提高代码的灵活性
- 将指定具体类推迟到了运行时刻。

### 使用反射机制调用方法的四步曲

1. 加载程序集
2. 获取类的类型
3. 创建该类的实例
4. 调用该实例的方法

System.Reflection.Assembly类中有两个静态方法Assembly.Load(string assemblyName)和Assembly.LoadFrom(string fileName)来把程序集加载到应用程序序域中。

在.NET中当一个对象被创建时，幕后到底发生了什么？当我们运行某一个应用程序时，.NET CLR会首先创建一个应用程序域来容纳这个应用程序，接着将应该引用的程序集加载到应用程序域中。其中MSCorLib.dll是一个程序集，它包含了很多系统命名空间及其子命名空间中的类：System;System.Text,System.IO等。然后CLR加载正在运行的应用程序所属的程序集。

```csharp
namespace ClassLibrarySport
{
	// define abstract class
	public abstract class Sport
	{
		protected string Name;
		public abstract string GetName();
		public abstract string GetDuration();
	}
}

namespace ClassLibrarySomeSports
{
	public class Football : ClassLibrarySport.Sport
	{
		public Football()
		{
			Name = "Football";
		}

		public override string GetName()
		{
			return Name;
		}

		public override string GetDuration()
		{
			return "four 15 minute quarters";
		}
	}
}

// reflection usage:
using System;
using System.Reflection;

namespace ConsoleAssemblyTest
{
	class Program
	{
		static void Main(string[] args)
		{
			Assembly assembly = Assembly.LoadFrom(@"E:\ClassLibrarySomeSports\bin\Debug\ClassLibrarySomeSports.dll");

			Type[] types = assembly.GetTypes();

			Console.WriteLine("Get Type From ClassLibrarySomeSports.dll:");

			for (int i = 0; i < types.Length; i++)
			{
				Console.WriteLine(types[i].Name);
			}

			//使用GetConstructor()方法获取对应类型的构造器，从而构造出该类型的对象
			Console.WriteLine("Use Method GetConstructor():");

			ConstructorInfo ci = types[0].GetConstructor(new Type[0]);
			ClassLibrarySport.Sport sport = (ClassLibrarySport.Sport)ci.Invoke(new object[0]);
			Console.WriteLine(sport.GetName() + " has " + sport.GetDuration());

			//使用Activator.CreateInstance()方法构造出该类型的对象
			//使用assembly.CreateInstance()返回为null，？？

			Console.WriteLine("Use Method CreateInstance():");

			ClassLibrarySport.Sport sport1 = (ClassLibrarySport.Sport)Activator.CreateInstance(types[0]);

			Console.WriteLine(sport1.GetName() + " has " + sport1.GetDuration());

			//反射指定类型中的名称为“GetDuration”的方法，通过Invoke()方法执行该方法

			object objSport = Activator.CreateInstance(types[0]);
			MethodInfo method = types[0].GetMethod("GetDuration");
			object o = method.Invoke(objSport, new object[0]);
			Console.WriteLine(o as string);

			Console.ReadKey();
		}
	}
}
```


| **类型**        | **作用**                                   |
| ------------- | ---------------------------------------- |
| Assembly      | 通过此类可以加载操纵一个程序集，并获取程序集内部信息               |
| EventInfo     | 该类保存给定的事件信息                              |
| FieldInfo     | 该类保存给定的字段信息                              |
| MethodInfo    | 该类保存给定的方法信息                              |
| MemberInfo    | 该类是一个基类，它定义了EventInfo、FieldInfo、MethodInfo、PropertyInfo的多个公用行为 |
| Module        | 该类可以使你能访问多个程序集中的给定模块                     |
| ParameterInfo | 该类保存给定的参数信息                              |
| PropertyInfo  | 该类保存给定的属性信息                              |

 

### System.Reflection.Assembly类

通过Assembly可以动态加载程序集，并查看程序集的内部信息，其中最常用的就是Load()这个方法。

`Assembly assembly=Assembly.Load("MyAssembly");`

利用Assembly的object CreateInstance(string) 方法可以反射创建一个对象，参数0为类名。 

### System.Type类

Type是最常用到的类，通过Type可以得到一个类的内部信息，也可以通过它反射创建一个对象。一般有三个常用的方法可得到Type对象。

1. 利用typeof() 得到Type对象

   Type type=typeof(Example);

2. 利用System.Object.GetType() 得到Type对象

   Example example=new Example();
   Type type=example.GetType();

3. 利用System.Type.GetType() 得到Type对象

   Type type=Type.GetType("MyAssembly.Example",false,true);

   注意参数0是类名，参数1表示若找不到对应类时是否抛出异常，参数1表示类名是否区分大小写

例子：

   我们最常见的是利用反射与Activator结合来创建对象。

```csharp
Assembly assembly= Assembly.Load("MyAssembly");
Type type=assembly.GetType("Example");
object obj=Activator.CreateInstance(type);
```

### 反射方法

1. 通过 System.Reflection.MethodInfo能查找到类里面的方法

    ```csharp
    Type type=typeof(Example);
    
    MethodInfo[] listMethodInfo=type.GetMethods();
    
    foreach(MethodInfo methodInfo in listMethodInfo)
        Cosole.WriteLine("Method name is "+methodInfo.Name);
    ```

1. 我们也能通过反射方法执行类里面的方法

    ```csharp
    Assembly assembly= Assembly.Load("MyAssembly");
    
    Type type=assembly.GetType("Example");
    
    object obj=Activator.CreateInstance(type);
    
    MethodInfo methodInfo=type.GetMethod("Hello World");  //根据方法名获取MethodInfo对象
    
    methodInfo.Invoke(obj,null);  //参数1类型为object[]，代表Hello World方法的对应参数，输入值为null代表没有参数
    ```

### 四、反射属性

1. 通过 System.Reflection.PropertyInfo 能查找到类里面的属性

    常用的方法有GetValue（object,object[]) 获取属性值和 SetValue(object,object,object[]) 设置属性值


    ```csharp
    Type type=typeof(Example);
    
    PropertyInfo[] listPropertyInfo=type.GetProperties();
    
    foreach(PropertyInfo propertyInfo in listPropertyInfo)
    ​    Cosole.WriteLine("Property name is "+ propertyInfo.Name);
    ```

2. 我们也可以通过以下方法设置或者获取一个对象的属性值

    ```csharp
    Assembly assembly=Assembly.Load("MyAssembly");
    
    Type type=assembly.GetType("Example");
    
    object obj=Activator.CreateInstance(type);
    
    PropertyInfo propertyInfo=obj.GetProperty("Name");    //获取Name属性对象
    
    var name=propertyInfo.GetValue(obj,null）;                //获取Name属性的值
    
    PropertyInfo propertyInfo2=obj.GetProperty("Age");     //获取Age属性对象
    
    propertyInfo.SetValue(obj,34,null);                              //把Age属性设置为34   
    ```
 
### 五、反射字段

通过 System.Reflection.FieldInfo 能查找到类里面的字段

它包括有两个常用方法SetValue（object ,object )和GetValue（object)  因为使用方法与反射属性非常相似

### 六、反射特性

通过System.Reflection.MemberInfo的GetCustomAttributes(Type,bool)就可反射出一个类里面的特性,以下例子可以反射出一个类的所有特性

```csharp
Type type=typeof("Example");
object[] typeAttributes=type.GetCustomAttributes(false);       //获取Example类的特性

foreach(object attribute in typeAttributes)
    Console.WriteLine("Attributes description is "+attribute.ToString());
```
  

通过下面例子，可以获取Example类Name属性的所有特性

```csharp
public class Example
{
	[DataMemberAttribute]
	publics string Name { get; set; }
}

Type type = typeof(Example);
PropertyInfo propertyInfo = type.GetProperty("Name");    //获取Example类的Name属性
foreach (object attribute in propertyInfo.GetCustomAttributes(false)) {
	  //遍历Name属性的所有特性
      Console.WriteLine("Property attribute: "+attribute.ToString());
}     
```
 
### 七、常用实例

虽然反射有很多奥妙之处，但要注意使用反射生成对象会耗费很多性能，所能必须了解反射的特性，在合适的地方使用。最常见例子就是利用单体模式与反射一并使用，在BLL调用DAL的时候，通过一个反射工厂生成DAL实例。

```csharp
namespace Project.Common
{
    public class Factory
    {
        //记录dal的对象
        private static Hashtable dals;
        //用assemblyString记录DAL程序集的全名称
        private static string assemblyString = ConfigurationManager.AppSettings["LinqDAL"];
        private static Assembly assembly;

        static Factory()
        {
            dals = new Hashtable();
            assembly = Assembly.Load(assemblyString);
        }

        private static object CreateInstance(string typeName)
        {
            //当第一次加载时，将反射对象保存于dals集合里
            if (!dals.ContainsKey(typeName))
            {
                //创建反射对象
                object object1 = assembly.CreateInstance(typeName);

                if (object1 == null)
                    throw new Exception("未能创建此对象");
                //把对象加入dals集合
                dals["typeName"] = object1;
            }
            return dals["typeName"];
        }

        public static IExampleDAL CreateExampleDAL()
        {
            return (IExampleDAL)CreateInstance(assemblyString + ".ExampleDAL");
        }
    }

     class Program
    {
        //利用工厂模式生成对象
        static void Main(string[] args)
        {
            IExampleDAL iExampleDAL=Factory.CreateExampleDAL();
            .................
            Console.ReadKey();
        }
    }
}

namespace Project.IDAL
{
    public interface IExampleDAL
    {
        ///<summary>
        /// 插入Example行，若插入成功，则返回新增Example的行数
        ///</summary>
        ///<param name="example">Example对象</param>
        ///<returns>返回新增Example行数，默认值为-1</returns>
        int AddExample(Example example);

        ///<summary>
        /// 更新Example表,Update成功返回已经更新的数据条数,失败返回-1
        ///</summary>
        ///<param name="example">Example对象</param>
        ///<returns>Update成功返回已经更新的数据条数,失败返回-1</returns>
        int UpdateExample(Example example);

        ///<summary>
        /// 删除Example表中ID等于exampleID的行,返回已删除行数
        ///</summary>
        ///<param name="exampleID">Example对象的ID值</param>
        ///<returns>返回删除行数</returns>
        int DeleteExample(int exampleID);

        ///<summary>
        /// 获取Example表的所有行
        ///</summary>
        ///<returns>返回Example表中的所有Example对象</returns>
        IList<Example> GetList();

        ///<summary>
        ///  根据ID获取对应Example对象
        ///</summary>
        ///<param name="id"></param>
        ///<returns></returns>
        Example GetExampleByID(int id);
    }
}

namespace Project.DAL
{
    public class ExampleDAL:IExampleDAL
    {
        public int AddExample(Example example)
        {
             //实现AddExample方法
        }
    }
}
```


