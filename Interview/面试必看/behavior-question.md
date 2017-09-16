#### What was the toughest challenge you’ve ever faced?

graphics editor, a very important module in project. It includes Tools, Canvas and Properties Area. You can think it as a online Photoshop. Syncing between areas, Grouping, Saving.

To design a basic chat application like skype/qq. That was the first time that I made a real-time application. First, I did a research about what techniques should be used and SignalR is the one I want. Second, how to design the one to one, one to many chat mode? I researched and used group, room these concepts to implement both client and server side code. Third, what if one is online and the other one is offline. And online person sends a message to offline person. Then when offline person gets online, how can he receive the message? Fourth, how can I retrieve chat histories? Fifth, if one deletes history from his side, the other person should still be able to have the history, how to manage the history? This is more complicated for one to many. I put all possible situations into consideration and design the database. It's a tough task, when I finish this, all colleagues and manager spoke highly of me!

#### What two or three things are most important to you in your job?

I want to be happy. I want to work in a job that I am passionate about, and for a company that respects and rewards my contributions. I want to have co-workers whom I like and respect. I think these things all work together for a positive work environment — which increases productivity — resulting in happy employees and a happy employer.

I also seek fulfillment. I don’t want to work in a job that I feel is below what I am capable of doing. I seek a job that will challenge me to perform at the highest levels and seek ongoing professional development so that I can be even better at my job, making an even stronger contribution to my employer. From everything I’ve researched and seen, this job that I’m interviewing for meets all my criteria.

1. Opportunities, show my value, make me grow。个人发展空间
1. Respect from colleague, friendly, corporation
1. salary, salary is flexible. Sometimes you cannot get the high expected one, it won't let you miss some good opportunities, but I have a bottom line, and i feel a great company like to find a very great employee and pay more salary to him, rather than find a normal person with low salary. Salary is a way to show your value

#### Give me a specific Negative experience example of a time when a co-worker criticized your work in front of others. How did you respond? How has that event shaped the way you communicate with others? (SNH)

I seldom get criticized since I'm usually productive and deliver satisfying solutions, but this happened once when I worked on the real-time chat functionality in SNH. One today, my scrum master, my director and I sat together, and scrum master asked why the task has not been finished.

Scrum master is not good at techniques. So I have to say something that all of us can understand easily.

I say, First, No one has real-time chat development experience, since I love to try some new things I pick up this difficult task by myself. I want to be responsible for company, and deliver great products. I try to think if I were the customer, what do I really want to see in the product? If I just want to stay at comfortable zone, I don't pick this task and maybe we never have this meeting.

Second, It took me 3 days to filly understand the requirement since the requirement is not clear at beginning.

Third, I did research and found SignalR is the best solution in .net Platform. It needs both client side and server side work. To achieve point to point chat is not hard, but it's a little difficult to achieve one to group and group to one.

Fourth, the most difficult part is about database design. We want to keep chat history. If one deletes history from his side, the other one should still be able to view history. In addition, how does a online person send a message to offline person? And when that offline person gets online, he can receive the message immediately?

Then I showed them the paper that lists my thoughts, drafts about database design, system design, and pseudo code etc.

Finally they understand how hard it is and after I presented all these functionalities, all in the team are quite satisfied with it!

So after this event, my scrum master attitude became warmer, he would talk with me to understand everything before any judgement. He think I'm responsible and capable. We respect each other.

##### Don't you talk with other developers or scrum master everyday?

We have standing up meetings every day, but probably because I talked about the same thing for several days, he thought I didn't make progress for days.

#### Tell me about a time where you sought out perspectives other than your own to make a product/service/project better? (use other peoples' thought)

==ActionMenu json or web.config==

Ub tahoe project there is a actionMenu dropdown list, it has icons and anchors. Based on systemId (bankerConsole, teller), the list is different.

1. The data is dynamic so we cannot just write plain html because it's not extendable if we add a new system.
1. So for some reasons, my manager doesn't want to load that dropdown from database. (maybe creating a table just for a dropdownList is too much)

My solution is to create a json file, "systemId":1,"url":"a-dev.com". So I load the json and bind data to dropdownList. Whenever there is any change, I can directly work on json file. It's a good solution for many cases, but in our case, the dropdown anchor url varies like "a-dev", "a-test" based on the environment.

My manager suggests we use web.config and transform the url based on environment. I feel this solution works better in this case.

later instead of web.config, it's actionMenu.config and third-party lib to do transform

#### Tell me about a time when you had to analyze facts quickly, define key issues, and respond immediately to a situation. What was the outcome?

UnitOfWork, when transactions are more, slow

#### Give me an example of a time you used customer feedback to drive improvement or innovation. What was the situation and what action did you take?

UPMC mapQuest: map shows different offices, under the map there are names of offices. mouse hover on the office icon in map, name will pop up.

The customer feedback is is there anyway that we know the all offices' names without hovering mouse to each, or if we want to find a office named "A", where is it in map without trying to hover every icon?

since some offices name are long, i cannot display names along with the icon in map. What I did was to set identity number 1 2 3 4 for each of office under map, and on the map, the icon has corresponding number. Customer is very glad to have this solution.

#### Tell me about a goal that you set that took a long time to achieve or that you are still working towards. How do you keep focused on the goal given the other priorities you have?

a long-term goal: be a technical leader in 5 years.

I seldom set big goal without smaller short-term goals because it may take too long to get there, and there're some uncertain things before going that far. If I don't get there I may lose confidence. I tend to set small goals and once I finish one, I encourage myself and am excited to set next one. But to be a leader is a target I'm pretty sure I will be there. To achieve that, I dig into techniques everyday, review technical news, blogs, books, videos, etc. Also I learn from my manager and teammates. Talk with friends, mentor. Learn from books.

The tasks my leader assigned have first priorities, I like to finish these tasks efficiently with hight quality. And then I use some spare time to work on my goals.

I'm curious. When I see an app working in a different way, I will think how it is working like this under the hood (frontend animation i.e.). When I wait bus in station, I will check how the advertise designed. What if I design it?

#### Tell me about a time when you linked two or more problems together and identified an underlying issue? Were you able to find a solution?

mPower: worked on error log using log4net. But when multiple threads throw error together, lock will decrease performance because other threads have to wait. I thought that I worked on message queue before, so I use both log4net and queue to improve the performance. And finally use redis.

#### What three things you are you working on to improve your overall effectiveness?

1. newest techniques, recently ES2015. Read blogs, news, videos, etc. Talk with mentors
1. create helper functions, like AjaxHelper, CacheHelper, build my code library (frontend plugins), write notes, blogs to share to deepen my skills
1. read books to build emotional intelligence
1. learn from mistake
1. treat people right

#### Give me an example of when you took an unpopular stance in a meeting with peers and your leader and you were the outlier. What was it, why did you feel strongly about it, and what did you do?

This only happened to me in the first few weeks when I joined a new company. I'm new, I'm not familiar with everything. I feel it's quite normal. What I did is listen to what they say carefully and try my best to understand how things are going, how I can get used to this new environment quickly? And after meeting I also ask my manager and peers for help. But after 2 or 3 month, I usually take a popular stance.

#### Tell me about a time you wouldn’t compromise on achieving a great outcome when others felt something was good enough. What was the situation?

log4net + queue, can use log4net + redis

#### Tell me about a time you made a hard decision to sacrifice short term gain for a longer term goal.

Before working with UnionBank, I received another offer from a small company, they give more salary, more vacations. But I feel my capability is beyond their need. I stay at my comfort zone and won't make big progress. My long-term goal is to be a technical lead, working in this company, I will get more salary, but it makes me hard to become an excellent leader. I give up that offer and go with UnionBank.

#### How do you drive adoption for your vision/ideas? How do you know how well your idea or vision has been adopted by other teams or partners? Give a specific example highlighting one of your ideas.

ES2015, coding style, name convention. Everyone started to follow rules.

#### Tell me about a time when you realized you needed to have a deeper level of subject matter expertise to do your job well?

When I started to work on Avendas in SNH, I just knew basics of angular. Although I mainly worked on backend, knowing how angular send ajax call to server is better for me to understand how frontend and backend work together. I felt I need to learn more about angular. Now I'm at middle level of angular 1, and I haven't studied angular 2. I know I need to work on angular 2 or 4 so if next project uses them, I will be more confident.

#### Leadership skills?

* give others opportunities to shine
* think big
* assign tasks accordingly
* motivate team
* listen from different opinions and make best decision considering long-term goal
* understand what is most important

I am a leader who likes to give the people I am leading the ability to shine. I think it is important to take everyone’s opinion into consideration and be willing to listen to what they have to say. I think my job as a leader is to organize things and keep them in order. Being the leader does not mean I know everything there is to know because I cannot possibly know more than everyone else about every topic. It is just not plausible.

#### creativity or efficiency, Which is more important?

I think that the key is a balance between the two, with efficiency being the most important. You could have an extremely creative piece, but if the message of the piece is not clear then it is not efficient and a waste of resources.

#### How has college changed you as a person?

I have grown up during my college years. I am able to communicate better, think strategically, and multitask more than ever before. I can handle an appropriate level of stress and still get things done.

#### Some people work best as part of a group — others prefer the role of individual contributor. How would you describe yourself?

I like a mix of both. I like to work in a group and get group input. I think a lot of good ideas come from talking things out with other people. I also like to work by myself on some projects because I think there are some projects that are just done better if one person is working on them.

#### When given an important assignment, how do you approach it?

I like to make a todo list, a timeline of how and by when things need to be done. I really like to get started on the assignment immediately because I’ve found that once I get started on a project I tend to get gradually more excited about it and involved in it, and I want to expand the project more and more as I go on. By getting started earlier, I can get the most out of the project and maximize it as much as possible while providing time to give it that extra review.

#### a shortcoming/weakness

As a engineer, I'm not strong at history, politics, art, music, etc. Sometimes when I talk with friends, they know a lot of stuff which doesn't relate to work. I feel kind of guilty. They can use very proper words, poetry to express things, but my words are just plain words. I think I might focus more on work sometimes, and forget how to balance work and life. I realized this, and I'm working on it. A excellent person should not just do well in work, but should have a broad knowledge, work for a happy life rather than just for work itself. And from a long run, it's also good for the company.

#### 团队合作意见分歧：

处理很多问题的方式很大程度上取决于你的职位、环境等因素。如果我是管理者，每个人在团队中都应该可以自由坦诚地发表意见，我会非常认真的聆听，分析；但对于自己的意见我不会没有原则的轻易放弃。民主过后还需要集中。我的理念是：Meeting 不等于Voting，完全不需要少数服从多数；我是负责人，我相信自己有能力采取最佳方案；假如失败了，我也会承担主要责任。而如果我是团队的普通一员，我会保留自己的意见，但还是认真执行管理者已经做出的决策。只要遵循“对事不对人”的原则，目的是合理高效解决问题。反问面试官你是如何处理意见分歧的呢？

#### 在人际沟通上是否曾经有过不和谐？

有，生活中遇到过，工作暂时没遇到。其实我这个人很容易和别人相处，因为我会换位思考，以此来理解他人。但是！如果遇到价值观和我有抵触的人，我会无法容忍，可能会不能进行有效沟通。有几类人不太欣赏：说话言而无信；做事虎头蛇尾；妄想不劳而获。这种人已经触犯到我的原则底线。当然，我不会拂袖而去，但实在不愿敷衍。也许这就是还不够世故圆滑吧。我很矛盾，不知道该做怎样的拿捏与平衡。

#### 为什么回国发展？

情。人在一些快乐的时候很容易迷失自己，忘记自己曾经最真实的、发自内心的想法。我会这样问自己，当所有的职业工资水平一样多，职位不分高低，我会选择什么职业？

#### Give me a specific example of a time when you sold your supervisor or professor on an idea or concept. How did you proceed? What was the result? (assertiveness)

When I worked in UnionBank tahoe project, I saw many javascript files include global variable. Naming convention, coding style varies.

So I talked with my manager about it.

1. Global variable may raise conflicts and give an example
1. it will increase the development efficiency and easier to maintain if we have a unique naming convention and coding style
1. To make this happen, I gave several solutions, like modularization, self-closure, ESLint, ES2015. And then I told the benefits for each of these techniques.

My manger loves my thoughts, and in a meeting I introduced how to make code better.

#### Describe the system you use for keeping track of multiple projects. How do you track your progress so that you can meet deadlines? How do you stay focused? (commitment to task)

I used TFS. TFS has my work, workItems. So in workItems, I can see how many tasks are pending. Each task has start day and release day, task description, etc. So by using TFS, I can keep track of my tasks.

In addition, to finish a task, I probably needs to do it step by step, so I will write a todo list in my editor Atom, sublime. It includes the start day, end day, priority. I will mark it solved foreach small task.

#### Tell me about a time when you came up with an innovative solution to a challenge your company or class was facing. What was the challenge? What role did others play? (creativity and imagination)

UnionBank Unity T4

#### Describe a specific problem you solved for your employer or professor. How did you approach the problem? What role did others play? What was the outcome? (decision making)

`UnionBank MPower project log4net + redis`

Initially, tahoe project uses ExceptionFilter to write errors/exceptions into database. When there is an error in test, developers have to look up the error in test db, but some developers don't have access to test db. And it's not convenient to find errors, because you have to open sql client, find that table, and query errors.

So I suggest, why not record errors in txt file? Another developer implemented this feature. One day, I wanted to check the error log, but when I see that log file, it's about 100 megabyte, I don't dare to open it...

I immediately talked with team and pointed out that we cannot record all errors in only one file. We need to control the biggest size of one file, maybe 10mb. My manager decided to let me do it. Then I used Log4net the solve the problem since it can log errors in several files in a reasonable size.

One day, I was pretty sure that an exception was not recorded in our log file. I found the reason is when errors happen in different threads, there will be a problem for multiple threads to access one file. So I added "lock" to solve this issue. Then I tested my code by generating multiple errors in multiple threads. The bad thing happens, when a thread writes error to file, the other threads have to wait, the performance is so bad. Then I used put all errors into queue, and start a new thread, which is responsible to get errors and write them into file. Finally, I used redis instead of traditional queue, so errors are push into distributed queues.

多线程操作同一个文件时会出现并发问题。解决的一个办法就是给文件加锁(lock)，但是这样的话，一个线程操作文件时，其它的都得等待，这样的话性能非常差。另外一个解决方案，就是先将数据放在队列中，然后开启一个线程，负责从队列中取出数据，再写到文件中。

#### Describe a time when you got co-workers or classmates who dislike each other to work together. How did you accomplish this? What was the outcome? (teamwork)

Raya kept asking Sathish questions every day. Rajini complaint this to me because their discussion always interrupts her thoughts. One friday I invites them to have lunch together. One of my friend in another company had the same problem before the lunch. we talked about many interesting things at first, at last I said, my friend in another company feels their development is not efficient because they sometimes talk a lot of funny things during work. The environment is comfortable but sometimes they didn't finish tasks within deadline. What do you think to solve this kind of issue? Rajini said maybe they can work hard in the morning, and talk something funny during lunch or a small break. Maybe we can do the same, during standup meetings in the morning, we told any block we had. Then we work relatively independently unless there is a big issue one doesn't have any idea. If there are some small issues, we can talk between 2-3 pm everyday. So every one in the team thinks how to solve their tasks and did some research online before asking questions. There is less interruption and everyone tries their best to solve before asking for help.

#### Tell me about a time when you failed to meet a deadline. What things did you fail to do? What were the repercussions? What did you learn? (time management)

union bank layout SPA change.

#### Describe a time when you put your needs aside to help a co-worker or classmate understand a task. How did you assist them? What was the result? (flexibility)

Sathish, css layout, arrow navigation bar, div:after/before. My task is not urgent, offer help actively

#### Describe two specific goals you set for yourself and how successful you were in meeting them. What factors led to your success in meeting your goals? (goal setting)

one goal was I should at least be middle level of angular 1 in June 2016. I set this goal in December 2015. I tend to make smaller goals which can be easily achieved. I feel very glad to finish one and it makes me very excited to set another goal. I'd say I did finish this goal at that time. To get there, I tried to solve every task every efficiently. Once there is a new task, I immediately understand the requirement and start to work on it. I don't like to work close to the deadline. Once I finishes the task earlier, I use this spare time to learn new techniques. I love to learn new things.

Another goal is too finishing a chinese history book. I want to be a leader in future, and I feel an excellent leader should not just focus on the techniques. I prefer one should have a very strong knowledge in one and a few fields, but one should also have a broad view, have interest in many different things. So when a new issue comes up, you can have many different ways to solve it. History may not directly help me about coding, but it indirectly gives me an idea that if there is any other way I can communicate with others. How to make the team work more efficiently, etc.

factors: passion, motivation, aspiration, I want to be successful. I want to have a wonderful life. I want to share my knowledge and contribute.

#### How do you ensure that someone understands what you are saying?

meeting, ES2015, naming convention, code style, ppt lists demo with picture. Code review and double check. From listener eye, expression

#### Tell me about a time when you had to present complex information.

Real-time chat history

#### Tell me about a time in which you had to use your written communication skills in order to get across an important point.

Jay ui-controller and func-controller

#### Give me an example of a time you had to make a difficult decision.

Smaller company with high salary, before UnionBank, because of long-term goal--technical leader

#### Give me an example of when taking your time to make a decision paid off.

Unity xml, Unity pragmatically, Unity xml with T4

#### Give me an example of a situation that could not have happened successfully without you being there.

Unity xml with T4, Log4net queue

#### How do you determine priorities in scheduling your time? Give me an example.

I have a sense. And ask manager what is important. List all steps to finish that task and find which is most important and what may block me.

#### Tell me about a time when you influenced the outcome of a project by taking a leadership role.

ES2015, naming convention, code style; Log4net queue