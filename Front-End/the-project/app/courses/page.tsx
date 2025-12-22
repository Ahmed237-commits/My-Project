'use client';
import Head from 'next/head';
import { FaArrowCircleDown ,FaCheckCircle  } from 'react-icons/fa';
import sal from 'sal.js';
import "sal.js/dist/sal.css";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const courses = [
  {
    title: 'Grammar Essentials',
    description: 'Master the fundamental rules of English grammar, from parts of speech to sentence structure. Perfect for beginners and those looking to refresh their knowledge.',
    features: ['10 Lessons', '20 Hours of Content', 'Beginner Friendly'],
    image: 'https://images.unsplash.com/photo-1510531704581-5b57e9dad773?auto=format&fit=crop&q=80&w=2940'
  },
  {
    title: 'Advanced Writing Skills',
    description: 'Learn to write compelling essays, professional emails, and creative stories. Focuses on style, tone, and organization for effective communication.',
    features: ['15 Lessons', '30 Hours of Content', 'Intermediate to Advanced'],
    image: 'https://images.unsplash.com/photo-1549414902-602967657980?auto=format&fit=crop&q=80&w=2940'
  },
  {
    title: 'Conversational English',
    description: 'Build confidence in speaking English with practical exercises, role-playing, and guided conversations on a variety of topics. Improve your fluency and pronunciation.',
    features: ['12 Lessons', '18 Hours of Content', 'All Levels'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2940'
  }
];

// ✅ Course Card Component
function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transform hover:scale-105 transition duration-300">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover transform hover:scale-110 transition duration-500"
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-700 mb-4">{course.description}</p>
        <ul className="list-none space-y-2 mb-6">
          {course.features.map((feature, i) => (
            <li key={i} className="flex items-center text-gray-600">
              <span className="text-blue-500 mr-2">⭐</span>
              {feature}
            </li>
          ))}
        </ul>
        <button className="w-full flex items-center text-2xl cursor-grabbing justify-center gap-2  bg-green-500 text-white py-3 px-4 rounded-full hover:bg-green-600 transition-colors duration-300">
          <FaCheckCircle /> Enroll Now
        </button>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { data, status } = useSession();

  useEffect(() => {
    sal({
      threshold: 0.1,
      once: true,
      root: null
    });
  }, []);

  if (status === "loading") {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (status !== "authenticated") {
    return <p className="text-center mt-20 text-red-500">Please sign in to view the courses.</p>;
  }

  return (
    <>
      <Head>
        <title>English Teacher - Courses</title>
        <meta name="description" content="Explore and enroll in our English language courses." />
      </Head>

      <div className="bg-gray-100 min-h-screen">
        <header className="bg-blue-600 text-white p-6 text-center">
          <div className="container mx-auto">
            <h1 className="text-4xl">Welcome {data?.user?.name}</h1>
            <p className="text-xl mt-2">
              This Is Our Courses <FaArrowCircleDown className="inline-block animate-bounce" />
            </p>
          </div>
        </header>

        <main className="container mx-auto p-8">
          <section className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-3xl text-center text-blue-800">Our Courses</h2>
            <p className="text-center text-lg mt-4 text-gray-700">
              Welcome to a world of language! Explore the courses designed to help you master English.
            </p>
          </section>

          <section
            data-sal="slide-up"
            data-sal-delay="150"
            data-sal-duration="800"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </section>
        </main>

        <footer className="bg-gray-800 text-white p-6 text-center mt-8">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} Teacher's Name. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
