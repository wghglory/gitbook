# Self Introduction

1.  I have involved in system development life cycle for 7 years, especially web development. I'm working as CTO in a startup company. Before I was a technical lead in UnionBank, US.

1.  _College_: I'm interested in designing web application for a long time, but I don't choose computer science as my major because I don't want exams, classes ruin my interest, and I learnt computer science class by myself in Dalian University of Technology. I did part-time job to learn and strengthen my programming skills during college life.

1.  _Post College & Onwards_: After college, I worked in several companies in US. Most of my work is about how to build web application. my skill sets include frontend(html,css,js and latest frameworks and libraries like angular, React + redux, jquery), backend(.net latest MVC core, WebForm, MVC, nodejs), database(mongodb, MSSQL).

1.  _Current Role [Details]_: Now I'm leading both frontend and backend teams. I designed system architecture, do some coding, code review and some managements. I give free time every to team so everybody can share and learn what they want if they finish tasks very efficiently.

1.  Everyday I go over some blogs and technical websites to learn new techniques, and understand what is popular, what will be popular in future. And I also like to learn these new stuff from video tutorials(youtube, codeSchool) and buy books online. Anyway, I'm self-motivated, and I love what I'm doing. I used to stand on the top in college life, now I want to an excellent leader. I'm making a progress everyday to make it happen!

我有 7 年软件开发经验，包括 windows application 和 web application。我更倾向于 web 开发。

我很早就对网站开发产生兴趣，但是我在大学时代并没选择相关专业，因为我不想找考试、强制性的课程毁掉我的兴趣。我在大连理工通过自学和兼职工作去提高自己的编程水平。

在迈阿密大学结束后我在美国 3 家公司工作过，大部分工作内容都是网站开发，包括前端、后端和数据库开发。前端方面主要是 html css js 和一些框架 angular jquery，后端.net mvc, nodejs，数据库主要 MSSQL 和 mongodb。

现在在一家中小型公司做技术经理，主要负责前端，搭建框架（yeoman）、封装公共组件、最近开始负责重量级模块--图形化创建。对 react 比较熟悉。曾经用过 angularjs, angular2，最近学习了 vue。我对前沿技术很感兴趣，如 web components, custom elements, shadow dom, css variables 等。我是中途接手一个项目，发现了很多问题，我负责帮助团队不断改进推动项目。还有重新设计系统架构、code review、还有管理方面的工作。每周我都会给团队一些自由时间，大家可以互相分享和学习他们想学的内容。

每天我会查看浏览一些技术博客、网站去了解最新技术以及未来发展趋势。我也通过一些视频教程 youtube, pluralsight 和看书去提高自己的水平。总之，我是个主动性很强、对这个行业充满热情的人。我期望以后能够带领团队创造出优秀的产品，为此我每天都在努力，去实现自己的价值！若干年后问心无愧

<!--5. Outside of Work: Outside of work, I've been participating in some hackathons - mostly doing iOS development there as a way to learn it more deeply. I'm also active as a moderator on online forums around Android development.

6. Wrap Up: I'm looking now for something new, and your company caught my eye. I've always loved the connection with the user, and I really want to get back to a smaller environment too.-->

### my projects

对公司现有的系统的优化和重构:

- react 状态管理混乱，早起项目只用 react State，大家觉得一层一层传递 state 麻烦。我接手后发现 redux 和 react state 混用导致不清晰，帮助大家从 react state 过度到 redux，完成路由模块、首页等公共模块 80%
- react 不可变性理解不到位，有些人在 setState 里面修改了状态。还有得 deepClone 后赋值。我推荐 immutability-helper
- 提取相似组件，封装成公共组件，提高复用性
- 改进 Modal, Select 等组件
- 图形化创建的撘建，老师学生端。canvas，fabrics，svg 制作的网页版 sketch、ps。介绍下功能
- 加入测试、mock-server、持续集成
- 项目没有 lint 工具导致大家代码不统一，使用 ESLint and editorConfig。
- 每个 component 都是用 class 的方式去定义。我推荐了 functional/stateless component。

改进：

- css 模块化
- webpack tree-shaking 和 bundle splitting。
- Modal、select 组件库的优化和扩展
- HighChart 配置统一、可拖拽配置。
- Stylus 缩进不方便。

难点：

- 需要增加图形化创建，数据保存，团队多人协作。
- redux 源码 applyMiddleware 等觉得难。

| common questions           | Ub tahoe, MPower                                                                   | SNH Avendas                           | UPMC panelAccess        |
| -------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------- | ----------------------- |
| challenges                 | Optimization: SPA, unitOfWork, Cache, Thread; Unity: T4; MPower: log4net+redis     | real-time chat                        | mapQuest, chart.js, pdf |
| Mistake                    | A link click error after SPA                                                       | NA                                    | NA                      |
| Leadership                 | ESLint, naming convention, coding style                                            |                                       |                         |
| Conflicts                  | not mine: Raya asks too much; opinion conflicts: Jay ui-controller/func-controller | scrum master real-time chat task slow |                         |
| What do you do differently | high-level architecture refactor, cacheHelper(memcache,regular)                    | real-time chat                        | mapQuest, chart.js, pdf |

#### What was the toughest challenge you’ve ever faced?

挑战每隔一段时间就出现，但当前觉得困难的挑战，现在回头看可能好多也不困难了，毕竟经验有增长。

上海踏瑞、创狐：简创和 PGC 项目 -- graphics editor, a very important module in project. It includes Tools, Canvas and Properties Area. You can think it as a online Photoshop. Syncing between areas, Grouping, Data Saving format, 创建复合组件。老师分配群组，组长演示的时候其他组员能实时看到组长的操作。多人协同。

SNH: To design a basic chat application like skype/qq. That was the first time that I made a real-time application. First, I did a research about what techniques should be used and SignalR is the one I want. Second, how to design the one to one, one to many chat mode? I researched and used group, room these concepts to implement both client and server side code. Third, what if one is online and the other one is offline. And online person sends a message to offline person. Then when offline person gets online, how can he receive the message? Fourth, how can I retrieve chat histories? Fifth, if one deletes history from his side, the other person should still be able to have the history, how to manage the history? This is more complicated for one to many. I put all possible situations into consideration and design the database. It's a tough task, when I finish this, all colleagues and manager spoke highly of me!

#### Describe a specific problem you solved for your employer or professor. How did you approach the problem? What role did others play? What was the outcome? (decision making)

`UnionBank MPower project log4net + redis`

Initially, tahoe project uses ExceptionFilter to write errors/exceptions into database. When there is an error in test, developers have to look up the error in test db, but some developers don't have access to test db. And it's not convenient to find errors, because you have to open sql client, find that table, and query errors.

So I suggest, why not record errors in txt file? Another developer implemented this feature. One day, I wanted to check the error log, but when I see that log file, it's about 100 megabyte, I don't dare to open it...

I immediately talked with team and pointed out that we cannot record all errors in only one file. We need to control the biggest size of one file, maybe 10mb. My manager decided to let me do it. Then I used Log4net the solve the problem since it can log errors in several files in a reasonable size.

One day, I was pretty sure that an exception was not recorded in our log file. I found the reason is when errors happen in different threads, there will be a problem for multiple threads to access one file. So I added "lock" to solve this issue. Then I tested my code by generating multiple errors in multiple threads. The bad thing happens, when a thread writes error to file, the other threads have to wait, the performance is so bad. Then I used put all errors into queue, and start a new thread, which is responsible to get errors and write them into file. Finally, I used redis instead of traditional queue, so errors are push into redis queues.

多线程操作同一个文件时会出现并发问题。解决的一个办法就是给文件加锁(lock)，但是这样的话，一个线程操作文件时，其它的都得等待，这样的话性能非常差。另外一个解决方案，就是先将数据放在队列中，然后开启一个线程，负责从队列中取出数据，再写到文件中。

#### UnionBank challenges 1: Performance, UnitOfWork, CacheHelper with memcache

As the application get larger and we have more and more data, the system response time increased.

My goal/challenge is to find the bottleneck and speed up the whole system.

You know, there're too many things that need to be considered when we talk about performance (frontend, application, and database). For frontend part, we already used CDN, and js minification/compress, and some other techniques before. But to improve user experience, instead of redirecting from one page to another, I discussed with my manager and suggested to make our application a SPA.

I found backend c# code makes system run slow, especially when there are multiple transactions.

1.  One reason is that the system doesn't use UnitOfWork, so this means when we are operating multiple tables, we may created dbContext many times, connect to db many times and generate multiple sql queries. So I added UnitOfWork to application and one big advantage is that the CRUD logic can be executed in the business logic layer rather than database layer. Business layer has more control about the data flow.
1.  Second, I wrote a CacheHelper and use it whenever it is possible. The CacheHelper can uses both traditional Cache and Memcache (amazon: dynamo).
1.  There're some time-costly functions. I created a new thread for them, and made them work asynchronously.

As a result, the response is faster.

#### 新奇点，迁移能力 Ub challenge 2: Unity mappings, xml --> programmatically --> T4 xml

We used Unity to decouple layers. Our team had a hard time about the unity object mappings. Initially we used xml files to store the mappings. But there is not any intelligence and developers can spell wrong. They cannot see it wrong until running the solution. So I suggest, why don't we give up the xml and create mappings programmatically? We are quite happy at first. But as we have more controllers, we get tired of creating mappings because every time when you creates a new controller, you have to create a mapping between this controller and the service. And sometimes developers forget to add this mapping, resulting in more debugging time.

So instead of creating mapping programmatically, I wrote a T4 code template. It can generate a xml file based on the database, new controller file, and its dependent services. Thus, when developers create a new controller, they don't need to take care of the mappings, when they build the solution, the generator will refresh the mappings.

#### Ub mistake

I redesigned the layout page and make it as a SPA. I thought I checked everywhere, but there is a link in a very latent place. The link clicking will raise an error. It's dangerous because it's really bad if users see this error. The bad thing is that the production day was tomorrow. I immediately talked with my manager about this and told him this change can be done within 5 minutes. But We don't have enough time to push this fix to test or production. So we delayed our deployment. Thanks god, it doesn't have a serious affect since it is an early release. I took the responsibility and said sorry to my manger. He said it's no a big issue since I found it before deployment and he likes my attitude. Indeed, that link is too easy to be ignored.

#### Ub conflicts

I seldom have behavior conflicts with others since I'm always nice to others. But I have some opinion conflicts. These conflicts I feel, most of time they are good because by pointing out different opinions, we can come up with better solutions, and it can improve our creativity.

One conflict with my manager is that he wants to separate controllers by ui and functions while I feel controllers should be separated by modules. His thought is, any controller related to UI, which render a view should be placed into UI-controller folder, and any controller which involves many logic and data retrieving functions should be under func folder. I wrote an email and explained my ideas.

First, some controllers have both UI an logic functions, so they are not clear where to be placed. Second, these changes will have to change RoutingConfig, and many ajax calls will be affected since the url changed. Third, I estimated the time how long it will take if we really want to do this. And how many files need to be changed. At last, I said something like, if you still want to implement this way, I will definitely do it within the estimated time. Please let me know.

So in this conflict, I pointed out the disadvantages that it will generate. If we really do this, how things will go, what to be predicted. These results made my manager clear at this issue. He agreed on me and he was very glad that I could point it out before making that decision.
