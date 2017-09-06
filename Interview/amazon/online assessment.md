
### Given a movie, find similar movies

```csharp
using System;
using System.Linq;
using System.Collections.Generic;

namespace MyCollections
{
	public class Movie
	{
		private readonly int movieId;
		private readonly float rating;
		private List<Movie> similarMovies;
		// Similarity is bidirectional

		public Movie(int movieId, float rating)
		{
			this.movieId = movieId;
			this.rating = rating;
			similarMovies = new List<Movie>();
		}

		public int getId()
		{
			return movieId;
		}

		public float getRating()
		{
			return rating;
		}

		public float Rating
		{
			get
			{
				return rating;
			}
		}

		public int Id
		{
			get
			{
				return movieId;
			}
		}

		public void addSimilarMovie(Movie movie)
		{
			similarMovies.Add(movie);
			movie.similarMovies.Add(this);
		}

		public List<Movie> getSimilarMovies()
		{
			return similarMovies;
		}

		/*
         * Implement a function to return top rated movies in the network of movies 
         * reachable from the current movie
         * eg:            A(Rating 1.2)
         *               /   \
         *            B(2.4)  C(3.6)
         *              \     /
         *               D(4.8)
         * In the above example edges represent similarity and the number is rating.
         * getMovieRecommendations(A,2)should return C and D (sorting order doesn't matter so it can also return D and C)
         * getMovieRecommendations(A,4) should return A, B, C, D (it can also return these in any order eg: B,C,D,A)
         * getMovieRecommendations(A,1) should return D. Note distance from A to D doesn't matter, return the highest rated.
         *     
         *     @param movie
         *     @param numTopRatedSimilarMovies: number of movies we want to return
         *     @return List of top rated similar movies
         */
		public static IList<Movie> getMovieRecommendations(Movie movie, int numTopRatedSimilarMovies)
		{
			if (movie == null)
			{
				throw new ArgumentNullException("movie");
			}

			HashSet<Movie> moviesInNetwork = new HashSet<Movie>(new MovieComparer());

			// Flatten the network in a HashSet<Movie>
			// Two problems with my implementation:
			// 1. It's recursive so it won't work for very large networks (as demonstrated in the sample Program below)
			// 2. It's O(n^2), worst case when every single movie is related to every other movies (n*(n-1)), not so good...
			GetDistinctMovies(movie, moviesInNetwork);

			// Order the movies by rating value (descending) and take the number of movies we want to return.
			// Orderby is a quicksort O(nlog(n))
			// I cannot make any assumption concerning the numTopRatedSimilarMovies range so I didn't try to optimize anything here.
			return (from m in moviesInNetwork
					orderby m.Rating descending
					select m).Take(numTopRatedSimilarMovies).ToList();
		}

		private static void GetDistinctMovies(Movie movie, HashSet<Movie> knownMovies)
		{
			// Contains method is O(1) for HashSet<T>
			if (knownMovies.Contains(movie)) return;

			// Add method is O(1) for HashSet<T> 
			knownMovies.Add(movie);

			foreach (var similarMovie in movie.getSimilarMovies())
			{
				GetDistinctMovies(similarMovie, knownMovies);
			}
		}

		/// <summary>
		/// Movie comparer, used in the HashSet<Movie> constructor. I assumed movie Ids are unique.
		/// </summary>
		private class MovieComparer : IEqualityComparer<Movie>
		{
			public bool Equals(Movie m1, Movie m2)
			{
				return m1.Id == m2.Id;
			}

			public int GetHashCode(Movie movie)
			{
				return movie.Id;
			}
		}
	}

	public class Program
	{
		public static void Main()
		{
			try
			{
				Movie.getMovieRecommendations(null, 10);
			}
			catch (ArgumentNullException ex)
			{
				Console.WriteLine(ex.Message);
			}

			var A = new Movie(0, 1.2f);
			var B = new Movie(1, 2.4f);
			var C = new Movie(2, 3.6f);

			A.addSimilarMovie(B);
			A.addSimilarMovie(C);

			//B.addSimilarMovie (C);

			var D = new Movie(3, 4.8f);

			D.addSimilarMovie(B);
			D.addSimilarMovie(C);
			//D.addSimilarMovie (A);

			ShowRecommentations(A, 2);
			ShowRecommentations(A, 4);
			ShowRecommentations(A, 1);

			Console.WriteLine("Now with a very **deep** network");

			Random rating = new Random();
			var movieId = 0;
			var X = new Movie(movieId, (float)rating.NextDouble() * 5);

			var currentMovie = X;
			while (movieId < 1000000)
			{
				movieId++;
				var newMovie = new Movie(movieId, (float)rating.NextDouble() * 5);
				currentMovie.addSimilarMovie(newMovie);
				currentMovie = newMovie;
			}

			try
			{
				ShowRecommentations(X, 20);
			}
			catch (StackOverflowException e)
			{
				Console.WriteLine(e.Message);
			}

			Console.ReadKey();
		}

		public static void ShowRecommentations(Movie movie, int numTopRatedSimilarMovies)
		{
			var recommendations = Movie.getMovieRecommendations(movie, numTopRatedSimilarMovies);

			Console.WriteLine("If you like movie {0}, we recommend those {1} movies: ", movie.Id, numTopRatedSimilarMovies);

			foreach (var recommendation in recommendations)
			{
				Console.WriteLine("Movie {0}, rated {1}", recommendation.Id, recommendation.Rating);
			}
		}
	}
}
```

### [balanced Parenthesis](../algorithm/algorithm.md)





