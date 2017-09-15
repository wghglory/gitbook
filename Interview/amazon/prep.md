Interviewer 1: Coding & Algorithms & Data Structures
Interviewer 2: Coding & Problem Solving
Interviewer 3: Problem Solving & Design (logical & maintainable/software)
Interviewer 4: Architecture & System Design – This interview will test your understanding of distributed systems, concurrency/multi-threading, etc. Asking clarifying questions and gathering requirements is KEY for this interview. Please use this link to prepare
<https://www.hackerrank.com/domains/distributed-systems/client-server/page:1>

```csharp
namespace TcpEchoServer
{
    public class TcpEchoServer
    {
        public static void Main()
        {
            Console.WriteLine("Starting echo server...");

            int port = 1234;
            TcpListener listener = new TcpListener(IPAddress.Loopback, port);
            listener.Start();

            TcpClient client = listener.AcceptTcpClient();
            NetworkStream stream = client.GetStream();
            StreamWriter writer = new StreamWriter(stream, Encoding.ASCII) { AutoFlush = true };
            StreamReader reader = new StreamReader(stream, Encoding.ASCII);

            while (true)
            {
                string inputLine = "";
                while (inputLine != null)
                {
                    inputLine = reader.ReadLine();
                    writer.WriteLine("Echoing string: " + inputLine);
                    Console.WriteLine("Echoing string: " + inputLine);
                }
                Console.WriteLine("Server saw disconnect from client.");
            }
        }
    }
}

namespace TcpEchoClient
{
    class TcpEchoClient
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Starting echo client...");

            int port = 1234;

            TcpClient client = new TcpClient("localhost", port);
            NetworkStream stream = client.GetStream();
            StreamReader reader = new StreamReader(stream);
            StreamWriter writer = new StreamWriter(stream) { AutoFlush = true };

            while (true)
            {
                Console.Write("Enter text to send: ");
                string lineToSend = Console.ReadLine();
                Console.WriteLine("Sending to server: " + lineToSend);
                writer.WriteLine(lineToSend);
                string lineReceived = reader.ReadLine();
                Console.WriteLine("Received from server: " + lineReceived);
            }
        }

    }
}
```

* [x] [Google Amazon parking lot example design](https://github.com/wghglory/system-design-demo)
* [x] https://www.careercup.com/page?pid=trees-and-graphs-interview-questions
* Google “solve boggle board algorithm”
* [x] Understand the difference between breadth and depth, when to use each one etc.
* [x] http://codercareer.blogspot.com/p/binary-tree-interview-questions.html
* [x] Google “binary search questions”
* ~~https://www.hackerrank.com/challenges/tree-height-of-a-binary-tree~~
* ~~https://www.hackerrank.com/challenges/tree-level-order-traversal~~
* ~~https://www.hackerrank.com/challenges/balanced-brackets~~
* ~~https://www.hackerrank.com/challenges/contacts~~
* ~~https://www.hackerrank.com/challenges/find-the-running-median~~
* ~~https://www.hackerrank.com/challenges/swap-nodes-algo~~

Please also review:
<https://www.hiredintech.com/classrooms/system-design/lesson/52>

Leadership Principles – The principles are an important aspect who we are at Amazon and the culture we maintain. As you review the 14 principles be prepared to answer a question about your work delivering on a project, challenges you might have faced, problems you had to work through, meeting a deadline, etc. You will be expected to walk us through various example in your life in which you exhibited the leadership principles. You can use this link in preparing for the questions to expect. https://careerservices.wayne.edu/behavioralinterviewinfo.pdf

Design Pattern
SOA
Distributed system: https://www.hackerrank.com/domains/distributed-systems/client-server/page:1
microService
sharding
large scale

map-reduce, SOA, loading balance

DNS lookups, TCP/IP

一道是anagrams, 另一道是group anagram的变形, 最后问了一下 hashmap 出现 collision 会发生什么。leetcode 49和242原题. hashmap 的题目说出来 hashCode, bucket, linkedList, key-value pair基本就可以了.

关注一亩三分地微博：
Warald
 Onsite面经:
第一轮: First Common Ancestor of two nodes in a graph.
第二轮: Given two strings and a dictionary, only one character can be changed at a time, the changed string must also be found in the dictionary. Write a function to decide if it is possible that the 1st string can be changed to the 2nd string.

```csharp
using ctci.Contracts;
using System;

namespace Chapter01
{
    public class Q1_05_One_Away_A : IQuestion
    {
        public static bool OneEditReplace(String s1, String s2)
        {
            bool foundDifference = false;
            for (int i = 0; i < s1.Length; i++)
            {
                if (s1[i] != s2[i])
                {
                    if (foundDifference)
                    {
                        return false;
                    }

                    foundDifference = true;
                }
            }
            return true;
        }

        /* Check if you can insert a character into s1 to make s2. */

        public static bool OneEditInsert(String s1, String s2)
        {
            int index1 = 0;
            int index2 = 0;
            while (index2 < s2.Length && index1 < s1.Length)
            {
                if (s1[index1] != s2[index2])
                {
                    if (index1 != index2)
                    {
                        return false;
                    }
                    index2++;
                }
                else {
                    index1++;
                    index2++;
                }
            }
            return true;
        }

        public static bool OneEditAway(String first, String second)
        {
            if (first.Length == second.Length)
            {
                return OneEditReplace(first, second);
            }
            else if (first.Length + 1 == second.Length)
            {
                return OneEditInsert(first, second);
            }
            else if (first.Length - 1 == second.Length)
            {
                return OneEditInsert(second, first);
            }
            return false;
        }

        public static bool OneEditAway2(String first, String second)
        {
            /* Length checks. */
            if (Math.Abs(first.Length - second.Length) > 1)
            {
                return false;
            }

            /* Get shorter and longer string.*/
            String s1 = first.Length < second.Length ? first : second;
            String s2 = first.Length < second.Length ? second : first;

            int index1 = 0;
            int index2 = 0;
            bool foundDifference = false;
            while (index2 < s2.Length && index1 < s1.Length)
            {
                if (s1[index1] != s2[index2])
                {
                    /* Ensure that this is the first difference found.*/
                    if (foundDifference) return false;
                    foundDifference = true;
                    if (s1.Length == s2.Length)
                    { // On replace, move shorter pointer
                        index1++;
                    }
                }
                else {
                    index1++; // If matching, move shorter pointer
                }
                index2++; // Always move pointer for longer string
            }
            return true;
        }

        public void Run()
        {
            String a = "pse";
            String b = "pale";
            bool isOneEdit = OneEditAway(a, b);
            Console.WriteLine("{0}, {1}: {2}", a, b, isOneEdit);

            bool isOneEdit2 = OneEditAway2(a, b);
            Console.WriteLine("{0}, {1}: {2}", a, b, isOneEdit2);
        }
    }
}
```

第三轮: Two sum, multiple pairs.
第四轮: System design. 跪的妥妥的. 10000 cameras, 100 hours of video each. 30 fps. Police need to input a plate number and find the path of a suspicious vehicle. (Estimate the size of the video, e.g., blueray disc is 2 hours and 20 GB. No need to scan all of the videos. Estimate the time that a vehicle can be seen between 2 traffic cameras, e.g., 0.3 miles and 30 miles per hour, then select 1 out of 100). Web client, load balancer, servers, db.
第五轮: 纯粹Behavior questions,要结合工作中实际的例子说明.