# tiny url

how long is the original url length? 30 => 120 bytes => db storage how long is the shortened url length? less than 10 => we can use 2nd method since long id 2132132132123 returns a string "DTiRtHL" with length 7.

One Simple Solution could be Hashing. Use a hash function to convert long string to short string. In hashing, that may be collisions (2 long urls map to same short url) and we need a unique short url for every long url so that we can access long url back.

A Better Solution is to use the integer id stored in database and convert the integer to character string that is at most 6 characters long. This problem can basically seen as a base conversion problem where we have a 10 digit input number and we want to convert it into a 6 character long string.

```csharp
using System;
using System.Text;

public class TinyURL
{
   static string ALPHABET_MAP = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
   static int BASE = ALPHABET_MAP.Length;   //62

   public static string Encode(long index)
   {
      StringBuilder sb = new StringBuilder();

      while (index > 0)
      {
         sb.Append(ALPHABET_MAP[(int)(index % BASE)]);
         index /= BASE;
      }
      char[] arr = sb.ToString().ToCharArray();
      //Array.Reverse(arr);
      return new string(arr);
   }

   public static long Decode(string str)
   {
      long num = 0;

      // if using reverse, use this for loop
      //for (int i = 0, len = str.Length; i < len; i++)
      //{
      //   num = num * BASE + ALPHABET_MAP.IndexOf(str[i]);
      //}

      for (int i = str.Length - 1; i >= 0; i--)
      {
         num = num * BASE + ALPHABET_MAP.IndexOf(str[i]);
      }
      return num;
   }

   public static void Main(string[] args)
   {
      Console.WriteLine($"Encoding for {int.MaxValue} is {Encode(int.MaxValue)}");  //6 digit
      Console.WriteLine($"Decoding for bLMuvc is {Decode("bLMuvc")}");  //6 digit

      Console.WriteLine($"Encoding for 123 is {Encode(123)}");
      Console.WriteLine("Decoding for 9b is " + Decode("9b"));
   }
}
```

* reducing the response time of the server

  * by using a distributed system to share the load based on geography
  * by using a central server but many caching servers at various geographical locations

* reducing the storage space

  * database design

* backup and failover

* security issues

  * prevent people from creating links to

* handling old/obsolete urls

  * while creating the url we can say to the user that it will be deleted if the url is never used for more than say 3 years

* may be allow the user to login and delete unused ones

* user friendly things
  * browser plugins to speed up creating links (youtube sharing has an option to create short urls)
    * giving report to user about the usage statistics
    * mobile app to create urls quickly

### 10000 cameras, 100 hours of video each. 30 fps. Police need to input a plate number and find the path of a suspicious vehicle. (Estimate the size of the video, e.g., blueray disc is 2 hours and 20 GB. No need to scan all of the videos. Estimate the time that a vehicle can be seen between 2 traffic cameras, e.g., 0.3 miles and 30 miles per hour, then select 1 out of 100). Web client, load balancer, servers, db.

Assuming each camera captures 640 x 480 p video & all data stored in a raw format, its easy to do calculation that per camera storage requirement is around 10 GB of data per hour. The given spec matches. So we are good.

30 miles per hour of speed == 0.5 miles per sec. Since cameras are placed at 0.3 mile, a moving vehicle will always be captured every sec by a new camera.

Db Design - Either cameras are doing OCR to figure out numbers at camera level, or the video is being stored on a central server where OCR is being done. For every frame, if a vehicle is identified, the number plate, timestamp & camera id is stored. I will index the DB on number plate. So for a given number, query can be done such that all rows with the number plate can be fetched ordered by timestamp. This way, the path of the number plate can be easily traced.

### Design a kind of kindle fire application where we can subscribe news channel and read the news from all publishers as a digital format

how many articles are created per day => estimate db storage

subject: news, sports, movie channels, observer: vipUser, regularUser message: Article

vipUser can subscribe all channels while regularUser can subscribe most 5.

### Design a kindle app for mobile device and think about the large scale service that would support content distribution for it and how you would design it

features:

1.  read txt, epub formats in device
1.  sync: add these documents to cloud
1.  sign in, read repositories from cloud
1.  categorize books, news, docs for cloud all documents
1.  discover and push books to user based on search result, payment history
1.  search a book and read 1st chapter to trial, buy books
1.  help: ask an issue, feedback
1.  share book to facebook
1.  reading editor: font, theme, process, bookmark, table of content

others:

1.  resolution for different mobiles

### You have a cluster with 100 machines that need time to be synced. The central time server can only handle 10 requests at a time. How will you set this up?

**Way 1:**

divide the cluster into groups of 10 and the central time server syncs with 1st group, then 2nd.

pros:

* easy to maintain grouping
* grouping map can be stored on central time server

cons:

* if central server fails, may need to do resyncing
* if one or more of the servers in a group fail to sync or take too long then the other servers will be kept waiting

**Way 2:**

create 10 groups and assign masters in groups, those masters sync with the central server and they in turn push out to slaves in the group.

**Way 3:**

1.  central server have a list of unsynced, syncing and synced servers.
1.  the central server can start with a random 10 servers and change their state from to be unsynced to syncing and update the lists.
1.  When a server finished syncing, its state is changed to synced and added to the synced list. Next, a new server can be synced if space is available.

pros:

* servers don't constantly wait unnecessarily
* a priority can be assigned to certain servers if dependencies exist
* can retry on sync errors

cons:

if central server fails, need to redo syncing. To combat this each server can store their state, so when the central server comes back online, it can poll the cluster to see what needs to be done and recreate its lists

### How will you design the backend of product recommender system on amazon.com

1.  Depending upon what he is searching on
1.  Relating that searched Item to what he Purchased in the history
1.  Respecting User preference on Public Review of the Product
1.  Products that People who bought the same product along with the product searched by the current User.
1.  Best Brand Products that matches the searched product.
1.  Sort according to the best discount on the product searched
1.  Product which offers Free Shipping

Coming to the Design

The search itself can arrange the matched items in a tree/Graph structure. When the user traversing down a path, user is exploring more and more since the system should never be able to say that it can no longer search your product. Check the movie online assessment
