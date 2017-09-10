# Self Introduction

1. I have involved in system development life cycle for 7 years, especially web development. I'm working as CTO in a startup company. Before I was a technical lead in unionbank, US. 

1. *College*: I'm interested in designing web application for a long time, but I don't choose computer science as my major because I don't want exams, classes ruin my interest, and I learnt computer science class by myself in Dalian University of Technology. I did part-time job to learn and strengthen my programming skills during college life.

1. *Post College & Onwards*: After college, I worked in several companies in US. Most of my work is about how to build web application. my skillsets include frontend(html,css,js and latest frameworks and libraries like angular, React + redux, jquery), backend(.net latest MVC core, Webform, MVC, nodejs), database(mongodb, MSSQL).

1. *Current Role [Details]*: Now I'm leading both frontend and backend teams. I designed system architecture, do some coding, code review and some managements. I give free time every to team so everybody can share and learn what they want if they finish tasks very efficiently. 

1. Everyday I go over some blogs and technical websites to learn new techniques, and understand what is popular, what will be popular in future. And I also like to learn these new stuff from video tutorials(youtube, codeschool) and buy books online. Anyway, I'm self-motivated, and I love what I'm doing. I used to stand on the top in college life, now I want to an excellent leader. I'm making a progress everyday to make it happen!

我有7年软件开发经验，包括windows application 和 web application。我更倾向于web开发。现任联合银行任技术指导。

我很早就对网站开发产生兴趣，但是我在大学时代并没选择相关专业，因为我不想找考试、强制性的课程毁掉我的兴趣。我在大连理工通过自学和兼职工作去提高自己的编程水平。

在迈阿密大学结束后我在美国3家公司工作过，大部分工作内容都是网站开发，包括前端、后端和数据库开发。前端方面主要是html css js和一些框架angular jquery，后端.net mvc, nodejs，数据库主要MSSQL和mongodb。

半年前由于我的贡献和能力得到认可，升为技术指导，领导前端和后端开发。我主要负责重新设计系统架构、code review、还有管理方面的工作。每周我都会给团队一些自由时间，大家可以互相分享和学习他们想学的内容，前提是高质量高效完成任务。

每天我会查看浏览一些技术博客、网站去了解最新技术以及未来发展趋势。我也通过一些视频教程和看书去提高自己的水平。总之，我是个主动性很强、对这个行业充满热情的人。我期望以后能够带领团队创造出优秀的产品，为此我每天都在努力，去实现自己的价值！若干年后问心无愧

<!--5. Outside of Work: Outside of work, I've been participating in some hackathons - mostly doing iOS development there as a way to learn it more deeply. I'm also active as a moderator on online forums around Android development.

6. Wrap Up: I'm looking now for something new, and your company caught my eye. I've always loved the connection with the user, and I really want to get back to a smaller environment too.-->

### my projects

需要增加图形化创建，数据保存，团队多人协作。react 深层不可变。redux 源码 applymiddleware 等觉得难。

| common questions | Ub tahoe, mpower | SNH avandas | UPMC panelAccess |
| --- | --- | --- | --- |
| challenges | Optimization: SPA, unitofWork, Cache, Thread; Unity: T4; Mpower: log4net+redis | realtime chat | mapQuest, chart.js, pdf |
| Mistake  | A link click error after SPA | NA | NA |
| Leadership | ESlint, naming convention, coding style |  |  |
| Conflicts | not mine: Raya asks too much; opinion conflicts: Jay ui-controller/func-controller | scrum master realtime chat task slow |  |
| What do you do differently | high-level architecture refactor, cacheHelper(memcache,regular) | realtime chat | mapQuest, chart.js, pdf |

#### Unionbank challenges 1: Performance, UnitOfWork, CacheHelper with memcache

As the application get larger and we have more and more data, the system response time increased. 

My goal/challenge is to find the bottleneck and speed up the whole system. 

You know, there're too many things that need to be considered when we talk about performance (frontend, application, and database). For frontend part, we already used CDN, and js minification/compress, and some other techniques before. But to improve user experience, instead of redirecting from one page to another, I discussed with my manager and suggested to make our application a SPA.

I found backend c# code makes system run slow, especially when there are multiple transactions. 

1. One reason is that the system doesn't use UnitOfWork, so this means when we are operating multiple tables, we may created dbContext many times, connect to db many times and generate multiple sql queries. So I added UnitOfWork to application and one big advantage is that the CRUD logic can be executed in the business logic layer rather than database layer. Business layer has more control about the data flow. 
1. Second, I wrote a CacheHelper and use it whenever it is possible. The CacheHelper can uses both traditional Cache and Memcache (amazon: dynamo). 
1. There're some time-costly functions. I created a new thread for them, and made them work asynchronously. 

As a result, the response is faster.

#### Ub challenge 2: Unity mappings, xml --> programmatically --> T4 xml

We used Unity to decouple layers. Our team had a hard time about the unity object mappings. Initially we used xml files to store the mappings. But there is not any intelligence and developers can spell wrong. They cannot see it wrong until running the solution. So I suggest, why don't we give up the xml and create mappings programmatically? We are quite happy at first. But as we have more controllers, we get tired of creating mappings because every time when you creates a new controller, you have to create a mapping between this controller and the service. And sometimes developers forget to add this mapping, resulting in more debugging time.

So instead of creating mapping programmatically, I wrote a T4 code template. It can generate a xml file based on the database, new controller file, and its dependent services. Thus, when developers create a new controller, they don't need to take care of the mappings, when they build the solution, the generator will refresh the mappings.

#### Ub mistake

I redesigned the layout page and make it as a SPA. I thought I checked everywhere, but there is a link in a very latent place. The link click will raise an error. It's dangerous because it's really bad if users see this error. The bad thing is that the production day was tomorrow. I immediately talked with my manager about this and told him this change can be done within 5 minutes. But We don't have enough time to push this fix to test or production. So we delayed our deployment. Thanks god, it doesn't have a serious affect since it is an early release. I took the responsibility and said sorry to my manger. He said it's no a big issue since I found it before deployment and he likes my attitude and indeed, that link is too easy to be ignored. 

#### Ub conflicts

I seldom have behavior conflicts with others since I'm always nice to others. But I have some opinion conflicts. These conflicts I feel, most of time they are good because by pointing out different opinions, we can come up with better solutions, and it can improve our creativity. 

One conflict with my manager is that he wants to separate controllers by ui and functions while I feel controllers should be separated by modules. His thought is, any controller related to UI, which render a view should be placed into UI-controller folder, and any controller which involves many logic and data retrieving functions should be under func folder. I wrote an email and explained my ideas. 

First, some controllers have both UI an logic functions, so they are not clear where to but placed.
Second, these changes will have to change RoutingConfig, and many ajax calls will be affected since the url changed.
Third, I estimated the time how long it will take if we really want to do this. And how many files need to be changed.
At last, I said something like, if you still want to implement this way, I will definitely do it within the estimated time. Please let me know.

So in this conflict, I pointed out the disadvantages that it will generate. If we really do this, how things will go, what to be predicted. These results made my manager clear at this issue. He agreed on me and he was very glad that I could point it out before making that decision.
